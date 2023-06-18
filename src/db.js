require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_URL } = process.env;


const sequelize = new Sequelize(
  `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/airline`,
  {
    dialect: "mysql",
    host: DB_HOST,
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

// Ejemplo de consulta para obtener todos los datos de una tabla
async function getAllDataFromTable(tableName) {
  try {
    const query = `SELECT * FROM ${tableName}`;
    const [results, metadata] = await sequelize.query(query);

    console.log(results); // Array de objetos con los resultados de la consulta
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Llamar a la función para obtener todos los datos de una tabla
const boarding_pass = getAllDataFromTable("boarding_pass");
const purchase = getAllDataFromTable("purchase");


module.exports = {
  conn: sequelize,
};
