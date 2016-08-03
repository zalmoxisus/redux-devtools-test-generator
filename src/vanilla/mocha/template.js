export const name = 'Mocha template';

export const assertion = '    ${action}; expect(${curState}).toMatch(store));';

export const wrap = (
  `import expect from 'expect';
import \${name} from '../../stores/\${name}';

describe('\${name}', () => {
  it('\${actionName}', () => {
    const store = new \${name}(\${initialState}); 
    \${assertions}
  });
});
`);

export default { name, assertion, wrap };
