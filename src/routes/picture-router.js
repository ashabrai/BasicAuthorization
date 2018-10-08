'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const multer = require('multer');

const Picture = require('../model/picture');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const upload = multer({ dest: `${__dirname}/../temp` });
const s3 = require('../lib/s3');

// const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


router.post('/api/picture', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  if (!request.body.title || request.files.length > 1) {
    return next(new HttpError(400, 'bad request'));
  }
  const file = request.files[0];

  const key = `${file.filename}.${file.originalname}`;
  return s3.pUpload(file.path, key)
    .then((s3URL) => {
      return new Picture({
        title: request.body.title,
        url: s3URL,
        account: request.account._id,
      }).save();
    })
    .then(picture => response.json(picture))
    .catch(next);
});
//
// router.get('/api/picture/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
//   if (!request.params._id) {
//     return next(new HttpError(400, 'bad request'));
//   }
//   return Picture.findById(request.params._id)
//     .then((account) => {
//       if (account) {
//         logger.log(logger.INFO, 'Responding with a 200 status code and a photo');
//         return response.json();
//       }
//       logger.log(logger.INFO, 'Responding with a 404 status code. Category not Found');
//       return next(new HttpError(404, 'category not found'));
//     })
//     .catch(next); //! Vinicio - by default a catch gets an error as the first argument
//   //! Vinicio - mongoose will only reject in case of error
//   // (not finding a category IS NOT CONSIDERED AN ERROR)
// });
