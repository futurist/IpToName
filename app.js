
var exec = require('child_process').exec
var util = require('util')
var fs = require('fs')

var outFile = 'list.csv'
var listArray = []
var result = []
fs.writeFile(outFile, '', 'utf8')
function ipToName (clientIP) {
    exec( 'nbtstat -A '+clientIP, function  (err, stdout, stderr) {
      if(err) return //console.log(err, stderr);
      // var stat = TableParser.parse(stdout);
      var t, stat = stdout.split(/\r\n/);
      var macAddress = '';
      var clientName = '';
      var clientGroup = '';

      stat.some(function  (v, i) {
        if( t=v.match(/([^\t <]+).*<00>.*UNIQUE\s+Registered/i) ){
          clientName = t.pop()
          console.log(clientName)
        }
        if( t=v.match(/([^\t <]+).*<00>.*GROUP\s+Registered/i) ){
          clientGroup = t.pop()
        }
        if( t = v.match(/MAC\s+Address\s+=\s+(\S+)/i) ){
          macAddress = t.pop()
        }
      });
      if(clientName)
        fs.appendFile( outFile, util.format('"%s","%s","%s","%s"\r\n', macAddress, clientIP, clientName, clientGroup ), 'utf8' )
    })
}


var list = `
192.168.1.2
192.168.1.27
192.168.1.100
`
listArray = (list.trim().split('\n'))

for(var i=2;i<254;i++){
  listArray.push('192.168.1.'+i)
}

listArray.forEach(function(v){
  ipToName(v)
})

