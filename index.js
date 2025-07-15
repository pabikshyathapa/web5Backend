require("dotenv").config() 
const express = require ("express")
const connectDB = require ("./config/db")
const path = require("path") // 
const cors = require("cors")
const app = express();

const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin")
const adminProductRoutes = require("./routes/admin/productRouteAdmin")
const adminRoutes=require('./routes/admin/AdminRoute')
const publicRoutes = require('./routes/publicRoutes')


let corsOptions = {
    origin: "*" // or list of domain to whitelist
}
app.use(cors(corsOptions))

app.use(express.json());
app.use(cors());

app.use(express.json()) // accept json in request
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT
const userRoute = require('./routes/userRoutes')
app.use('/api/auth', userRoute);
app.listen(
    5050, //port -> localhost:5050
    () => {
        console.log("Server started")
    }
)

// 2 new implementation
connectDB()
app.use("/api/auth", userRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/category", adminCategoryRoutes)
app.use("/api/admin/product", adminProductRoutes)
app.use("/api/admins", adminRoutes)
app.use("/api",publicRoutes)

// module.exports=app



