const Movie = require("../models/movie")

module.exports = {

    list: async (req,res) => {
        let movies = await Movie.find({})
        res.send(movies)
    },

    create: async (req, res) => {

        //process req.body as needed

        const { 
            name, 
            actors, 
            platforms, 
            tom_pub, 
            tom_crit, 
            genres
        } = req.body;

        let actorSplits = actors.trim().split(",")
        let platformSplits = genres.trim().split(",")
        let genreSplits = genres.trim().split(",")

        try {   

            //Create Movie
            let movie = await Movie.create({
                Name: name,
                Actors: [],
                Platforms: [],
                TomatoPublic: tom_pub,
                TomatoCritic: tom_crit,
                Genres: [],
            })

            actorSplits.forEach( actor => {

                let name = actor.trim()
                let actorDoc = await Actor.findOneAndUpdate({name: name})

            })

        } catch (err) {

        }
    }

}