var mongoose = require('mongoose');
const { Movie } = require("../models/movie")
const { Director } = require("../models/director")
const { Platform } = require("../models/platform")
const { Actor } = require("../models/actor")
const { auditDocs, capitalize, depluralize }  = require('../utilities')

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
            actor, 
            platform, 
            tom_pub, 
            tom_crit, 
            genre
        } = req.body;

        try {   

           // 2
           let movie = await Movie.findOne({Name: name.trim()})

           if (!movie) {

               let movieID = mongoose.Types.ObjectId()
    
               // 3
               let directorCheck = await Director.findOneAndUpdate(
                    {Name: director.trim()}, 
                    {
                        $push: {Movies: movieID},
                        $setOnInsert: {
                            Name: director.trim(),
                        }
                    },
                    {upsert: true, new: true}
               )
    
               let directorID = directorCheck._id

                let actorsArr = await Promise.all(actor.split(',').map( async (act) => {
                    let actorIns = await Actor.findOneAndUpdate(
                        {Name: act.trim()}, 
                        {
                            $push: {Movies: movieID},
                            $setOnInsert: {
                                Name: act.trim(),
                            }
                        },
                        {upsert: true, new: true}
                    )
                    return actorIns._id
                }))
    
               let platformArr = await Promise.all(platform.split(',').map( async (plat) => {
                   let platformIns = await Platform.findOneAndUpdate(
                       {Name: platf.trim()},
                       {
                        $push: {Movies: movieID},
                        $setOnInsert: {
                            Name: plat.trim(),
                        }
                    },
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

        const { name, director, actor, platform, tom_pub, tom_crit, genre } = req.body;

        const { id } = req.params 

        try {   

            let newDocsArr = await auditDocs(id, req)

            console.log(newDocsArr)

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
            // let dir = await Director.findOneAndUpdate()

            // THESE COULD MAYBE USE FINDONEANDUPDATE? 
            // let actorsArr = await Promise.all(actor.split(',').map( async (act) => {
            //     let actorIns = await Actor.findOneAndUpdate(
            //         {Name: act.trim()}, 
            //         {
            //             $addToSet: {'Movies': id},
            //             $setOnInsert: {
            //                 Name: act.trim(),
            //             }
            //         },
            //         {upsert: true, new: true}
            //     )
            //     return actorIns._id
            // }))
    
            // let platformArr = await Promise.all(platform.split(',').map( async (plat) => {
            //     let platformIns = await Platform.findOneAndUpdate(
            //         {Name: plat.trim()},
            //         {
            //             $addToSet: {'Movies': id},
            //             $setOnInsert: {
            //                 Name: plat.trim(),
            //             }
            //         },
            //         {upsert: true, new: true} 
            //     )
            //     return platformIns._id
            // }))

            
            
            let newDocsArr = auditDocs(req, id, 'Movie')
            
            

            // let genreArr = genres.split(',').map( genre => {
            //     return genre.trim()
            // })
                
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

    },

    testAbst: async (req, res) => {

        res.send("SUP BRAH")

    }

}