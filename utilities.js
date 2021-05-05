const Mongoose = require('mongoose')

module.exports = {

    /*
    AUDITDOCS

    Insert:
    - id (Id of document you're clearing from other doc arrays)
    - req (Request of update to get base url + loop through models that are getting cleaned)

    Async resolves to:
    - Array of pairs: [ [(string), (array)] ]
        - string = model name + 's' for easy manipulation into new doc in update
        - array = array of ids to insert into new doc in update
    */

    auditDocs: async ( id, req ) => {
        
        //Establish auditFor using url
        // let auditFor = req.baseUrl.charAt(1).toUpperCase() + req.baseUrl.slice(2) 
        let auditFor = this.capitalize(req.baseUrl, 1, 2)

        //Gathering models to audit
        let reqProps = Object.keys(req.body)

        let presentModels = reqProps.reduce( ( acc, prop ) => {

            let propCap = prop.charAt(0).toUpperCase() + prop.slice(1)

            if (mongoose.modelNames().includes(propCap)) {
                acc.push( [prop, propCap] )
            }

            return acc

        }, [])

        try {

            //Loop through presentModels and use prop from req and model name array to carry out filtering below and return final array of promises
            let newData = await Promise.all( presentModels.map( async (arr) => {
        
                    //Get all documents that have the movie in their array using model
                    let currDocs = await Mongoose.model(arr[1]).find({[auditFor]: id})
                    

                    /*
                    ----------------------------------------------------------------------------
                    ----------------------------------------------------------------------------
                    The next project will be bulk-writing through this whole section with one 
                    load. I should just load in a query for bulk write based on whether or not
                    it's in the reqData. 
                    ----------------------------------------------------------------------------
                    ----------------------------------------------------------------------------
                    */

                    //Use request data to filter them:
                    let reqData = req.body[arr[0]].split(',').map( model => model.trim())
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
                    
                    //If they were in the req, they must go in 
                    let load = reqData.map( (item, i) => {
                        load.push({
                            updateOne: { 
                                filter: {
                                    Name: item
                                },
                                update: {
                                    $addToSet: { [auditFor]: id },
                                    $setOnInsert: {
                                        Name: item
                                    }
                                },
                                upsert: true,
                            }
                        })
                    })        

                    let loadedDocs = await Mongoose.model(arr[1]).bulkWrite(load)

                    //Wait for loaded docs to check for Ids from newly loaded reqData
                    let newDocs = loadedDocs.then( async () => {
                        return await Promise.all( reqData.map( (item, i) => {
                            let doc = await Mongoose.model(arr[1]).findOne({Name: item})
                            return doc._id
                        }))
                    })
        
        
                    return [ prop, newDocs]
        
                } 
            ))

        } catch (err) {
            console.log(err)
        }

    },

    capitalize: (word, charAt, slice) => word.charAt(charAt).toUpperCase() + word.slice(slice),

    pluralize: word => word += 's',

    depluralize: word => {

        let arr = word.split('')
        arr.splice(arr.length - 1, 1)
        return arr.join('')

    },


} //END MODULE.EXPORTS
