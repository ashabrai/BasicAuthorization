'use strict';

const HttpError = require('http-errors');
const BankAccount = require('../model/bankAccount');

module.exports = (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const base64Header = request.headers.authorization.split('Basic ')[1];

  if (!base64Header) {
    return next(HttpError(400, 'AUTH - invalid request'));
  }
  const stringAuthHeader = Buffer.from(base64Header, 'base64').toString();

  const [userId, password] = stringAuthHeader.split(':');

  if (!userId || !password) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return BankAccount.findOne({ userId })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      return account.pVerifyPassword(password);
    })
    .then((matchedAccount) => {
      request.account = matchedAccount;
      return next();
    })
    .catch(next);
};
