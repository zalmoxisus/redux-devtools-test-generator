import React, { Component, PropTypes } from 'react';
import { Toolbar, Container, Button, Select, Notification, Dialog } from 'remotedev-ui';
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
  constructor(props) {
    super(props);
    this.state = { dialogStatus: null };
  }

  onSelectTemplate = selected => {
    this.updateState({ selected });
  };

  onCloseTip = () => {
    this.updateState({ hideTestTip: true });
  };

  onCloseDialog = () => {
    this.setState({ dialogStatus: null });
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 'Add' });
  };

  editTemplate = () => {
    this.setState({ dialogStatus: 'Edit' });
  };

  updateState = state => {
    this.props.dispatch(updateMonitorState(state));
  };

  render() {
    const { monitorState, dispatch, ...rest } = this.props; // eslint-disable-line no-unused-vars
    const { dialogStatus } = this.state;
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
          <Button onClick={this.editTemplate}><EditIcon /></Button>
          <Button onClick={this.addTemplate}><AddIcon /></Button>
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
        {!monitorState.hideTestTip && assertion && rest.startActionId === null &&
          <Notification onClose={this.onCloseTip}>
            Hold <b>SHIFT</b> key to select more actions.
          </Notification>
        }
        {dialogStatus &&
          <Dialog
            open
            onDismiss={this.onCloseDialog}
            actions={[
              <Button key="cancel" onClick={this.onDismiss}>Cancel</Button>,
              <Button key="remove" onClick={this.onRemove}>Remove</Button>,
              <Button key="submit" primary onClick={this.onSubmit}>{dialogStatus}</Button>
            ]}
          >
          </Dialog>
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
