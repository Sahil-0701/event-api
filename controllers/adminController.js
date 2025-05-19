import adminModel from "../models/adminModel.js";
import validator from "validator";

import { createToken } from "../helpers/tokenHelper.js";
import bcrypt from "bcryptjs";

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body;

    // Check if admin already exists
    const exists = await adminModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new adminModel({
      name,
      email,
      password: hashPassword,
      organizationName,
    });

    const admin = await newAdmin.save();
    const token = createToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        organizationName: admin.organizationName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = createToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        organizationName: admin.organizationName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerAdmin, loginAdmin }; 