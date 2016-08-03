export const name = 'Mocha template';

export const assertion = ({ action, prevState, curState }) => (
  `    expect(reducers(${prevState}, ${action}).toEqual(${curState}));`
);

export const wrap = ({ assertions }) => (
  `import expect from 'expect';
import reducers from '../../reducers';

describe('reducers', () => {
  it('should handle actions', () => {
    ${assertions}
  });
});
`);

export default { name, assertion, wrap };
