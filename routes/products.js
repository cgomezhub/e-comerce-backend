const { Router } = require('express');

const router = Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middleware/auth');

const {
  getProducts,
  likeProduct,
  unLikeProduct,
  cartProduct,
  uncartProduct,
} = require('../controllers/products');

router.get('/products', getProducts);

router.put(
  '/products/likes/:productId',
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  auth,
  likeProduct,
);

router.delete(
  '/products/likes/:productId/',
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  auth,
  unLikeProduct,
);

router.put(
  '/products/carts/:productId',
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  auth,
  cartProduct,
);

router.delete(
  '/products/carts/:productId/',
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  auth,
  uncartProduct,
);

module.exports = router;
