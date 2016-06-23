import React, { Component, PropTypes } from 'react';
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

  get generateTest() {
    const {
      computedStates, actions, selectedActionId, startActionId,
      wrap, expect
    } = this.props;
    let r = '';
    let i;
    if (startActionId !== null) i = startActionId;
    else if (selectedActionId !== null) i = selectedActionId;
    else i = computedStates.length - 1;

    do {
      r += expect(
          JSON.stringify(actions[i].action),
          i > 0 ? JSON.stringify(computedStates[i - 1].state) : undefined,
          JSON.stringify(computedStates[i].state)
        ) + '\n';
      i++;
    } while (i <= selectedActionId);

    r = r.trim();
    if (wrap) r = wrap(r);
    return r;
  }

  render() {
    if (!this.props.expect) {
      return (
        this.props.noTestWarning ||
          <div style={{ margin: '10px' }}>No template for tests specified.</div>
      );
    }

    return (
      <CodeMirror
        value={this.generateTest}
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
  wrap: PropTypes.func,
  expect: PropTypes.func,
  theme: PropTypes.string,
  noTestWarning: PropTypes.element
};
