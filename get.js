const https = require('https')
var fs = require('fs');


var temp = "";
var output;

async function get() {

  const options = {
      hostname: 'discord.com',
      port: 443,
      path: '/api/v8/applications/862632357911199744/guilds/862634243912761344/commands',
      method: 'GET',
      headers: {
          'Authorization': 'Bot ODYyNjMyMzU3OTExMTk5NzQ0.YObK_Q.8lJWWd42oer-EHNz9cyuXUAB1rM',
          'Content-Type': 'application/json'
      }
  }

  function tempToOut(){
    fs.appendFile('tempCommands.json', temp, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    
  }

  const req = await https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data',async d => {
      let data = d.toString();
      temp = data;
      fs.appendFile('tempCommands.json', temp, function (err) {
        if (err)
          throw err;
        console.log('Saved!');
      });
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.end()

}

get()

module.exports.getCommands = get()

