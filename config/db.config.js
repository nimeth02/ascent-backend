const Sequelize = require('sequelize');
require('dotenv').config();

const server = process.env.MSSQL_SQL_SERVER;
const database = process.env.MSSQL_SQL_DATABASE;
const port = 1433;
const user = process.env.MSSQL_SQL_USERNAME;
const password = process.env.MSSQL_SQL_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  host: server,
  port: port,
  dialect: 'mssql',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};

// Import models
db.Student = require('../models/student.model')(sequelize, Sequelize.DataTypes);
db.Course = require('../models/course.model')(sequelize, Sequelize.DataTypes);
db.Enrollment = require('../models/enrollment.model')(sequelize, Sequelize.DataTypes);

// Define relationships
db.Student.hasMany(db.Enrollment, { foreignKey: 'studentId', onDelete: 'CASCADE' });
db.Course.hasMany(db.Enrollment, { foreignKey: 'courseId', onDelete: 'CASCADE' });
db.Enrollment.belongsTo(db.Student, { foreignKey: 'studentId' });
db.Enrollment.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;


module.exports = db;



