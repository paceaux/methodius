const { Methodius } = require('../dist/main.js');

describe('Methodius Build Test', () => {
  it('actually builds to dist', () => {
    const test = new Methodius('Hey there I am a test. This works. I hope and think.');
    expect(test.bigrams.length).toBeGreaterThan(0);
  });
});
