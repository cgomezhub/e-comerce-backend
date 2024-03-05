const { Router } = require('express');

const router = Router();

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const auth = require('../middleware/auth');

const {
  updateProfile,
  updateAvatar,
  getAuthenticatedUser,
} = require('../controllers/users');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/users/me', auth, getAuthenticatedUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  auth,
  updateProfile,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  auth,
  updateAvatar,
);

module.exports = router;
