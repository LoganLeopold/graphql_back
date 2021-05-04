const { attachDirectiveResolvers } = require("graphql-tools")
const { Director } = require("../models/director")

module.exports = {

    list: async (req, res) => {
        let directors = await Director.find({})
        res.send(directors)
    },

    findMany: async (req, res) => {
        
        let { id } = req.params

        let directors = await Director.find({ Movies: id })

        res.send(directors)

    }

}