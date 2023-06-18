const { Sequelize } = require("sequelize");
const { sequelize } = require("../db");

async function formatFlightResponse(flightData) {
  const formattedData = {
    flightId: flightData.flightId,
    takeoffDateTime: flightData.takeoffDateTime,
    takeoffAirport: flightData.takeoffAirport,
    landingDateTime: flightData.landingDateTime,
    landingAirport: flightData.landingAirport,
    airplaneId: flightData.airplaneId,
    passengers: [],
  };

  const groupedPassengers = groupPassengersByPurchaseId(flightData.passengers);

  for (const purchaseId in groupedPassengers) {
    const passengers = groupedPassengers[purchaseId];
    const assignedSeats = await assignSeats(passengers);

    passengers.forEach((passenger, index) => {
      const passengerData = {
        passengerId: passenger.passengerId,
        dni: passenger.dni,
        name: passenger.name,
        age: passenger.age,
        country: passenger.country,
        boardingPassId: passenger.seatId,
        purchaseId: passenger.purchaseId,
        seatTypeId: passenger.seatTypeId,
        seatId: assignedSeats[index],
      };

      formattedData.passengers.push(passengerData);
    });
  }

  return formattedData;
}

async function groupPassengersByPurchaseId(passengers) {
  const groupedPassengers = {};

  passengers.forEach((passenger) => {
    if (groupedPassengers.hasOwnProperty(passenger.purchaseId)) {
      groupedPassengers[passenger.purchaseId].push(passenger);
    } else {
      groupedPassengers[passenger.purchaseId] = [passenger];
    }
  });

  return groupedPassengers;
}

async function assignSeats(passengers) {
  const seatIds = passengers.map((passenger) => passenger.seatId);
  const seatTypes = await getSeatTypes(seatIds);

  const seats = passengers.map((passenger, index) => {
    return {
      passenger,
      seatType: seatTypes[index],
    };
  });

  seats.sort((a, b) => {
    if (a.seatType.name === b.seatType.name) {
      return a.passenger.age - b.passenger.age;
    }
    return a.seatType.name.localeCompare(b.seatType.name);
  });

  return seats.map((seat) => seat.passenger.seatId);
}

async function getSeatTypes(seatIds) {
  const query = `
    SELECT s.seat_id, s.name
    FROM seat AS s
    WHERE s.seat_id IN (:seatIds)
  `;

  const [results] = await sequelize.query(query, {
    replacements: { seatIds },
    type: Sequelize.QueryTypes.SELECT,
  });

  return results;
}

async function getFlightData(flightId) {
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
        s.seat_id,
        p.purchase_id AS purchaseId,
        s.seat_type_id AS seatTypeId
      FROM
        flight AS f
        JOIN passenger AS p ON f.flight_id = p.flight_id
        JOIN seat AS s ON p.passenger_id = s.passenger_id
      WHERE
        f.flight_id = :flightId;
    `;

    const [results] = await sequelize.query(query, {
      replacements: { flightId },
      type: Sequelize.QueryTypes.SELECT,
    });

    return results;
  } catch (error) {
    console.error("Error al obtener los datos del vuelo:", error);
    throw error;
  }
}

module.exports = {
  formatFlightResponse,
  getFlightData,
};
