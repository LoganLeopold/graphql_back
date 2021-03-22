const Actor = require("../models/actor")

module.exports = {

    list: async (req,res) => {
        let actors = await Actor.find({})
        console.log(actors)
    }


}