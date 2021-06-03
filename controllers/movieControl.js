var mongoose = require('mongoose');
const { movies: Movie } = require("../models/movie")
const { directors: Director } = require("../models/director")
const { platforms: Platform } = require("../models/platform")
const { actors: Actor} = require("../models/actor")
const { auditDocs } = require('../utilities');

module.exports = {

    list: async (req, res) => {
        let moviesRes = await Movie.find({})
        res.send(moviesRes)
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
            directors,
            actors, 
            platforms, 
            tom_pub, 
            tom_crit, 
            genres
        } = req.body;

        try {   

           // 2
           let movie = await Movie.findOne({name: name.trim()})

           if (!movie) {

               let movieID = mongoose.Types.ObjectId()
    
               // 3
                let directorsArr = await Promise.all(directors.split(',').map( async (dir, i) => {
                    let dirIns = await Director.findOneAndUpdate(
                        {name: dir.trim()}, 
                        {
                            $push: {movies: movieID},
                            $setOnInsert: {
                                name: dir.trim(),
                            }
                        },
                        {upsert: true, new: true, setDefaultsOnInsert: true}
                    )
                    return dirIns._id
                }))

                let actorsArr = await Promise.all(actor.split(',').map( async (act) => {
                    let actorIns = await Actor.findOneAndUpdate(
                        {name: act.trim()}, 
                        {
                            $push: {movies: movieID},
                            $setOnInsert: {
                                name: act.trim(),
                            }
                        },
                        {upsert: true, new: true, setDefaultsOnInsert: true}
                    )
                    return actorIns._id
                }))
    
               let platformArr = await Promise.all(platform.split(',').map( async (plat) => {
                   let platformIns = await Platform.findOneAndUpdate(
                       {name: plat.trim()},
                       {
                        $push: {movies: movieID},
                        $setOnInsert: {
                            name: plat.trim(),
                        }
                    },
                       {upsert: true, new: true, setDefaultsOnInsert: true} 
                   )
                   return platformIns._id
               }))
    
               let genreArr = genre.split(',').map( genre => {
                   return genre.trim()
               })
                
               let movieNew = await movies.create({
                    _id: movieID,
                    name: name.trim(),
                    directors: directorsArr,
                    actors: actorsArr,
                    platforms: platformArr,
                    tomatopublic: tom_pub,
                    tomatocritic: tom_crit,
                    genres: genreArr
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

            let movieClear = await Movie.findByIdAndUpdate(
                id, 
                {
                    name: '',
                    director: null,
                    actors: [],
                    platforms: [],
                    tomatoPublic: null,
                    tomatoCritic: null,
                    genres: []
                },
                {
                    new: true,
                    setDefaultsOnInsert: true,
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

            newDocsArr.forEach( model => update[`${model[0]}`] = model[1] )
            
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