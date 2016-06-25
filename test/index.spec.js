import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import es6template from 'es6template';
import TestGenerator from '../src/';
import fnTemplate from '../src/redux/mocha';
import strTemplate from '../src/redux/mocha/template';

const actions = {
  0: { type: 'PERFORM_ACTION', action: { type: '@@INIT' } },
  1: { type: 'PERFORM_ACTION', action: { type: 'INCREMENT_COUNTER' } }
};

const computedStates = [
  { state: { counter: 0 } },
  { state: { counter: 1 } }
];

function generateTemplate(i, tmp) {
  let r = tmp.expect({
    action: JSON.stringify(actions[i].action),
    prevState: i > 0 ? JSON.stringify(computedStates[i - 1].state) : undefined,
    curState: JSON.stringify(computedStates[i].state)
  });
  r = r.trim();
  r = tmp.wrap({ expects: r });
  return r;
}

describe('TestGenerator component', () => {
  it('should show warning message when no params provided', () => {
    const component = shallow(<TestGenerator />);
    expect(component.find('div').text()).toMatch(/^No template for tests specified./);
  });

  it('should be empty when no actions provided', () => {
    const component = shallow(
      <TestGenerator
        expect={fnTemplate.expect} wrap={fnTemplate.wrap}
      />
    );
    expect(component.find('textarea').props().defaultValue).toBe('');
  });

  it('should match function template\'s test for first action', () => {
    const component = shallow(
      <TestGenerator
        expect={fnTemplate.expect} wrap={fnTemplate.wrap}
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
      expect: es6template.compile(strTemplate.expect),
      wrap: es6template.compile(strTemplate.wrap)
    };
    const component = shallow(
      <TestGenerator
        expect={fnTemplate.expect} wrap={fnTemplate.wrap}
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
        expect={fnTemplate.expect} wrap={fnTemplate.wrap}
        actions={actions} computedStates={computedStates}
      />
    );
    expect(
      component.find('textarea').props().defaultValue
    ).toBe(
      generateTemplate(computedStates.length - 1, fnTemplate)
    );
  });
});
