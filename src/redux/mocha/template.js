export const expect = '    expect(reducers(${prevState}, ${action}).toEqual(${curState}));';

export const wrap = (
  `import expect from 'expect';
import reducers from '../../reducers';

describe('reducers', () => {
  it('should handle actions', () => {
    \${expects}
  })
})
`);

export default { expect, wrap };
