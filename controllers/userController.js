const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.registerUser = async (req, res) => {
    const {name, email,phone, password} = req.body
    console.log(req.body)
    //validation
    if(!name|| !email ||!phone || !password){
        return res.status(400).json(
            {"success": false, "message" : "Missing fields"}

        )
    }

    //db logic in try/catch
    try{
        const existingUser = await User.findOne(
            {
                $or: [{"name": name},
                    {"email": email},
                    {"phone":phone},
                ]
                
            }
        )

        if(existingUser){
            return res.status(400).json(
                {
                    "success" : false,
                    "message": "User exists"
                }
            )
        }

        //hash password

        const hasedPas = await bcrypt.hash(
            password, 10
        ) // 10 is complexity
        const newUser = new User ({
            name,
            email,
            phone,
            password: hasedPas

        })
        await newUser.save()
        return res. status(201).json(
            {
                "succes":true,
                "message": "User Registered"

            }


        )
    } catch(err){
        return res.status(500).json(
            {"success": false, "message": "Server error"}
        )
    }
}



exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    }

    try {
        // Check if user exists
        const getUser = await User.findOne({ email });
        if (!getUser) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const passwordCheck = await bcrypt.compare(password, getUser.password);
        if (!passwordCheck) {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Create JWT token
        const payload = {
            _id: getUser._id,
            email: getUser.email,
            name: getUser.name,
            phone:getUser.phone
          
        };

        const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
            expiresIn: "7d"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: getUser._id,
                name: getUser.name,
                email: getUser.email,
                phone:getUser.phone
                         

            },
            token
        });

    } catch (err) {
        console.error("Login error:", err); // show real issue
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};