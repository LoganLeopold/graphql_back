var mongoose = require('mongoose');
const { Movie } = require("../models/movie")
const { Director } = require("../models/director")
const { Platform } = require("../models/platform")
const { Actor } = require("../models/actor")
const { auditDocs, capitalize, depluralize, pluralize }  = require('../utilities');

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

            /*
            ------------------------------------------------------------------------------------
            ------------------------------------------------------------------------------------
            Now I must get the arrays from newDocsArr and assign them appropriately
            ------------------------------------------------------------------------------------
            ------------------------------------------------------------------------------------
            */

            let update = {}
            
            let newDocsArr = await auditDocs(id, req)

            newDocsArr.forEach( model => update[`${pluralize(capitalize(model[0], 0, 1))}`] = model[1] )
            
            let genreArr = genre.split(',').map( genre => {
                return genre.trim()
            })

            update["Name"] = name
            update["TomatoPublic"] = tom_pub
            update["TomatoCritic"] = tom_crit
            update["Genres"] = genreArr
                

            let movieNew = await Movie.findByIdAndUpdate(
                id, 
                update,
                {
                    new: true
                }
            )
            
            res.send(movieNew)

        } catch (err) {
            console.log(err)
        }

    },

    testAbst: async (req, res) => {

        res.send("SUP BRAH")

    }

}