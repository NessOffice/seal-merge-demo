const mysql   = require('mysql');
const express = require('express');
const urlJoin = require('url-join');

const app = express();
const hostname = 'localhost';
const port = 9000;
const baseURL = '/';
const fullURL = path => urlJoin(baseURL, path);

app.use(baseURL, express.static('static'));
app.use(fullURL('/resources'), express.static('seal-img'));

var pool = mysql.createPool({ 
 host   : '123.56.17.42', 
 user   : 'small_seal_visitor', 
 password : 'THE_password123', 
 database : 'small_seal'
}); 

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err );
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err );
          } else {
            resolve( rows );
          }
          connection.release();
        })
      }
    })
  })
}
module.exports =  query

app.get(fullURL('/query'), async (req, res) => {
    let sql_data = await query("SELECT * FROM small_seal_content WHERE keyword LIKE '%" + req.query.keyword + "%'");
    res.send(sql_data);
});

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`)
});
