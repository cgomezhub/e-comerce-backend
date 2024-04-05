const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'usuario',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        const urlRegex = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
        const filePathRegex = /^(uploads\\)[\w-]+(\.[\w-]*)*$/;
        return urlRegex.test(v) || filePathRegex.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid http/https or file path!`,
    },
    default:
      'https://media.istockphoto.com/id/1433039224/es/foto/icono-azul-3d-concepto-de-perfil-de-persona-aislado-sobre-fondo-blanco-con-s%C3%ADmbolo-de-car%C3%A1cter.jpg?s=612x612&w=is&k=20&c=fs94wztuVRiv_qG3jml3fWxcZiYJihcoAoO32lxj4V4=',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email is not valid',
      isAsync: false,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    validate: {
      validator(v) {
        return /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(v);
      },
      message:
        'Password should contain at least one letter, one number, and be at least 8 characters long',
      isAsync: false,
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }

        return user; // ahora user está disponible
      });
    });
};
module.exports = mongoose.model('user', userSchema);
