require('dotenv').config();
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.json())

app.use(require('./routes/routes'))

app.get('/', (req,res) => {
    res.send("Hello world!")
})

app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), () => console.log(`locked and loaded on ${app.get('port')}`))