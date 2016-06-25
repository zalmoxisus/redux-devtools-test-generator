export const assertion = '  t.deepEqual(reducers(${prevState}, ${action}).toEqual(${curState}));';

export const wrap = (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  \${assertions}
});
`);

export default { assertion, wrap };
