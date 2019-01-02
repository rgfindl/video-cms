const uuid = require('../uuid');

it('test jwt', async () => {
  const id = uuid();
  expect(id).toBeDefined();
});