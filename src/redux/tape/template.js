export const name = 'Tape template';

export const action = 'state = reducers(${prevState}, ${action});';

export const assertion = 't.deepEqual(state${path}, ${curState});';

export const wrap = (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  \${assertions}
  t.end();
});
`);

export default { name, assertion, action, wrap };
