export const assertion = ({ action, prevState, curState }) => (
  `  t.deepEqual(reducers(${prevState}, ${action}), ${curState});`
);

export const wrap = ({ assertions }) => (
  `import test from 'ava';
import reducers from '../../reducers';
test('reducers', t => {
  ${assertions}
});
`);

export default { assertion, wrap };
