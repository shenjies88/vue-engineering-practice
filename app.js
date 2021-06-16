const express = require('express')
const app = express()
app.use(express.static('./dist'))
app.listen(18000, () => {
    console.log('server run at 18000')
})
