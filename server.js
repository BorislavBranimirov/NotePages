const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// .env
require('dotenv').config();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie-parser
app.use(cookieParser());

// morgan
app.use(morgan('tiny'));

// set up mongoose
const db = process.env.MONGO_URI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// routing
const { noteRouter, userRouter, authRouter } = require('./routes');
app.use('/api/notes', noteRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// serving react app
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.join(__dirname, 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
