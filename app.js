// 1. Importaciones

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
// const { MongoClient, ServerApiVersion } = require('mongodb');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/users');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
require('dotenv').config();

// 2. Configuraciónes y middlewares
const app = express();
const { PORT = 3002 } = process.env;
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.options('*', cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// 3. Rutas

app.post('/signup', createUser);
app.post('/signin', login);

app.use(productRoutes);
app.use(userRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// middleware de logs de errores
app.use(errorLogger);

// middleware de errores de celebrate
app.use(errors());

// middleware majeador central de errores
app.use((err, req, res, next) => {
  // si un error no tiene estado, se muestra 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // comprueba el estado y muestra un mensaje basado en dicho estado
    message:
      statusCode === 500 ? 'An error has ocurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
