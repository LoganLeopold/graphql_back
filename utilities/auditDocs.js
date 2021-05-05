const Mongoose = require('mongoose')

/*
Insert:
- id (Id of document you're clearing from other doc arrays)
- req (Request of update to get base url + loop through models that are getting cleaned)
*/

async function auditDocs( id, req, auditFor = '') {

    let baseUrl = req.baseUrl.split('').filter( ( a, b, i ) => {
        if (i > 0) {
            return 1
        } else {
            return -1
        }
    }).join('')

    console.log(baseUrl)

    let reqProps = Object.keys(body)

    let remainders = reqProps.reduce( ( acc, prop ) => {

        let propCap = prop.charAt(0).toUpperCase() + prop.slice(1)

        if (mongoose.modelNames().includes(propCap)) {
            acc.push(propCap)
        }

        return acc

    }, [])

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