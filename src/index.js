import React, { Component, PropTypes } from 'react';
import stringify from 'javascript-stringify';
import objectPath from 'object-path';
import jsan from 'jsan';
import diff from 'simple-diff';
import es6template from 'es6template';
import CodeMirror from 'react-codemirror';

const style = {
  display: 'flex',
  flexFlow: 'column nowrap',
  height: '100%'
};

export const fromPath = (path) => (
  path
    .map(a => (
      typeof a === 'string' ? `.${a}` : `[${a}]`
    ))
    .join('')
);

function getState(s, defaultValue) {
  if (!s) return defaultValue;
  return JSON.parse(jsan.stringify(s.state));
}

export function compare(s1, s2, cb, defaultValue) {
  const paths = []; // Already processed
  function generate({ type, newPath, newValue, newIndex }) {
    let curState;
    let path = fromPath(newPath);

    if (type === 'remove-item' || type === 'move-item') {
      if (paths.length && paths.indexOf(path) !== -1) return;
      paths.push(path);
      const v = objectPath.get(s2.state, newPath);
      curState = v.length;
      path += '.length';
    } else if (type === 'add-item') {
      generate({ type: 'move-item', newPath });
      path += `[${newIndex}]`;
      curState = stringify(newValue);
    } else {
      curState = stringify(newValue);
    }

    // console.log(`expect(store${path}).toEqual(${curState});`);
    cb({ path, curState });
  }

  diff(getState(s1, defaultValue), getState(s2, defaultValue)/* , { idProp: '*' } */)
    .forEach(generate);
}

export default class TestGenerator extends Component {
  constructor(props) {
    super(props);
    if (props.theme) this.options.theme = props.theme;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.theme && nextProps.theme !== this.options.theme) {
      this.options.theme = nextProps.theme;
    }
  }

  getMethod(action) {
    let type = action.type;
    if (type[0] === '┗') type = type.substr(1).trim();
    let args = action.arguments;
    if (args) args = args.map(arg => stringify(arg)).join(',');
    else args = '';
    return `${type}(${args})`;
  }

  getAction(action) {
    if (action.type === '@@INIT') return '{}';
    return stringify(action);
  }

  options = {
    mode: 'javascript',
    lineNumbers: true
  };

  generateTest() {
    const {
      computedStates, actions, selectedActionId, startActionId, isVanilla, name
    } = this.props;

    if (!actions || !computedStates || computedStates.length < 1) return '';

    let { wrap, assertion, dispatcher, indentation } = this.props;
    if (typeof assertion === 'string') assertion = es6template.compile(assertion);
    if (typeof wrap === 'string') {
      const ident = wrap.match(/\n.+\$\{assertions}/);
      if (ident) indentation = ident[0].length - 13;
      wrap = es6template.compile(wrap);
    }
    if (typeof dispatcher === 'string') dispatcher = es6template.compile(dispatcher);

    let space = '';
    if (indentation) space = Array(indentation).join(' ');

    let r = '';
    let isFirst = true;
    let i;
    if (startActionId !== null) i = startActionId;
    else if (selectedActionId !== null) i = selectedActionId;
    else i = computedStates.length - 1;
    const startIdx = i > 0 ? i : 1;

    const addAssertions = ({ path, curState }) => {
      r += space + assertion({ path, curState }) + '\n';
    };

    while (actions[i]) {
      if (!isVanilla || /^┗?\s?[a-zA-Z0-9_@.\[\]-]+?$/.test(actions[i].action.type)) {
        if (isFirst) isFirst = false;
        else r += space;
        if (!isVanilla || actions[i].action.type[0] !== '@') {
          r += dispatcher({
            action: !isVanilla ?
              this.getAction(actions[i].action) :
              this.getMethod(actions[i].action),
            prevState: i > 0 ? stringify(computedStates[i - 1].state) : undefined
          }) + '\n';
        }
        if (!isVanilla) {
          addAssertions({ path: '', curState: stringify(computedStates[i].state) });
        } else {
          compare(computedStates[i - 1], computedStates[i], addAssertions, isVanilla && {});
        }
      }
      i++;
      if (i > selectedActionId) break;
    }

    r = r.trim();
    if (wrap) {
      if (!isVanilla) r = wrap({ name, assertions: r });
      else {
        r = wrap({
          name: /^[a-zA-Z0-9_-]+?$/.test(name) ? name : 'Store',
          actionName: (selectedActionId === null || selectedActionId > 0) && actions[startIdx] ?
            actions[startIdx].action.type.replace(/[^a-zA-Z0-9_-]+/, '') :
            'should return the initial state',
          initialState: stringify(computedStates[startIdx - 1].state),
          assertions: r
        });
      }
    }
    return r;
  }

  render() {
    let testComponent;
    let warning;
    if (!this.props.assertion) {
      warning = (
        this.props.noTestWarning ||
          <div style={{ margin: '10px' }}>No template for tests specified.</div>
      );
    } else {
      const code = this.generateTest();

      if (!this.props.useCodemirror) {
        testComponent = (
          <textarea
            style={{ padding: '10px', width: '100%', height: '100%' }}
            defaultValue={code}
          />
        );
      } else {
        testComponent = (
          <CodeMirror
            value={code}
            options={this.options}
          />
        );
      }
      if (this.props.startActionId === null) {
        warning = (
          <div
            style={{ padding: '10px', backgroundColor: '#247b98' }}
          >Hold <b>SHIFT</b> key to select more actions.</div>
        );
      }
    }

    const { header } = this.props;
    return (
      <div style={style}>
        {header}
        {testComponent}
        {warning}
      </div>
    );
  }
}

TestGenerator.propTypes = {
  name: PropTypes.string,
  isVanilla: PropTypes.bool,
  computedStates: PropTypes.array,
  actions: PropTypes.object,
  selectedActionId: PropTypes.number,
  startActionId: PropTypes.number,
  wrap: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  dispatcher: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  assertion: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  indentation: PropTypes.number,
  useCodemirror: PropTypes.bool,
  theme: PropTypes.string,
  header: PropTypes.element,
  noTestWarning: PropTypes.element
};

TestGenerator.defaultProps = {
  selectedActionId: null,
  startActionId: null
};
