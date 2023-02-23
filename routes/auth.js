// const router = require("express").Router()
// const User = require("../models/User")
// const CryptoJS = require("crypto-js")
// const jwt = require("jsonwebtoken")

// //REGISTER USER
// router.post("/register", async (req, res) => { //ASYNC REQUEST FROM USER
//     const newUser = new User ({
//         // username: req.body.username,
//         // lastname: req.body.lastname,
//         email: req.body.email,
//         password: CryptoJS.AES.encrypt( //CRYPTOJS PROVIDES A HASHED CODE FOR PW 
//             req.body.password, 
//             process.env.PASS_SEC //USING THE SECRET KEY FROM .ENV. 
//         ).toString(), //PW IS SAVED AS A STRING TO BE STORED IN DB
//     })

//     //AFTER THE PW IS ENCRYPTED THE USER IS SAVED
//     try {
//         const savedUser = await newUser.save()
//         res.status(201).json(savedUser)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

// //LOGIN

// router.post("/login", async (req,res) => { //POST METHOD AND LOGIN ENDPOINT
//     try {
//         const user = await User.findOne({email: req.body.email}) //FINDING USER INSIDE DB
//         !user && res.status(401).json("Sorry, invalid user.") //IF THERE'S NO USER FOUND, SEND THIS ERROR MESSAGE

//         const hashedPassword = CryptoJS.AES.decrypt( //DECRYPTING PREVIOUSLY CRYPTED PW
//             user.password, 
//             process.env.PASS_SEC
//             )
//             const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8) // UTF8 IS FOR SPECIAL CHARACTERS IF NEEDED

//             originalPassword !==req.body.password &&
//             res.status(401).json("Sorry, invalid password.") //IN CASE THE PASSWORD DOESN'T MATCH THE DB

//             const accessToken = jwt.sign({ //VERIFYING USER THROUGH JWT EVERYTIME THEY WANT TO MODIFY OR ACCESS ANYTHING
//                 id:user._id, 
//                 isAdmin: user.isAdmin, 
//             }, 
//                 process.env.JWT_SEC, //USING KEY FROM ENV
//                 {expiresIn:"3d"}) //EXPIRATION DATE OF THE TOKEN

//             const { password, ...others} = user._doc //DESTRUCTURING THE USER.

//             res.status(200).json({...others, accessToken}) //IF ALL GOES WELL THE USER, NOW KNOWN AS "...OTHERS" (spread operator), IS RETURNED AS JSON ALONG WITH THE TOKEN

//     } catch (err) {
//         res.status(500).json(err) //SENDING ERROR
//     }

// })

// module.exports = router


const router = require("express").Router()
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js")
const User = require("../models/User.js")

//USER REGISTER
router.post("/register", async (req, res) => {

    const { password } = req.body
    if (password.length < 4) {
        return res.status(401).json({ message: "Password less than 6 characters" })
    }

    //CRYPTOJS PROVIDES A HASHED CODE FOR PW WHICH IS SAVED AS A STRING TO BE STORED IN DB
    const newUser = new User({
        // username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    })
    //AFTER THE PW IS ENCRYPTED THE USER IS SAVED
    try {
        const savedUser = await newUser.save()
        res.status(201).json({ message: "User created successfully", savedUser })
    } catch (err) {
        res.status(500).json({ message: "Failed to create user", err })
    }
});

//USER LOGIN
router.post("/login", async (req, res) => {
    //FINDING USER INSIDE DB //DECRYPTING PREVIOUSLY CRYPTED PW
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json("User or Password NOT Found")
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json("Invalid User.")
        }
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )
        // // UTF8 FOR SPECIAL CHARACTERS IF NEEDED
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Invalid Password.")
        }
        // //VERIFYING USER THROUGH JWT WHEN TRYING TO ACCESS  
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
            //EXPIRATION DATE OF THE TOKEN
            process.env.JWT_SEC,
            { expiresIn: "3d" })

        //DESTRUCTURING THE USER. IF SUCCESS, THE USER ("...others") IS RETURNED AS JSON + TOKEN
        const { password, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })

    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router