'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpError = require('http-errors');

const bankAccountSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const TOKEN_SEED_LENGTH = 120;

function pVerifyPassword(plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.passwordHash)
    .then((compareResult) => {
      if (!compareResult) {
        throw new HttpError(401, 'Unauthorized');
      }
      return this;
    })
    .catch(console.error);
}

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((profileSaved) => {
      return jsonWebToken.sign({
        tokenSeed: profileSaved.tokenSeed,
      }, process.env.SECRET);
    })
    .catch((error) => {
      throw error;
    });
}


bankAccountSchema.methods.pCreateToken = pCreateToken;
bankAccountSchema.methods.pVerifyPassword = pVerifyPassword;

const BankAccount = module.exports = mongoose.model('bankAccount', bankAccountSchema);

const HASH_ROUNDS = 8; // this just means how many time the original pw will get hashed

BankAccount.create = (userId, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new BankAccount({
        userId,
        email,
        tokenSeed,
        passwordHash,
      }).save();
    });
};
