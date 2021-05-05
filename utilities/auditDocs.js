async function auditDocs( id, Model = '') {

    let movie = await mongoose.model(Model).findById(id)

    res.send(movie)

}

export default auditDocs