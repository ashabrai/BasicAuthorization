'use strict';

const HttpError = require('http-errors');
const jsonWebToken = require('jsonwebtoken');
const BankAccount = require('../model/bankAccount');

/**
 *
 * @param callbackStyleFunction
 * @param args - any arguments we need to pass to callBackStyleFunction
 * @returns
 */

const promisify = callbackStyleFunction => (...args) => {
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

module.exports = (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const token = request.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return promisify(jsonWebToken.verify)(token, process.env.SECRET)
    .then((decryptedToken) => {
      return BankAccount.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
