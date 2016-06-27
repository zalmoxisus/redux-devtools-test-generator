export const assertion = '  t.deepEqual(reducers(${prevState}, ${action}), ${curState});';

export const wrap = (
  `import test from 'ava';
import reducers from '../../reducers';
test('reducers', t => {
  \${assertions}
});
`);

export default { assertion, wrap };
