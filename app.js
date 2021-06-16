const express = require('express')
const compression = require('compression')
const app = express()
app.use(compression())
app.use(express.static('./dist'))
app.listen(18000, () => {
    console.log('server run at 18000')
})
