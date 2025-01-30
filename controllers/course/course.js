const expressAsyncHandler = require("express-async-handler");
const { Course, Enrollment } = require("../../config/db.config");
const createResponse = require("../../utils/responseHandler");
const { Sequelize } = require("sequelize");

exports.createCourse = expressAsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existingCourse = await Course.findOne({ where: { name } });

  if (existingCourse) {
    return res
      .status(409)
      .json(createResponse("fail", 409, "Course already exists"));
  }

  const course=await Course.create({
    name,
    description,
  });

  return res
    .status(201)
    .json(createResponse("success", 201, "Course  successfully created!",course));
});

exports.getAllCourse = expressAsyncHandler(async (req, res) => {

  const studentId = req.user.id; // Assuming user is authenticated and user ID is available in req.user

  // Find courses the student is already enrolled in
  const registeredCourses = await Course.findAll({
    include: {
      model: Enrollment,
      where: { studentId: studentId }, // Only get courses that the student is enrolled in
      required: true, // Ensures the student is enrolled in the course
    },
  });

  const notRegisteredCourses = await Course.findAll({
    where: {
      id: {
        [Sequelize.Op.notIn]: registeredCourses.map(course => course.id), // Exclude courses already enrolled
      },
    },
  });

  return res.status(200).json(createResponse("success", 200, "Courses fetched successfully", {
    registeredCourses,
    notRegisteredCourses
  }));
});

exports.getRegisteredCourses = expressAsyncHandler(async (req, res) => {
  const studentId = req.user.id; // Assuming user is authenticated and user ID is available in req.user

  // Find courses the student is already enrolled in
  const registeredCourses = await Course.findAll({
    include: {
      model: Enrollment,
      where: { studentId: studentId }, // Only get courses that the student is enrolled in
      required: true, // Ensures the student is enrolled in the course
    },
  });

  // Find courses the student is not enrolled in
  const notRegisteredCourses = await Course.findAll({
    where: {
      id: {
        [Sequelize.Op.notIn]: registeredCourses.map(course => course.id), // Exclude courses already enrolled
      },
    },
  });

  return res.status(200).json(createResponse("success", 200, "Courses fetched successfully", {
    registeredCourses,
    notRegisteredCourses
  }));
});