import React, { Component, PropTypes } from 'react';
import { updateMonitorState } from 'remotedev-inspector-monitor/lib/redux';
import TestGenerator from './TestGenerator';
import jestTemplate from './redux/jest/template';
import mochaTemplate from './redux/mocha/template';
import tapeTemplate from './redux/tape/template';
import avaTemplate from './redux/ava/template';

export const getDefaultTemplates = (/* lib */) => (
  /*
   if (lib === 'redux') {
   return [mochaTemplate, tapeTemplate, avaTemplate];
   }
   return [mochaVTemplate, tapeVTemplate, avaVTemplate];
   */
  [jestTemplate, mochaTemplate, tapeTemplate, avaTemplate]
);

export default class TestTab extends Component {
  onSelectTemplate = selected => {
    this.props.dispatch(updateMonitorState({ selected }));
  };

  render() {
    const { monitorState, dispatch, ...rest } = this.props; // eslint-disable-line no-unused-vars
    let { selected = 'Jest template' } = monitorState;
    const templates = monitorState.templates || getDefaultTemplates();
    let template = templates.find(t => t.name === selected);
    if (!template) {
      template = templates[0]; selected = template.name;
    }
    const { assertion, dispatcher, wrap } = template;

    return (
      <TestGenerator
        isVanilla={false}
        assertion={assertion} dispatcher={dispatcher} wrap={wrap}
        theme="night" useCodemirror
        {...this.props}
      />
    );
  }
}

TestTab.propTypes = {
  monitorState: PropTypes.shape({
    templates: PropTypes.array,
    selected: PropTypes.string
  }).isRequired,
  /*
  options: PropTypes.shape({
    lib: PropTypes.string
  }).isRequired,
  */
  dispatch: PropTypes.func.isRequired
};
