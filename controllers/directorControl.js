const { Director } = require("../models/director")

module.exports = {

    list: async (req,res) => {
        let directors = await Director.find({})
        res.send(directors)
    },

}