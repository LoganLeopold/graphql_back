const { Actor } = require("../models/actor")

module.exports = {

    list: async (req,res) => {
        let actors = await Actor.find({})
        res.send(actors)
    },

    create: async (req,res, next) => {
        try {
            let actor = await Actor.create({
                Name: req.body.name,
                Movies: []
            })
            res.send(actor)
        } catch (err) {
            console.log(err)
        }
    },

    findMany: async (req, res) => {
        
        let { id } = req.params

        let actors = await Actor.find({ Movies: id })

        res.send(actors)

    }

}