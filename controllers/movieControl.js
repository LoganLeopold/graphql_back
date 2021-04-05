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

            // for testing purposes - DELETE 
            let movieID = mongoose.Types.ObjectId()
           // 2
           let movie = await Movie.findOne({Name: name.trim()})

        let actorsArr = actors.split(',')

        let actor1 = actorsArr[0].trim()

        let newactor = await Actor.findOneAndUpdate({Name: actor1}, {$push: {Movies: movieID}}, {$upsert: true, $returnNewDocument: true})

        console.log(newactor)

        //    let actorsNew = await Promise.all(actors.split(',').map( async (actor) => {
        //        actor = toString(actor.trim())
        //     let actorIns = await Actor.findOneAndUpdate(
        //         {Name: actor}, 
        //         {$push: {Movies: movieID}},
        //         {$upsert: true}
        //     )
        //    }))

        //    console.log(actorsNew)

        //    if (!movie) {
            if (2 === 1) {

               let movieID = mongoose.Types.ObjectId()
    
               // 3
               let directorIns = await Director.findOne({
                   Name: director.trim()
               })
    
               let directorID = !directorIns ? mongoose.Types.ObjectId() : directorIns._id
    
               let actorsArr = await Promise.all(actors.split(',').map( async (actor) => {
                let actorIns = await Actor.findOneAndUpdate(
                    {Name: actor.trim()}, 
                    {$push: {Movies: movieID}},
                    {$upsert: true}
                )
                return actorIns._id
               }))
    
               let platformArr = await Promise.all(platforms.split(',').map( async (platform) => {
                   let platformIns = await Platform.findOneAndUpdate(
                       {Name: platform.trim()},
                       {$push: {Movies: movieID}},
                       {$upsert: true}
                   )
                   return platformIns
               }))
    
               let genreArr = genres.split(',').map( genre => {
                   return genre.trim()
               })
                
               let movieNew = await Movie.create({
                    _id: movieID,
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
                res.send(movie)
            }

        } catch (err) {
            console.log(err)
        }
    }

}