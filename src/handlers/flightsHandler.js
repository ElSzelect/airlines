const {
  formatFlightData,
  getFlightData,
} = require("../controllers/flightController");

const flightHandler = async (req, res) => {
  const flightId = req.params.id;
  try {
    const flightData = await getFlightData(flightId);

    if (flightData.length === 0) {
      return res.status(404).json({
        code: 404,
        data: {},
      });
    }

    const formattedData = formatFlightData(flightData);
    res.status(200).json({
      code: 200,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      code: 400,
      message: "could not connect to db",
    });
  }
};

module.exports = {
  flightHandler,
};
