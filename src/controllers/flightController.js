const { conn } = require("../db");

// Función para obtener los datos del vuelo y las tarjetas de embarque
const getFlightData = async (flightId) => {
  try {
    const query = `
      SELECT
        f.flight_id AS flightId,
        f.takeoff_date_time AS takeoffDateTime,
        f.takeoff_airport AS takeoffAirport,
        f.landing_date_time AS landingDateTime,
        f.landing_airport AS landingAirport,
        f.airplane_id AS airplaneId,
        p.passenger_id AS passengerId,
        p.dni,
        p.name,
        p.age,
        p.country,
        bp.boarding_pass_id AS boardingPassId,
        bp.purchase_id AS purchaseId,
        bp.seat_type_id AS seatTypeId,
        bp.seat_id AS seatId
      FROM
        flight AS f
        INNER JOIN boarding_pass AS bp ON f.flight_id = bp.flight_id
        INNER JOIN passenger AS p ON bp.passenger_id = p.passenger_id
      WHERE
        f.flight_id = :flightId
    `;
    const [results] = await conn.query(query, { replacements: { flightId } });
    return results;
  } catch (error) {
    throw error;
  }
};

// Función para formatear los datos del vuelo y las tarjetas de embarque
const formatFlightData = (flightData) => {
  const formattedFlightData = {
    flightId: flightData[0].flightId,
    takeoffDateTime: flightData[0].takeoffDateTime,
    takeoffAirport: flightData[0].takeoffAirport,
    landingDateTime: flightData[0].landingDateTime,
    landingAirport: flightData[0].landingAirport,
    airplaneId: flightData[0].airplaneId,
    passengers: [],
  };

  const passengersMap = new Map(); // Mapa para agrupar pasajeros por compra

  flightData.forEach((data) => {
    const passenger = {
      passengerId: data.passengerId,
      dni: data.dni,
      name: data.name,
      age: data.age,
      country: data.country,
      boardingPassId: data.boardingPassId,
      purchaseId: data.purchaseId,
      seatTypeId: data.seatTypeId,
      seatId: data.seatId,
    };

    if (!passengersMap.has(data.purchaseId)) {
      passengersMap.set(data.purchaseId, [passenger]);
    } else {
      const passengers = passengersMap.get(data.purchaseId);
      passengers.push(passenger);
      passengersMap.set(data.purchaseId, passengers);
    }
  });

  passengersMap.forEach((passengers) => {
    const minors = passengers.filter((p) => p.age < 18);
    const adults = passengers.filter((p) => p.age >= 18);

    minors.forEach((minor) => {
      const adjacentAdult = adults.find(
        (adult) => adult.purchaseId === minor.purchaseId
      );
      if (adjacentAdult) {
        minor.adjacentAdultId = adjacentAdult.passengerId;
      }
    });
  });

  passengersMap.forEach((passengers) => {
    passengers.forEach((passenger) => {
      const seat = passenger.seatId ? getFormattedSeat(passenger.seatId) : null;
      passenger.seatId = seat;
    });
    formattedFlightData.passengers.push(...passengers);
  });

  return formattedFlightData;
};

// Función para obtener el formato del asiento (fila y columna)
const getFormattedSeat = (seatId) => {
  // Implementa aquí la lógica para obtener el formato del asiento
  // Puedes consultar la base de datos para obtener la información de fila y columna según el seatId
  // y luego devolver el formato deseado
};

module.exports = {
  getFlightData,
  formatFlightData,
};
