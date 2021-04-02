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

        /*

        Movie to DB Pseudocode

        1. Get values from req.body
        2. Does movie exist? 
        3. Establish IDs for use 
            -explicit for movieID + directorID
            -dynamic for actors + platforms
        4. Make and return movie
        
        */ 

        // 1
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

           // 2
           let movie = await Movie.findOne({Name: name.trim()})

           if (!movie) {

               let movieID = !movie ? mongoose.Types.ObjectId() : movie._id
    
               // 3
               let directorIns = await Director.findOne(({
                   Name: director.trim()
               }))
    
               let directorID = !directorIns ? mongoose.Types.ObjectId() : directorIns._id
    
               let actorsArr = actors.split(',').map( actor => {
                let actorIns = await Actor.findOneAndUpdate(
                    {Name: actor.trim()}, 
                    {$push: {Movies: movieID}},
                    {$upsert: true}
                )
                return actorIns._id
               })
    
               let platformArr = platforms.split(',').map( platform => {
                   let platformIns = await Platform.findOneAndUpdate(
                       {Name: platform.trim()},
                       {$push: {Movies: movieID}},
                       {$upsert: true}
                   )
                   return platformIns._id
               })
    
               let genreArr = genres.split(',').map( genre => {
                   return genre.trim()
               })
                
               // 4
               let movieNew = Movie.create({
                    Name: name.trim(),
                    Director: directorID,
                    Actors: actorsArr,
                    Platform: platformArr,
                    TomatoPublic: tom_pub,
                    TomatoCritic: tom_crit,
                    Genres: genreArr
               })

               res.send(movieNew)

            } else {
                res.send("This movie already exists in the database")
            }

        } catch (err) {
            console.log(err)
        }
    }

}