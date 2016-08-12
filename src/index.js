import React, { Component, PropTypes } from 'react';
import stringify from 'javascript-stringify';
import objectPath from 'object-path';
import fclone from 'fclone';
import diff from 'simple-diff';
import es6template from 'es6template';
import CodeMirror from 'react-codemirror';

const style = {
  display: 'flex',
  flexFlow: 'column nowrap',
  height: 'calc(100% - 3.5em)'
};

export const fromPath = (path) => (
  path
    .slice(1)
    .map(a => (
      typeof a === 'string' ? `.${a}` : `[${a}]`
    ))
    .join('')
);

export function compare(s1, s2, cb) {
  const paths = []; // Already processed
  diff(fclone(s1), fclone(s2), { idProp: '*' })
    .forEach(({ type, newPath, newValue }) => {
      let curState;
      let path = fromPath(newPath);
      if (paths.length && paths.indexOf(path) !== -1) return;

      if (type === 'remove-item' || type === 'move-item') {
        paths.push(path);
        const v = objectPath.get(s2, newPath);
        curState = v.length;
        path += '.length';
      } else if (type === 'add-item') {
        path += `[${newIndex}]`;
        curState = stringify(newValue);
      } else {
        curState = stringify(newValue);
      }

      // console.log(`expect(store${path}).toEqual(${curState});`);
      cb({ path, curState });
    });
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

  options = {
    mode: 'javascript',
    lineNumbers: true
  };

  generateTest() {
    const {
      computedStates, actions, selectedActionId, startActionId, isVanilla, name
    } = this.props;

    if (!actions || !computedStates || computedStates.length < 2) return '';

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

    do {
      if (!isVanilla || /^┗?\s?[a-zA-Z0-9_.\[\]-]+?$/.test(actions[i].action.type)) {
        if (isFirst) isFirst = false;
        else r += space;
        r += dispatcher({
          action: !isVanilla ?
            stringify(actions[i].action) :
            this.getMethod(actions[i].action),
          prevState: i > 0 ? stringify(computedStates[i - 1].state) : undefined
        }) + '\n';
        compare(computedStates[i - 1], computedStates[i], addAssertions);
      }
      i++;
    } while (i <= selectedActionId);

    r = r.trim();
    if (wrap) {
      if (!isVanilla) r = wrap({ name, assertions: r });
      else {
        r = wrap({
          name: /^[a-zA-Z0-9_-]+?$/.test(name) ? name : 'Store',
          actionName: actions[startIdx].action.type.replace(/[^a-zA-Z0-9_-]+/, ''),
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
