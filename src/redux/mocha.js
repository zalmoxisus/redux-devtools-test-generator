export const expect = (action, prevState, curState) => (
  `    expect(reducers(${prevState}, ${action}).toEqual(${curState}));`
);

export const wrap = (expects) => (
  `import expect from 'expect';
import reducers from '../../reducers';

describe('reducers', () => {
  it('should handle actions', () => {
    ${expects}
  })
})
`);

export default { expect, wrap };
