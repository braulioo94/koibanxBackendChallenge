const auth =  require('basic-auth');
const User =  require('../models/user');
const logger = require('../utils/logger');

module.exports = authenticate;

async function authenticate(req, res, next) {
  const user = auth(req);
  if (!user)
    return res.status(400).send({ error: 'Auth Basic expected' });
  const result = await User.findOne({ username: user.name });
  if (!result)
    return res.status(401).send({ error: 'The entered user does not exist' });
  if (!result.verifyPassword(user.pass))
    return res.status(401).send({ error: 'The password entered is incorrect' });
  req.user = user;
  logger.info('Authentication successful.');
  return next();
}