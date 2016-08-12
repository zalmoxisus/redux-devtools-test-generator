export const name = 'Tape template';

export const action = ({ action, prevState }) => (
  `state = reducers(${prevState}, ${action});`
);

export const assertion = ({ path, curState }) => (
  `t.deepEqual(state${path}, ${curState});`
);

export const wrap = ({ assertions }) => (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  ${assertions}
  t.end();
});
`);

export default { name, assertion, action, wrap };
