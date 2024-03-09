const Product = require('../models/products');

const NotFoundError = require('../errors/not-found-error');

module.exports.getProducts = (req, res, next) => {
  Product.find({})
    .orFail(() => new NotFoundError('No se ha encontrado ningun producto'))
    .then((products) => res.send(products))
    .catch((err) => next(err));
};

module.exports.likeProduct = (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  Product.findByIdAndUpdate(
    productId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Card not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((product) => res.send(product))
    .catch((err) => next(err));
};

module.exports.unLikeProduct = (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  Product.findByIdAndUpdate(
    productId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Card not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((product) => res.send(product))
    .catch((err) => next(err));
};

module.exports.cartProduct = (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  Product.findByIdAndUpdate(
    productId,
    { $addToSet: { cart: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Product not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((product) => res.send(product))
    .catch((err) => next(err));
};

module.exports.uncartProduct = (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  Product.findByIdAndUpdate(
    productId,
    { $pull: { cart: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Product not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((product) => res.send(product))
    .catch((err) => next(err));
};
