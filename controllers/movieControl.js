var mongoose = require('mongoose');
const { Movie } = require("../models/movie")
const { Director } = require("../models/director")
const { Platform } = require("../models/platform")
const { Actor } = require("../models/actor")

module.exports = {

    list: async (req, res) => {
        let movies = await Movie.find({})
        res.send(movies)
    },

    findOne: async (req, res) => {
        let movie = await Movie.findById(req.params.id)
        res.send(movie)
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
                        {upsert: true, new: true}
                    )
                    return actorIns._id
                }))
    
               let platformArr = await Promise.all(platforms.split(',').map( async (platform) => {
                   let platformIns = await Platform.findOneAndUpdate(
                       {Name: platform.trim()},
                       {$push: {Movies: movieID}},
                       {upsert: true, new: true} 
                   )
                   return platformIns._id
               }))
    
               let genreArr = genres.split(',').map( genre => {
                   return genre.trim()
               })
                
               let movieNew = await Movie.create({
                    _id: movieID,
                    Name: name.trim(),
                    Director: directorID,
                    Actors: actorsArr,
                    Platforms: platformArr,
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
    },

    update: async (req, res) => {

        const { name, director, actors, platforms, tom_pub, tom_crit, genres } = req.body;

        const { id } = req.params 

        try {   
            
            // I need to clear the docs that don't get represented AND clear the movie doc to throw on the updates. 

            // I can probably abstract this to a function that works with the req data and model

                //     -Get all documents that have the movie in their array using model
                let currActors = await Actor.find({Movies: id})
                
                //     -Use request data to filter them:
                let reqActors = Actors.split(',').map( actor => actor.trim())
                currActors.forEach( (actor, i) => {
                    if (!reqActors.includes(actor.Name)) {
                        currActors.splice(i, 0)
                    } 
                })

                //      -If they were not present, delete the movie id
                let deletions = await Actor.updateMany(
                    { _id: { $in: currActors } },
                    { $pull: { Movies: id } },
                )
                console.log(deletions) 

                //       -If they were, insert or upsert and return ID to array movieNew update can use
                let newActors = await Actor.updateMany(
                    { _id: { $in: reqActors } },
                    {$addToSet: { Movies: id } },
                    {$upsert: true}
                )
                console.log(newActors)


            // Clear the docs with findManyAndUpdate

            if (1===0) {
            let movieClear = await Movie.findByIdAndUpdate(
                id, 
                {
                    Name: '',
                    Director: null,
                    Actors: [],
                    Platforms: [],
                    TomatoPublic: null,
                    TomatoCritic: null,
                    Genres: []
                },
                {
                    new: true
                }
            )
    
            // let directorArr = await Promise.all(director.split(',').map(async (director) => {
            //     let dir = await Director.findOneAndUpdate(
            //         {Name: director.trim()},
            //         {$addToSet: {'Movies': id}},
            //         {upsert: true, new: true}
            //     )
            //     return dir._id
            // }))
            let dir = await Director.findOneAndUpdate()

            // THESE COULD MAYBE USE FINDONEANDUPDATE? 
            let actorsArr = await Promise.all(actors.split(',').map( async (actor) => {
                let actorIns = await Actor.findOneAndUpdate(
                    {Name: actor.trim()}, 
                    {$addToSet: {'Movies': id}},
                    {upsert: true, new: true}
                )
                return actorIns._id
            }))
    
            let platformArr = await Promise.all(platforms.split(',').map( async (platform) => {
                let platformIns = await Platform.findOneAndUpdate(
                    {Name: platform.trim()},
                    {$addToSet: {'Movies': id}},
                    {upsert: true, new: true} 
                )
                return platformIns._id
            }))
    
            let genreArr = genres.split(',').map( genre => {
                return genre.trim()
            })
                
            movieClear.then( async () => {

                let movieNew = await Movie.findByIdAndUpdate(
                    id, 
                    {
                        Name: name.trim(),
                        Director: directorArr,
                        Actors: actorsArr,
                        Platforms: platformArr,
                        TomatoPublic: tom_pub,
                        TomatoCritic: tom_crit,
                        Genres: genreArr
                    },
                    {
                        new: true
                    }
                )
                
                res.send(movieNew)

            })

        }

        } catch (err) {
            console.log(err)
        }

    }

}