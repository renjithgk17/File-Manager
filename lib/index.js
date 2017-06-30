/*Variable declarations*/
var http = require('http');
var _ = require('lodash');
var express = require('express')
    ,app = module.exports = express();

var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var file = require('file-system');
var JSZip = require('jszip');

var path = require('path');
var util = require('util');
_.contains = _.includes
var program = require('commander');
function collect(val, memo) {
    if (val && val.indexOf('.') != 0) val = "." + val;
    memo.push(val);
    return memo;
}
program
    .option('-p, --port <port>', 'Port to run the file-browser. Default value is 8088')
    .option('-e, --exclude <exclude>', 'File extensions to exclude. To exclude multiple extension pass -e multiple times. e.g. ( -e .js -e .cs -e .swp) ', collect, [])
    .parse(process.argv);
var app = express();
var dir = process.cwd();
//console.log("jhihi"+dir)
app.use(express.static(dir)); //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);
if (!program.port) program.port = 3000;
server.listen(program.port, function(err){
    if(err) throw err
});
console.log("Please open the link in your browser http://<YOUR-IP>:" + program.port);
app.get('/files', function (req, res) {
    console.log(req.query.dir);
    var currentDir = req.query.dir.replace(/"/g,'');

    var query = req.query.path || '';

    console.log("browsing ", currentDir);
    fs.readdir(currentDir, function (err, files) {
        if (err) {
            throw err;
        }
        var data = [];
        files
            .filter(function (file) {
                return true;
            }).forEach(function (file) {
            try {
                var isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();

                if (isDirectory) {
                    var fileTime = fs.statSync(path.join(currentDir,file)).mtime.toLocaleString();
                    data.push({Name: file,time: fileTime, IsDirectory: true, Path: path.join(query, file),currentDir:currentDir});
                } else {
                    var ext = path.extname(file);
                    if (program.exclude && _.contains(program.exclude, ext)) {
                        console.log("excluding file ", file);
                        return;
                    }
                    var fileSize = fs.statSync(path.join(currentDir,file)).size.toString() +" KB";
                    var fileTime = fs.statSync(path.join(currentDir,file)).mtime.toLocaleString();
                    console.log("Size :"+fileSize);


                    data.push({Name: file, Ext: ext, IsDirectory: false,size: fileSize,time: fileTime,  Path: path.join(query, file),currentDir:currentDir});



                }
            } catch (e) {
                console.log(e);
            }
        });
        data = _.sortBy(data, function (f) {
            return f
        });
        console.log(data);
        res.json(data);
    });
});
app.get('/', function (req, res) {
    res.redirect('views/index.html');
});

//file download.
/*

var path = require('path');
var mime = require('mime');

app.get('/download', function(req, res){

    var file = __dirname + '/upload-folder/dramaticpenguin.MOV';
    console.log("File:"+ file)

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});*/
