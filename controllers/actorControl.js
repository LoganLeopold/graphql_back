const Actor = require("../models/actor")

module.exports = {

    list: async (req,res) => {
        let actors = await Actor.find({})
        console.log(actors)
        res.send("Finished, test")
    },

    create: async(req,res) => {
        Actor.create({
            Name: req.body.name,
            Movies: []
        }).then( console.log("added"))
    }

}