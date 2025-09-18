// const jwt = require("jsonwebtoken");
// const Customer = require("../models/customer.model.js");

// const protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Not authorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await Customer.findById(decoded.id).select("-password");

//     if (!req.user) return res.status(401).json({ message: "User not found" });

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = { protect };
