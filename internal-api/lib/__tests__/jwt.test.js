const jwt = require('../jwt');

it('test jwt', async () => {
  process.env.JwtSecret = 'sheee';
  const token = await jwt.sign({foo: 'bar'});
  const obj = await jwt.verify(token);
  expect(obj.foo).toBe('bar');
});