const { Platform } = require("../models/platform")

module.exports = {

    findMany: async (req, res) => {

        let { id } = req.params

        let platforms = await Platform.find({ Movies: id })

        res.send(platforms)

    }

}