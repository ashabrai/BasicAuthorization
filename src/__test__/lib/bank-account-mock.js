'use strict';

const faker = require('faker');
const BankAccount = require('../../model/bankAccount');

const bankAccountMock = module.exports = {};

bankAccountMock.pCreateMock = () => {
  const mock = {};
  mock.request = {
    userId: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
  return BankAccount.create(mock.request.userId, mock.request.email, mock.request.password)
    .then((createdBankAccount) => {
      mock.bankAccount = createdBankAccount;
      return createdBankAccount.pCreateToken();
    })
    .then((token) => {
      mock.token = token;
      return mock;
    })
    .catch((error) => {
      console.error(error);
    });
};
bankAccountMock.pCleanBankAccountMocks = () => BankAccount.remove({});
