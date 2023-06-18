const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

//middlewares and endwares
server.use(morgan("dev"));
server.use(cors());

module.exports = server;
