import React, { Component, PropTypes } from 'react';
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
  render() {
    const { selected = 0 } = this.props;
    const templates = this.props.templates || getDefaultTemplates();
    const template = templates[selected];
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
  templates: PropTypes.array,
  selected: PropTypes.number,
};
