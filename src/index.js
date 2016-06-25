import React, { Component, PropTypes } from 'react';
import es6template from 'es6template';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

const style = {
  display: 'flex',
  flexFlow: 'column nowrap',
  height: 'calc(100% - 3.5em)'
};

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

  options = {
    mode: 'javascript',
    lineNumbers: true
  };

  generateTest() {
    const {
      computedStates, actions, selectedActionId, startActionId
    } = this.props;

    if (!actions || !computedStates || computedStates.length === 0) return '';

    let { wrap, expect } = this.props;
    if (typeof expect === 'string') expect = es6template.compile(expect);
    if (typeof wrap === 'string') wrap = es6template.compile(wrap);

    let r = '';
    let i;
    if (startActionId !== null) i = startActionId;
    else if (selectedActionId !== null) i = selectedActionId;
    else i = computedStates.length - 1;

    do {
      r += expect({
        action: JSON.stringify(actions[i].action),
        prevState: i > 0 ? JSON.stringify(computedStates[i - 1].state) : undefined,
        curState: JSON.stringify(computedStates[i].state)
      }) + '\n';
      i++;
    } while (i <= selectedActionId);

    r = r.trim();
    if (wrap) r = wrap({ expects: r });
    return r;
  }

  render() {
    let testComponent;
    if (!this.props.expect) {
      testComponent = (
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
    }

    const { header } = this.props;
    return (
      <div style={style}>
        {header}
        {testComponent}
      </div>
    );
  }
}

TestGenerator.propTypes = {
  computedStates: PropTypes.array,
  actions: PropTypes.object,
  selectedActionId: PropTypes.number,
  startActionId: PropTypes.number,
  wrap: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  expect: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  useCodemirror: PropTypes.bool,
  theme: PropTypes.string,
  header: PropTypes.element,
  noTestWarning: PropTypes.element
};

TestGenerator.defaultProps = {
  selectedActionId: null,
  startActionId: null
};
