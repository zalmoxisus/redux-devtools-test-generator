export const name = 'Tape template';

export const assertion = ({ action, prevState, curState }) => (
  `    t.deepEqual(reducers(${prevState}, ${action}).toEqual(${curState}));`
);

export const wrap = ({ assertions }) => (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  ${assertions}
  t.end();
});
`);

export default { name, assertion, wrap };
