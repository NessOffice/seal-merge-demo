// const mysql   = require('mysql');
// const express = require('express');
// const urlJoin = require('url-join');
// 
// const app = express();
// const hostname = 'localhost';
// const port = 9000;
// const baseURL = '/';
// const fullURL = path => urlJoin(baseURL, path);
// 
// app.use(baseURL, express.static('static'));
// app.use(fullURL('/resources'), express.static('seal-img'));
// 
// var pool = mysql.createPool({ 
//  host   : '123.56.17.42', 
//  user   : 'small_seal_visitor', 
//  password : 'THE_password123', 
//  database : 'small_seal'
// }); 
// 
// let query = function( sql, values ) {
//   return new Promise(( resolve, reject ) => {
//     pool.getConnection(function(err, connection) {
//       if (err) {
//         reject( err );
//       } else {
//         connection.query(sql, values, ( err, rows) => {
//           if ( err ) {
//             reject( err );
//           } else {
//             resolve( rows );
//           }
//           connection.release();
//         })
//       }
//     })
//   })
// }
// module.exports =  query
// 
// app.get(fullURL('/query'), async (req, res) => {
//     let sql_data = await query("SELECT * FROM small_seal_content WHERE keyword LIKE '%" + req.query.keyword + "%'");
//     res.send(sql_data);
// });
// 
// app.listen(port, () => {
//   console.log(`Server running at ${hostname}:${port}`)
// });

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = require("./router");


app.use(express.static(path.join(__dirname,'static')));

app.engine('html',require('ejs').__express);
app.set("view engine","html");
app.use("/",router);

app.all('*', function(req, res, next) {             //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//配置服务端口
var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s',host,port)
})



