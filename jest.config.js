module.exports = {
  testMatch: [
    '(/test/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};
