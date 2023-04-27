const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
const { client } = require('./db');
const apiRouter = require('./api');


client.connect();

server.use(morgan('dev'));

server.use(express.json())









server.use((req, res, next) => {
    console.log("<___Body Logger START___>");
    console.log(req.body);
    console.log("<____Body Logger END_____");

    next();
});

server.use('/api', apiRouter);

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});