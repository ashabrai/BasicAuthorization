'use strict';

const awsSDKMock = require('aws-sdk-mock');
const faker = require('faker');

process.env.PORT = 6000;
process.env.MONGODB_URI = 'mongodb://localhost/testdb';
process.env.SECRET = 'xmSgHewtBZv6eblbutok0EjFvAhtB3cBW7UYJkqEzWslUgW4VeaNQ0PFPWFxK460bHrdwfovKSvO5rr9rHHSOg5ltjpnzfTEIYem';
process.env.AWS_ACCESS_KEY_ID = 'SECRET INFORMATION';
process.env.AWS_BUCKET = 'test-bucket';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('ERROR', 'Missing arguments in the upload request'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('ERROR', 'ACL should be "public-read"'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('ERROR', 'incorrect Bucket'));
  }
  return callback(null, { Location: faker.internet.url() });
});
