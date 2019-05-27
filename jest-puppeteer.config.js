/* eslint-disable */
const path = require('path');

module.exports = {
  launch: {
    dumpio: true,
    headless: false,
    args: [
      '--load-extension=' + path.join(__dirname, 'ext'),
      '--disable-extensions-except=' + path.join(__dirname, 'ext'),
    ]
  },
  browserContext: 'default',
}
