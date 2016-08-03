export const assertion = '  ${action}; expect(${curState}).toMatch(store));';

export const wrap = (
  `import test from 'ava';
import expect from 'expect';
import \${name} from '../../stores/\${name}';

test('\${name}', () => {
  const store = new \${name}(\${initialState}); 
  \${assertions}
});
`);

export default { assertion, wrap };
