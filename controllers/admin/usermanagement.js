const User = require("../../models/User")
const bcrypt = require("bcrypt")

// 5 common api
// Create, Read All, Read One, Update One, Delete One
exports.createUser = async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body
    // validation
    if (!username || !email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing fields"
            }
        )
    }
    // db logic in try/catch
    try {
        const existingUser = await User.findOne(
            {
                $or: [{ "username": username },
                { "email": email }]
            }
        )
        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "User exists"
                }
            )
        }
        // hash password
        const hasedPas = await bcrypt.hash(
            password, 10
        ) // 10 is complexity
        const newUser = new User({
            username,
            email,
            firstName,
            lastName,
            password: hasedPas
        })
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "message": "User Registered"
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}

// 2 Get all/ Read All
exports.getUsers = async (req, res ) => {
    try{
        const users = await User.find();
        return res.status(200).json(
            {
                "success": true,
                "message": "All users",
                "data":users
            }
        )
    }catch(err){
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}
// 3 Get One/Read one
exports.getOneUser = async (req, res) => {
    try{
        // unique identifier
        const id = req.params.id // mongodb id
        const user = await User.findOne(
            {
                "_id": id
            }
        )
        return res.status(200).json(
            {
                "succes": true,
                "message": "One user fetched",
                "data": user
            }
        )
    }catch(err){
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
    
}

// 4 Update one
exports.updateOne = async (req, res) => {
  const { name, email, phone, filepath } = req.body;
  const _id = req.params.id; // mongodb id

  try {
    // Build the update object only with fields provided
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: updatedUser, // return updated user
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// 5 Delete One
exports.deleteOne = async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.deleteOne(
            {
                "_id": _id
            }
        )
        return res.status(200).json(
            {"success" : true, "message": "User Deleted"}
        )
    }catch(err){
        return res.status(500).json(
            {"success": false, "message": "Server Error"}
        )
    }
}