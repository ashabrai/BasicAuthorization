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

  test('POST should return with a 200 status code and a token', () => {
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

  test('POST should return a 400 error if data is missing, userId in this case', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        // userId: null,
        password: faker.internet.password(),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  // test('POST should return 400 if no data sent', () => {
  //   return superagent.post(`${API_URL}/api/login`)
  //     .then(Promise.reject)
  //     .catch((response) => {
  //       expect(response.status).toEqual(400);
  //     });
  // });

  test('GET should return with a 200 status code and a token for login', () => {
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
  test('GET test for 400 if the password is incorrect or does not exist in the system', () => {
    return bankAccountMock.pCreateMock()
      .then((profileMock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(profileMock.request.userId);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('GET should send 404 error if url does not exist', () => {
    return superagent.get(`${API_URL}/non/correct/path`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
