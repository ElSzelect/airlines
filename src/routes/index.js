const { Router } = require("express");
const flightsRouter = require("./flights");

const mainRouter = Router();



mainRouter.use("/", flightsRouter);


module.exports = mainRouter;


