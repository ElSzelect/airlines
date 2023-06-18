const {
  formatFlightResponse,
  getFlightData,
} = require("../controllers/flightDataController");

const flightHandler = async (req, res) => {
  console.log("handler activado");
  const flightId = req.params.id;
  try {
    const flightData = await getFlightData(flightId);
    const formattedData = formatFlightResponse(flightData);

    res.status(200).json({
      code: 200,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: 500,
      message: "Error al obtener los datos del vuelo",
    });
  }
};

module.exports = {
  flightHandler,
};
