const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../model/user.model")
const { BLModel } = require("../model/blacklist.model")

const authmiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const blToken = await BLModel.findOne({ BL_Token: token })
        if (blToken) {
            return res.status(401).send({ message: "Unauthorized" })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_Secret)
        const { userId } = decodedToken;

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" })
        }

        const role = user.role;

        req.role = role
        req.userId = user._id;

        next()

    } catch (error) {
        return res.status(401).send({ message: "Unauthorized" })
    }
}

module.exports = {
    authmiddleware
}