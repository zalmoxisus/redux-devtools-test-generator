import React, { Component, PropTypes } from 'react';
import { Toolbar, Container, Button, Select, Notification } from 'remotedev-ui';
import AddIcon from 'react-icons/lib/md/add';
import EditIcon from 'react-icons/lib/md/edit';
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
      <Container>
        <Toolbar>
          <Select
            options={templates}
            valueKey="name"
            labelKey="name"
            value={selected}
            onChange={this.onSelectTemplate}
          />
          <Button><EditIcon /></Button>
          <Button><AddIcon /></Button>
        </Toolbar>
        {!assertion ?
          <Notification>
            No template for tests specified.
          </Notification>
        :
          <TestGenerator
            isVanilla={false}
            assertion={assertion}
            dispatcher={dispatcher}
            wrap={wrap}
            {...rest}
          />
        }
        {assertion && rest.startActionId === null &&
          <Notification>
            Hold <b>SHIFT</b> key to select more actions.
          </Notification>
        }
      </Container>
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
