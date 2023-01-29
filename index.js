const express = require("express")
const app = express ()
const mongoose = require ("mongoose")
const dotenv = require ("dotenv")
const cors = require ("cors")

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

dotenv.config()

mongoose
.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo database connected"))
    .catch((err) => {
        console.log(err);
    })


app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)

    app.listen('4000','0.0.0.0', () => {
        console.log("Backend server running");
    })