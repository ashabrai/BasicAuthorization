'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const BankAccount = require('../model/bankAccount');
const logger = require('../lib/logger');
const basicAuthMiddleware = require('../lib/basic-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/signup', jsonParser, (request, response, next) => {
  if (!request.body.password) {
    return next(new HttpError(401, 'Incorrect'));
  }
  return BankAccount.create(request.body.userId, request.body.email,
    request.body.password)
    .then((accountMade) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return accountMade.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'Responding with 200 status code');
      return response.json({ token });
    })
    .catch(next);
});

router.get('/api/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.BankAccount) {
    return next(new HttpError(400, 'Bad Request'));
  }
  return request.BankAccount.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Responding with 200 status code and a token');
      return response.json({ token });
    })
    .catch(next);
});
