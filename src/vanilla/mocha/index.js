export const name = 'Mocha template';

export const assertion = ({ action, curState }) => (
  `    ${action}; expect(${curState}).toMatch(store));`
);

export const wrap = ({ name, actionName, initialState, assertions }) => (
  `import expect from 'expect';
import ${name} from '../../stores/${name}';

describe('${name}', () => {
  it('${actionName}', () => {
    const store = new ${name}(${initialState}); 
    ${assertions}
  });
});
`);

export default { name, assertion, wrap };
