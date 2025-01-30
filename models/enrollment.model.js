module.exports = (sequelize, Sequelize) => {
  const Enrollment = sequelize.define('Enrollment', {
      studentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Students',  
              key: 'id'
          }
      },
      courseId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'Courses', 
              key: 'id'
          }
      }
  }, {
      timestamps: true,
      indexes: [
        {
            unique: true,
            fields: ['studentId', 'courseId']  
        }
    ] 
  });

  return Enrollment;
};
