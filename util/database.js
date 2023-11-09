// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'Harshu9839#'
// })
// module.exports = pool.promise();

const Sequelize = require('sequelize');

// this wlll set up a conection pool   just like we were doing manually incase of SQL (Above)
const sequelize = new Sequelize('node-complete','root','Harshu9839#',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;