const { actors } = require("../models/actor")

module.exports = {

    list: async (req,res) => {
        let actorsRes = await actors.find({})
        res.send(actorsRes)
    },

    create: async (req,res, next) => {
        try {
            let actor = await actors.create({
                name: req.body.name,
                movies: []
            })
            res.send(actor)
        } catch (err) {
            console.log(err)
        }
    },

    findMany: async (req, res) => {
        
        let { id } = req.params

        let actorsRes = await actors.find({ movies: id })

        res.send(actorsRes)

    }

}