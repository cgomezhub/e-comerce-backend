const mongoose = require('mongoose');

const { ObjectId } = require('mongoose').Schema.Types;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
          v,
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  likes: {
    type: [ObjectId],
    default: [],
  },
  cart: {
    type: [ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
  },
});

const product = mongoose.model('product', productSchema);
module.exports = product;
