module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('Course', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: true // Enables createdAt & updatedAt fields
    });

    return Course;
};