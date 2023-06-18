const { Router } = require("express");

const flightsRouter = Router();

const { flightHandler } = require("../handlers/flightsHandler");

//Routes:
flightsRouter.get("/flights/:id/passengers", flightHandler);

module.exports = flightsRouter;
