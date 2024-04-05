const { Router } = require('express');

const router = Router();

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // especifica el directorio donde se guardarán los archivos subidos

const auth = require('../middleware/auth');

const {
  updateProfile,
  updateAvatar,
  updateAvatarFile,
  getAuthenticatedUser,
  checkGoogleToken,
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

router.post('/api/auth/google', checkGoogleToken);

router.patch(
  '/users/me/avatar/file',
  auth,
  upload.single('avatar'), // multer procesará un archivo llamado 'avatar' del formulario entrante
  updateAvatarFile,
);

module.exports = router;
