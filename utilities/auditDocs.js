const Mongoose = require('mongoose')

async function auditDocs( id, body, auditIn = '', auditFor = '') {

    // I need to clear the docs that don't get represented AND clear the movie doc to throw on the updates. 

            // I can probably abstract this to a function that works with the req data and model

                //     -Get all documents that have the movie in their array using model
                let currDocs = await Mongoose.model(auditIn).find({[auditFor]: id})
                
                //     -Use request data to filter them:
                let reqActors = actors.split(',').map( actor => actor.trim())
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

}

module.exports = { auditDocs }