module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('Student', {
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false
      }
  }, {
      timestamps: true 
  });

  return Student;
};