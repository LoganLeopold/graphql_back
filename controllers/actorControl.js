const Actor = require("../models/actor")

module.exports = {

    list: async (req,res) => {
        let actors = await Actor.find({})
        // console.log(actors)
        res.send(actors)
    },

    create: async (req,res) => {
        let actor = await Actor.create({
            Name: req.body.name,
            Movies: []
        })
        res.send(actor)
    }

}