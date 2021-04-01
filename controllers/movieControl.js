const Movie = require("../models/movie")
const Director = require("../models/director")
const Platform = require("../models/platform")
const Actor = require("../models/actor")

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
        } = req.body;

        try {   

            //Create Movie
            var movie = null;
            let check = await Movie.findOne({Name: name})

            // Thinking about creating all of the document objects first so I have accurate IDs and then inserting them/creating them dynamically using objectIDs
            
            if (!check) {

                let genresInsert = genres.split(',').map( genre =>  genre.trim() )

                let actorsInsert = actors.split(',').map( actor => actor.trim() )

                let platformsInsert = platforms.split(',').map( platform => platform.trim() )

                var movie = await Movie.create({
                    Name: name,
                    // Director: director,
                    Actors: [],
                    Platforms: [],
                    TomatoPublic: parseInt(tom_pub),
                    TomatoCritic: parseInt(tom_crit),
                    Genres: genresInsert,
                }) 

                let directorUpsert = await Director.findOneAndUpdate(
                    {Name: director},
                    {$push: {Movies: movie._id}},
                    {$upsert: true})

                actorsInsert.forEach( actor => {
                    let actor = await Actor.findOneAndUpdate(
                        {Name: actor}, 
                        {$push: {Movies: movie._id}},
                        {$upsert: true})
                })



            }

        } catch (err) {
            console.log(err)
        }
    }

}