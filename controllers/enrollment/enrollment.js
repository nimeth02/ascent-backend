const expressAsyncHandler = require("express-async-handler");
const { Enrollment, sequelize } = require("../../config/db.config");
const createResponse = require("../../utils/responseHandler");

exports.createEnrollment = expressAsyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId=req.user.id;

  const existingEnrollment = await Enrollment.findOne({
    where: { courseId, studentId  },
  });

  if (existingEnrollment) {
    return res
      .status(409)
      .json(createResponse("fail", 409, " Already enrolled"));
  }

  const enrollment=await Enrollment.create({
    courseId,
    studentId,
  });

  return res
    .status(201)
    .json(createResponse("success", 201, "Enrollment  successfully!",enrollment));
});

exports.deleteEnrollment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId= req.user.id;

  const enrollby = await Enrollment.findOne({
    where: { id },
  });

  console.log(enrollby, userId);

  if (enrollby.studentId != userId) {
    return res
      .status(404)
      .json(createResponse("fail", 403, "You are not allowed"));
  }

  
  // Attempt to delete enrollment by ID
  const enrollment = await Enrollment.destroy({
    where: { id },
  });

  if (!enrollment) {
    return res
      .status(404)
      .json(createResponse("fail", 404, "Enrollment not found"));
  }

  return res
    .status(200)
    .json(createResponse("success", 200, "Enrollment deleted"));
});

// Get all enrollments
exports.getAllEnrollment = expressAsyncHandler(async (req, res) => {
  const id= req.user.id;
  const enrollments = await Enrollment.findAll({
    where: { studentId: id },
    include: {
      model: sequelize.models.Course,  // Correct reference without alias
    },
  });
  

  if (!enrollments || enrollments.length === 0) {
    return res
      .status(404)
      .json(createResponse("fail", 404, "No enrollments found"));
  }

  return res.status(200).json(createResponse("success", 200,"Enrollments  successfully fetched!", enrollments));
});
