const crypto = require("crypto");
const util = require("util");
// this take a callback version of randomBytes and return a promise based function
export const randomBytes = util.promisify(crypto.randomBytes);
