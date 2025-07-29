const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  let { name, email, phone, password } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  // Normalize email before saving
  email = email.trim().toLowerCase();

  try {
    // Check if user already exists by name, email or phone
    const existingUser = await User.findOne({
      $or: [{ name }, { email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User exists",
      });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user (role will default to "normal" as per schema)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPass,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Registered",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  // Normalize email before lookup
  email = email.trim().toLowerCase();

  try {
    // Find user by normalized email
    const getUser = await User.findOne({ email });

    if (!getUser) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const passwordCheck = await bcrypt.compare(password, getUser.password);

    if (!passwordCheck) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT payload including role
    const payload = {
      _id: getUser._id,
      email: getUser.email,
      name: getUser.name,
      phone: getUser.phone,
      role: getUser.role,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
      expiresIn: "7d",
    });

    // Send user data + role + token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
        phone: getUser.phone,
        role: getUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // Register User
// exports.registerUser = async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   // Validate required fields
//   if (!name || !email || !phone || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing fields",
//     });
//   }

//   try {
//     // Check if user already exists by name, email or phone
//     const existingUser = await User.findOne({
//       $or: [{ name }, { email }, { phone }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User exists",
//       });
//     }

//     // Hash password
//     const hashedPass = await bcrypt.hash(password, 10);

//     // Create new user (role will default to "normal" as per schema)
//     const newUser = new User({
//       name,
//       email,
//       phone,
//       password: hashedPass,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       success: true,
//       message: "User Registered",
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   // Validate required fields
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing fields",
//     });
//   }

//   try {
//     // Find user by email
//     const getUser = await User.findOne({ email });
//     if (!getUser) {
//       return res.status(403).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Compare password
//     const passwordCheck = await bcrypt.compare(password, getUser.password);
//     if (!passwordCheck) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Create JWT payload including role
//     const payload = {
//       _id: getUser._id,
//       email: getUser.email,
//       name: getUser.name,
//       phone: getUser.phone,
//       role: getUser.role, // include role here
//     };

//     // Sign token
//     const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
//       expiresIn: "7d",
//     });

//     // Send user data + role + token
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         id: getUser._id,
//         name: getUser.name,
//         email: getUser.email,
//         phone: getUser.phone,
//         role: getUser.role, // include role in response
//       },
//       token,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };



// const User = require("../models/User")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")


// exports.registerUser = async (req, res) => {
//     const {name, email,phone, password} = req.body
//     console.log(req.body)
//     //validation
//     if(!name|| !email ||!phone || !password){
//         return res.status(400).json(
//             {"success": false, "message" : "Missing fields"}

//         )
//     }

//     //db logic in try/catch
//     try{
//         const existingUser = await User.findOne(
//             {
//                 $or: [{"name": name},
//                     {"email": email},
//                     {"phone":phone},
//                 ]
                
//             }
//         )

//         if(existingUser){
//             return res.status(400).json(
//                 {
//                     "success" : false,
//                     "message": "User exists"
//                 }
//             )
//         }

//         //hash password

//         const hasedPas = await bcrypt.hash(
//             password, 10
//         ) // 10 is complexity
//         const newUser = new User ({
//             name,
//             email,
//             phone,
//             password: hasedPas

//         })
//         await newUser.save()
//         return res. status(201).json(
//             {
//                 "succes":true,
//                 "message": "User Registered"

//             }


//         )
//     } catch(err){
//         return res.status(500).json(
//             {"success": false, "message": "Server error"}
//         )
//     }
// }



// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing fields"
//         });
//     }

//     try {
//         // Check if user exists
//         const getUser = await User.findOne({ email });
//         if (!getUser) {
//             return res.status(403).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Compare password
//         const passwordCheck = await bcrypt.compare(password, getUser.password);
//         if (!passwordCheck) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid credentials"
//             });
//         }

//         // Create JWT token
//         const payload = {
//             _id: getUser._id,
//             email: getUser.email,
//             name: getUser.name,
//             phone:getUser.phone
          
//         };

//         const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
//             expiresIn: "7d"
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             data: {
//                 id: getUser._id,
//                 name: getUser.name,
//                 email: getUser.email,
//                 phone:getUser.phone
                         

//             },
//             token
//         });

//     } catch (err) {
//         console.error("Login error:", err); // show real issue
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };
