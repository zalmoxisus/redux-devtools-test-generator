import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
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

describe('TestGenerator component', () => {
  it('should show warning message when no params provided', () => {
    const component = render(<TestGenerator />);
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should be empty when no actions provided', () => {
    const component = render(
      <TestGenerator
        assertion={fnTemplate.assertion} dispatcher={fnTemplate.dispatcher} wrap={fnTemplate.wrap}
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should match function template\'s test for first action', () => {
    const component = render(
      <TestGenerator
        assertion={fnTemplate.assertion} dispatcher={fnTemplate.dispatcher} wrap={fnTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should match string template\'s test for first action', () => {
    const component = render(
      <TestGenerator
        assertion={strTemplate.assertion} dispatcher={strTemplate.dispatcher}
        wrap={strTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should generate test for the last action when selectedActionId not specified', () => {
    const component = render(
      <TestGenerator
        assertion={fnTemplate.assertion} dispatcher={fnTemplate.dispatcher} wrap={fnTemplate.wrap}
        actions={actions} computedStates={computedStates}
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should generate test for vanilla js class', () => {
    const component = render(
      <TestGenerator
        assertion={fnVanillaTemplate.assertion} dispatcher={fnVanillaTemplate.dispatcher}
        wrap={fnVanillaTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
        isVanilla name="SomeStore"
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('should generate test for vanilla js class with string template', () => {
    const component = render(
      <TestGenerator
        assertion={strVanillaTemplate.assertion} dispatcher={strVanillaTemplate.dispatcher}
        wrap={strVanillaTemplate.wrap}
        actions={actions} computedStates={computedStates} selectedActionId={1}
        isVanilla name="SomeStore"
      />
    );
    expect(renderToJson(component)).toMatchSnapshot();
  });
});
