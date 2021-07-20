const DiscordJs = require('discord.js')
const buttons = require('discord-buttons')
const commandsList = require('./commands.json')
require('dotenv').config()
const https = require('https')

const client = new DiscordJs.Client()
buttons(client)

const guildId = "862634243912761344"

let action = new buttons.MessageActionRow()
action.addComponent(button)

const commandRegisterOptions = {
  hostname: 'discord.com',
  port: 443,
  path: `/api/v8/applications/862632357911199744/guilds/${guildId}/commands`,
  method: 'POST',
  headers: {
      'Authorization': `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json'
  }
}

// const interactionOptions = function(interaction_id, interaction_token){
//   let options = {
//     hostname: 'discord.com',
//     port: 443,
//     path: `api/v8/interactions/${interaction_id}/${interaction_token}/callback`,
//     method: 'POST',
//   }
//   return options
// }

client.on('ready', async () => {

  const req = https.request(commandRegisterOptions, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(JSON.stringify(commandsList['ping']['properties']))
  req.end()

  console.log('Im on')
})

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  const { name, id } = interaction.data
  const token = interaction['token']


  const command = name.toLowerCase()

  console.log('\nCommand used: ' + command)

  
  switch(command){
    case 'ping':
      reply(interaction, action)
  }
  
})

const reply = async (interaction, response) => {
  let data = {
    content: response,
  }

  // let data = {
  //   content: "Fuck you",
  //   embeds: helpEmbed
  // }

  // console.log(data.embeds)
  // Check for embeds
  if (typeof response === 'object') {
    data = await createButtonMessage(interaction, response)
    console.warn(data)
  }

  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: data,
    },
  })
}

const createAPIMessage = async (interaction, content) => {
  const { data, files } = await DiscordJs.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles()

  return { ...data, files }
}

const createButtonMessage = async (interaction, content) => {
  const { data, files } = await buttons.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content='Yeet',
    embed=helpEmbed,
    components=action,
    
  )
    .resolveData()
    .resolveFiles()



  return { ...data, files }
}

client.on('message', message =>{
  if (message.author.bot) return;
  message.channel.send("message with a button!", button)
  let option = new buttons.MessageMenuOption()
    .setLabel('Your Label')
    .setEmoji('🍔')
    .setValue('mult')
    .setDescription('Custom Description!')
    
let select = new buttons.MessageMenu()
    .setID('menu')
    .setPlaceholder('Click me! :D')
    .setMaxValues(1)
    .setMinValues(1)
    .addOption(option)

message.channel.send('Text with menu!', select);

})

// client.on('clickButton', async (button) => {
//   console.log(button)
//   console.log(button.id === 'seul')
//   await button.reply.send("shiiiiit")
// });

client.on('clickMenu', async (menu) => {
  // console.log(menu.message.components[0].components[0])
  await menu.reply.send("wowowowowowowow")
})


client.login(process.env.TOKEN)

//  headers = {"Authorization": "Bot ODYyNjMyMzU3OTExMTk5NzQ0.YObK_Q.8lJWWd42oer-EHNz9cyuXUAB1rM"}