let env = 'development';

if (process.env.NODE_ENV) {
  env = process.env.NODE_ENV;
}

module.exports = env;
