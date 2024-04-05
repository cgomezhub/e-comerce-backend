// 1. Importaciones

const express = require('express');
const path = require('path');
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

// 3. servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

/*
mongoose
  .connect('mongodb://localhost:27017/webStore')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));
*/
// 4. Rutas

app.post('/signup', createUser);
app.post('/signin', login);

app.use(productRoutes);
app.use(userRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// 5. middleware de logs de errores
app.use(errorLogger);

// 6.  middleware de errores de celebrate
app.use(errors());

// 7.  middleware majeador central de errores
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
