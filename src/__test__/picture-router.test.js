'use strict';

const superagent = require('superagent');
const server = require('../lib/server');

const accountMock = require('./lib/bank-account-mock');


const API_URL = `http://localhost:${process.env.PORT}/api/picture`;

describe('/api/categories', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanBankAccountMocks);

  test('should respond with 200 status code and a picture', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .field('title', 'A photo of myself and banana')
          .attach('picture', `${__dirname}/assets/brai.jpg`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
});

//   test('GET should return with a 200 status code and a token', () => {
//     return accountMock.pCreateMock()
//       .then((mock) => {
//         return superagent.get(API_URL)
//           .auth(mock.request.userId, mock.request.password);
//       })
//       .then((response) => {
//         expect(response.status).toEqual(200);
//         expect(response.body.token).toBeTruthy();
//       });
//   });
// });
