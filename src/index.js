import React, { Component, PropTypes } from 'react';
import es6template from 'es6template';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

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
    if (!this.props.expect) {
      return (
        this.props.noTestWarning ||
          <div style={{ margin: '10px' }}>No template for tests specified.</div>
      );
    }

    const code = this.generateTest();

    if (!this.props.useCodemirror) {
      return (
        <textarea
          style={{ padding: '10px', width: '100%', height: '100%' }}
          defaultValue={code}
        />
      );
    }

    return (
      <CodeMirror
        value={code}
        options={this.options}
      />
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
  noTestWarning: PropTypes.element
};

TestGenerator.defaultProps = {
  selectedActionId: null,
  startActionId: null
};
