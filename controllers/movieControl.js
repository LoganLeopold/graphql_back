const Movie = require("../models/movie")

module.exports = {

    list: async(req,res) => {
        let movies = await Movie.find({})
        res.send(movies)
    }

}