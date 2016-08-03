export const assertion = '  ${action}; t.ok(expect(${curState}).toMatch(store)));';

export const wrap = (
  `import test from 'tape';
import expect from 'expect';
import \${name} from '../../stores/\${name}';

test('\${name}', t => {
  const store = new \${name}(\${initialState}); 
  \${assertions}
  t.end();
});
`);

export default { assertion, wrap };
