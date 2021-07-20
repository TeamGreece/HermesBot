const https = require('https')

// const data = JSON.stringify({
//     "name": "ping",
//     "description": "Send a message to everyone",
//     "options": []
// })

const options = {
    hostname: 'discord.com',
    port: 443,
    path: '/api/v8/applications/862632357911199744/guilds/862634243912761344/commands/863764835865722910',
    method: 'DELETE',
    headers: {
        'Authorization': 'Bot ODYyNjMyMzU3OTExMTk5NzQ0.YObK_Q.8lJWWd42oer-EHNz9cyuXUAB1rM',
        'Content-Type': 'application/json'
    }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()