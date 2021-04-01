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
            director,
            actors, 
            platforms, 
            tom_pub, 
            tom_crit, 
            genres
        } = req.body;

        console.log(name)

        // let actorSplits = actors.trim().split(",")
        // let platformSplits = genres.trim().split(",")
        // let genreSplits = genres.trim().split(",")

        console.log(req)
        try {   

            //Create Movie
            let movie = await Movie.create({
                Name: name,
                Director: director,
                Actors: [],
                Platforms: [],
                TomatoPublic: pub,
                TomatoCritic: crit,
                Genres: [],
            })

            
            // actorSplits.forEach( actor => {

            //     let name = actor.trim()
            //     let actorDoc = await Actor.findOneAndUpdate({name: name})

            // })
            res.send(movie)

        } catch (err) {
            console.log(err)
        }
    }

}