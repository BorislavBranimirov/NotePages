const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// .env
require('dotenv').config()

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set up mongoose
const db = process.env.mongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

// routing
const { noteRouter, userRouter } = require('./routes');
app.use('/api/notes', noteRouter);
app.use('/api/users', userRouter);

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