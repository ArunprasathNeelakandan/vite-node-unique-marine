

const sql = require('mysql2')

const db = sql.createPool({
    host:'localhost',
    user:'appuniquemarine_user',
    password:'N4f8,k-g#f,s',
    database:'appuniquemarine_db',
    
})

module.exports = db.promise()