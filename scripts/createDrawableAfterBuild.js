var fs = require('fs-extra');

// rootdir
var rootDir = process.cwd();

//emptyDir creates dir when not present
fs.emptyDir(rootDir+'/platforms/android/res/drawable', function (err) {

    //simple task, just nest it

    fs.copy(rootDir + '/www/img/drawable', rootDir + '/platforms/android/res/drawable', function (err) {
        
    if (err) console.log(err)
    if (!err) process.stdout.write('created drawable folder')

    
    });
  
})