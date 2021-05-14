const { platforms } = require("../models/platform")

module.exports = {

    findMany: async (req, res) => {

        let { id } = req.params

        let platformsRes = await platforms.find({ Movies: id })

        res.send(platformsRes)

    }

}