const Mongoose = require('mongoose')

/*
Insert:
- id (Id of document you're clearing from other doc arrays)
- req (Request of update to get base url + loop through models that are getting cleaned)

Async resolves to:
- Array of tuples: [ (string), (array) ]
    - string = model name + 's' for easy manipulation into new doc in update
    - array = array of ids to insert into new doc in update
*/

async function auditDocs( id, req) {

    //Establishing auditFor
    let baseUrl = req.baseUrl.split('').filter( ( letter, i ) => {
        if (i > 0) {
            return true
        } else {
            return false
        }
    }).join('')
    
    let auditFor = baseUrl.charAt(0).toUpperCase() + baseUrl.slice(1) 

    //Gathering models to audit
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