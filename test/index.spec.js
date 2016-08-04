import expect from 'expect';
import React from 'react';
import stringify from 'javascript-stringify';
import { shallow } from 'enzyme';
import es6template from 'es6template';
import TestGenerator from '../src/';
import fnTemplate from '../src/redux/mocha';
import strTemplate from '../src/redux/mocha/template';
import fnVanillaTemplate from '../src/vanilla/mocha';
import strVanillaTemplate from '../src/vanilla/mocha/template';

const actions = {
  0: { type: 'PERFORM_ACTION', action: { type: '@@INIT' } },
  1: { type: 'PERFORM_ACTION', action: { type: 'INCREMENT_COUNTER' } }
};

const computedStates = [
  { state: { counter: 0 } },
  { state: { counter: 1 } }
];

function generateTemplate(i, tmp) {
  let r = tmp.assertion({
    action: stringify(actions[i].action),
    prevState: i > 0 ? stringify(computedStates[i - 1].state) : undefined,
    curState: stringify(computedStates[i].state)
  });
  r = r.trim();
  r = tmp.wrap({ assertions: r });
  return r;
}

function generateVanillaTemplate(i, tmp) {
  let args = actions[i].action.arguments;
  if (args) args = args.join(',');
  else args = '';
  let r = tmp.assertion({
    action: `${actions[i].action.type}(${args})`,
    curState: stringify(computedStates[i].state)
  });
  r = r.trim();
  r = tmp.wrap({
    name: 'SomeStore',
    actionName: actions[i].action.type,
    initialState: i > 0 ? stringify(computedStates[i - 1].state) : '',
    assertions: r
  });
  return r;
}

describe('TestGenerator component', () => {
  it('should show warning message when no params provided', () => {
    const component = shallow(<TestGenerator />);
    expect(component.text()).toMatch(/^No template for tests specified./);
  });

  it('should be empty when no actions provided', () => {
    const component = shallow(
      <TestGenerator
        assertion={fnTemplate.assertion} wrap={fnTemplate.wrap}
      />
    );
    expect(component.find('textarea').props().defaultValue).toBe('');
  });

  it('should match function template\'s test for first action', () => {
    const component = shallow(
      <TestGenerator
        assertion={fnTemplate.assertion} wrap={fnTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateTemplate(1, fnTemplate)
    );
  });

  it('should match string template\'s test for first action', () => {
    const tmp = {
      assertion: es6template.compile(strTemplate.assertion),
      wrap: es6template.compile(strTemplate.wrap)
    };
    const component = shallow(
      <TestGenerator
        assertion={strTemplate.assertion} wrap={strTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateTemplate(1, tmp)
    );
  });

  it('should generate test for the last action when selectedActionId not specified', () => {
    const component = shallow(
      <TestGenerator
        assertion={fnTemplate.assertion} wrap={fnTemplate.wrap}
        actions={actions} computedStates={computedStates}
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateTemplate(computedStates.length - 1, fnTemplate)
    );
  });

  it('should generate test for vanilla js class', () => {
    const component = shallow(
      <TestGenerator
        assertion={fnVanillaTemplate.assertion} wrap={fnVanillaTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
        isVanilla name="SomeStore"
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateVanillaTemplate(1, fnVanillaTemplate)
    );
  });

  it('should generate test for vanilla js class with string template', () => {
    const tmp = {
      assertion: es6template.compile(strVanillaTemplate.assertion),
      wrap: es6template.compile(strVanillaTemplate.wrap)
    };
    const component = shallow(
      <TestGenerator
        assertion={strVanillaTemplate.assertion} wrap={strVanillaTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
        isVanilla name="SomeStore"
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateVanillaTemplate(1, tmp)
    );
  });
});
