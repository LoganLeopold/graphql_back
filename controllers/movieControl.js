var mongoose = require('mongoose');
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

            /*

            Movie to DB Pseudocode

            2. Get values from req.body (above)
            3. Establish IDs for use 
                -explicit for movieID + directorID
                -dynamic for actors + platforms
            4. Establish arrays of objects writbale to MongoDB with new objectIds
            
            */ 
           
           // 1
           let movieID = mongoose.Types.ObjectId()
           let directorID = mongoose.Types.ObjectId()
           let actorIDs = []
           let platformIDs = []
           
           let insertDir = {
               _id: directorID,
               Name: director
           }

           
           let actorsArr = actors.split(',').map( actor => {
            // use this info for findoneandupdate with upsert - returned id will get pushed into actorIDs
                // let actObj = {
                //     Name: actor.trim(),
                //     Movies: [movieID]
                // }
                // actObj.Name = actor.trim()
                // actObj.Movies = [movieID]
                // return actObj 
                let actor = await Actor.findOneAndUpdate(
                    {Name: actor.trim()}, 
                    {$push: {Movies: movie._id}},
                    {$upsert: true}
                )

                actorIDs.push(actor._id)
           })

            


            // Below here is original try 

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
                        {$upsert: true}
                    )
                })



            }

        } catch (err) {
            console.log(err)
        }
    }

}