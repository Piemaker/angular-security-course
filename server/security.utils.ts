import moment = require("moment");
const util = require("util");
const crypto = require("crypto");
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

export const randomBytes = util.promisify(crypto.randomBytes);

const RSA_PRIVATE_KEY = fs.readFileSync("./demos/private.key");

const RSA_PUBLIC_KEY = fs.readFileSync("./demos/public.key");

export const signJwt = util.promisify(jwt.sign);

const SESSION_DURATION = 240;

const ALGORITHM = "RS256";

export const createSessionToken = async (userId: string) => {
  const payload = {};
  return signJwt(payload, RSA_PRIVATE_KEY, {
    algorithm: ALGORITHM,
    expiresIn: SESSION_DURATION,
    subject: userId,
  });
};

export const decodeJwt = async (token: string) => {
  return jwt.verify(token, RSA_PUBLIC_KEY);
};
