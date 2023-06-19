// const { Sequelize } = require("sequelize");
// const { sequelize } = require("../db"); //esta constante es la conexion con la db

// function convertSnakeCaseToCamelCase(obj) {
//   const newObj = {};

//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
//       newObj[camelCaseKey] = obj[key];
//     }
//   }

//   return newObj;
// }

// async function getAllDataFromTable(tableName) {
//   try {
//     const query = `SELECT * FROM ${tableName}`;
//     const [results, metadata] = await sequelize.query(query);

//     console.log(results);
//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//   }
// }

// // funcion que reciba un objeto con los atributos en snake case y retorne el mismo objeto con los atributos en camel case ?


// module.exports = {
//   formatFlightData,
//   getFlightData,
//   getAllDataFromTable
// };
