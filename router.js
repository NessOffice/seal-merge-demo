var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const mysql   = require('mysql');
const urlJoin = require('url-join');

const baseURL = '/';
const fullURL = path => urlJoin(baseURL, path);

//router 1 index.html
router.get("/",function(req,res){
	res.sendFile(__dirname+"/static/"+"index.html");
});

function getFiles(url, ext) {
	var fileList = [];
	var readDir = fs.readdirSync(url,function(err, files){   
        if (err) {
                return console.error(err);
        }
        files.forEach( function (file){
            fs.stat(url+file, (err, stats) => {
                if(stats.isFile()) {
                    if(path.extname(url+file) === ext) {
                        // console.log( path.basename(file, ext)  )
                        fileList.push(path.basename(file, ext))
                    }
                } else if(stats.isDirectory()) {
					getFile(url+file+'/', ext)
					fileList.push(path.basename(url+file+'/', ext))
                }
            })
                
        })
	})
	return readDir;
}
  
function availableComponentsList() {
	var index_dir = path.join(__dirname, './compose-data/model/');
	componentsList = getFiles(index_dir, '.json');
	return componentsList;
}

//router 2 /available-components-index.json
router.get('/available-components-index.json', function (req,res) { 
	let ava = availableComponentsList();
	console.log(ava);
	return res.send(JSON.stringify(ava));
	// return JSON.stringify(ava);
  })

//router 3 /model/:json_name
router.get('/model/:json_name', function(req, res) {
	var file = path.join(__dirname, './compose-data/model/'+req.params.json_name+'.json'); 
	fs.readFile(file, function(err, data) {
		console.log(data);
		if (err) {
			res.send('json文件获取失败');
		} else {
			jsonStr = JSON.parse(data);
			return res.send(JSON.stringify(jsonStr));
		}
	});
});

router.use(fullURL('/resources'), express.static('seal-img'));

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

router.get(fullURL('/query'), async (req, res) => {
    let sql_data = await query("SELECT * FROM small_seal_content WHERE keyword LIKE '%" + req.query.keyword + "%'");
    res.send(sql_data);
});

module.exports = router;
