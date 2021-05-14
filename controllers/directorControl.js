const { attachDirectiveResolvers } = require("graphql-tools")
const { directors } = require("../models/director")

module.exports = {

    list: async (req, res) => {
        let directorsRes = await directors.find({})
        res.send(directorsRes)
    },

    findMany: async (req, res) => {
        
        let { id } = req.params

        let directorsRes = await directors.find({ movies: id })

        res.send(directorsRes)

    }

}