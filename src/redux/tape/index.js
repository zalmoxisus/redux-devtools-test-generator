export const assertion = ({ action, prevState, curState }) => (
  `    t.deepEqual(reducers(${prevState}, ${action}).toEqual(${curState}));`
);

export const wrap = ({ assertions }) => (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  ${assertions}
});
`);

export default { assertion, wrap };
