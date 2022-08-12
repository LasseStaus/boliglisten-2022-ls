const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/api/properties', express.static(__dirname + '/data.json'))

app.listen(3000, () => console.log('Listening on port 3000!'))
