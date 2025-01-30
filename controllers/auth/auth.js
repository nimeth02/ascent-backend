const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const createResponse = require("../../utils/responseHandler");
const { Student } = require("../../config/db.config");
const Joi = require("joi");
const logger = require("../../utils/logger");
require("dotenv").config();


//sign up user
exports.signUpUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Validate input
    const { error } = signUpSchema.validate({ email, password, name });
    if (error)
      return res
        .status(400)
        .json(createResponse("fail", 400, error.details[0].message));


    // Check if user already exists
    const existingUser = await Student.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json(
          createResponse(
            "fail",
            409,
            "User already exists with this email. Try logging in."
          )
        );
    }

    // Hash the password with bcrypt
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user record in the database
    const newUser = await Student.create({
      email,
      password: hashedPassword,
      name,
    });

    if (!newUser) {
      return res
        .status(500)
        .json(createResponse("error", 500, "User not successfully created!"));
    }

    // Send the response back with the newly created user information (exclude sensitive fields)
    return res.status(201).json(
      createResponse(
        "success",
        201,
        "User created successfully. Please verify your email to activate your account."
      )
    );
  } catch (error) {
    
    return res
      .status(500)
      .json(
        createResponse("error", 500, "Something went wrong during signup.")
      );
  }
});


// Joi Schema Validation
const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required(),
    name: Joi.string().min(3).max(50).required(),
  });