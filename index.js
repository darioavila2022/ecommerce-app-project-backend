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

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo database connected"))
    .catch((err) => {
        console.log(err);
    })

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
    });

app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)

    // app.listen(`0.0.0.0:$PORT`, () => {
    //     console.log("Backend server running");
    // })

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))