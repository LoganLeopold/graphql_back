const Movie = require("../models/movie")

module.exports = {

    list: async (req,res) => {
        let movies = await Movie.find({})
        res.send(movies)
    },

    create: async (req, res) => {

        const { 
            name, 
            director,
            actors, 
            platforms, 
            tom_pub, 
            tom_crit, 
            genres
        } = await req.body;

        try {   

            //Create Movie
            let movie = await Movie.create({
                Name: name,
                // Director: director,
                Actors: [],
                Platforms: [],
                TomatoPublic: parseInt(tom_pub),
                TomatoCritic: parseInt(tom_crit),
                Genres: [],
            })

            res.send(movie)

        } catch (err) {
            console.log(err)
        }
    }

}