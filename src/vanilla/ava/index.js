export const name = 'Ava template';

export const assertion = ({ action, curState }) => (
  `  ${action}; expect(${curState}).toMatch(store));`
);

export const wrap = ({ name, initialState, assertions }) => (
  `import test from 'ava';
import expect from 'expect';
import ${name} from '../../stores/${name}';

test('${name}', t => {
  const store = new ${name}(${initialState}); 
  ${assertions}
});
`);

export default { name, assertion, wrap };
