const Mongoose = require('mongoose')

/*
Insert:
- id (Id of document you're clearing from other doc arrays)
- req (Request of update to get base url + loop through models that are getting cleaned)

Async resolves to:
- Array of pairs: [ [(string), (array)] ]
    - string = model name + 's' for easy manipulation into new doc in update
    - array = array of ids to insert into new doc in update
*/

async function auditDocs( id, req ) {

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
    let reqProps = Object.keys(req.body)

    let presentModels = reqProps.reduce( ( acc, prop ) => {

        let propCap = prop.charAt(0).toUpperCase() + prop.slice(1)

        if (mongoose.modelNames().includes(propCap)) {
            acc.push( [prop, propCap] )
        }

        return acc

    }, [])

    //Loop through presentModels and use prop from req and model name array to carry out filtering below and return final array of promises
    let newData = await Promise.all( presentModels.map( async (arr) => {

            //Get all documents that have the movie in their array using model
            let currDocs = await Mongoose.model(arr[1]).find({[auditFor]: id})
            
            //Use request data to filter them:
            let reqModels = req.body[arr[0]].split(',').map( model => model.trim())
            currDocs.forEach( (mod, i) => {
                if (!reqModels.includes(mod.Name)) {
                    currDocs.splice(i, 0)
                } 
            })
        
            //If they were not present, delete the movie id
            let deletions = await Mongoose.model(arr[1]).updateMany(
                { _id: { $in: currDocs } },
                { $pull: { [auditFor]: id } },
            )
            console.log(deletions) 
        
            //If they were, insert or upsert and return ID to array movieNew update can use
            let newDocs = await Mongoose.model(arr[1]).updateMany(
                { _id: { $in: reqModels } },
                {$addToSet: { [auditFor]: id } },
                {$upsert: true}
            )
            
            return [ prop, newDocs]

        } 
    ))


}

module.exports = { auditDocs }