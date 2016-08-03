export const name = 'Tape template';

export const assertion = ({ action, curState }) => (
  `  ${action}; t.ok(expect(${curState}).toMatch(store)));`
);

export const wrap = ({ name, initialState, assertions }) => (
  `import test from 'tape';
import expect from 'expect';
import ${name} from '../../stores/${name}';

test('${name}', t => {
  const store = new ${name}(${initialState}); 
  ${assertions}
  t.end();
});
`);

export default { name, assertion, wrap };
