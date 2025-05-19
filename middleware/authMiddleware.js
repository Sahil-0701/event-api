import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';


const protect = async (req, res, next) => {
  try {
    let token;
    
    console.log("Auth headers:", req.headers.authorization); // Debug log
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Extracted token:", token); // Debug log
    }

    if (!token) {
      console.log("No token found in request"); // Debug log
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug log
      
      const admin = await adminModel.findById(decoded.id).select('-password');
      console.log("Found admin:", admin?._id); // Debug log
      
      if (!admin) {
        console.log("Admin not found"); // Debug log
        return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
      }
      
      req.user = admin;
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Debug log
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error("Auth middleware error:", error); // Debug log
    res.status(500).json({ success: false, message: error.message });
  }
};

export default protect; 