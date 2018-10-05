'use strict';

const faker = require('faker');
const superagent = require('superagent');
const bankAccountMock = require('./lib/bank-account-mock');
const server = require('../lib/server');


const API_URL = `http://localhost:${process.env.PORT}`;

describe('AUTH ROUTER', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(bankAccountMock.pCleanBankAccountMocks);

  test('should return with a 200 status code and a token', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        userId: faker.lorem.words(1),
        password: faker.internet.password(),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('should return a 400 error if data is missing, userId in this case', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        userId: null,
        password: faker.internet.password(),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('GET should return with a 200 status code and a token', () => {
    return bankAccountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.userId, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('test for 400 if the password is incorrect or does not exist in the system', () => {
    return superagent.get(`${API_URL}/api/login`)
      .then((profileMock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(profileMock.request.userId);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
