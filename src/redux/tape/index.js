export const expect = ({ action, prevState, curState }) => (
  `    t.deepEqual(reducers(${prevState}, ${action}).toEqual(${curState}));`
);

export const wrap = ({ expects }) => (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  ${expects}
});
`);

export default { expect, wrap };
