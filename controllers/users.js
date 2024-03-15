const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-error');

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        // User with this email already exists, return a 409
        res.status(409).send('Email already exists');
      } else {
        // User does not exist, hash the password and create the user
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => User.create({ ...req.body, password: hash }))
          .then((newUser) => res.send(newUser))
          .catch((err) => {
            // console.log(err);
            if (err.name === 'ValidationError') {
              // Mongoose validation error
              res.status(400).send(err.message);
            } else {
              // Other error
              next(err);
            }
          });
      }
    })
    .catch((err) => next(err));
  return null;
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name } = req.body;

  if (name === undefined) {
    return next(new Error('No fields to update'));
  }

  return User.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('User ID not found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (avatar === undefined) {
    return next(new Error('No avatar URL provided'));
  }

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('User ID not found'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // estamos creando un token
      const token = jwt.sign(
        { _id: user._id.toString() },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );

      // devolvemos el token
      return res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getAuthenticatedUser = (req, res, next) => {
  // console.log('User:', req.user);
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('User not found');
      }
    })
    .catch((err) => next(err));
};
