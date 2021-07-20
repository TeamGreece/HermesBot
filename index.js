const DiscordJs = require('discord.js')
const buttons = require('discord-buttons')
const commandsList = require('./commands.json')
require('dotenv').config()
const https = require('https')

const client = new DiscordJs.Client()
buttons(client)

const guildId = "705044568047091815"

const commandRegisterOptions = {
  hostname: 'discord.com',
  port: 443,
  path: `/api/v8/applications/705848696419516488/guilds/${guildId}/commands`,
  method: 'POST',
  headers: {
      'Authorization': `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json'
  }
}

client.on('ready', async () => {

  const req = https.request(commandRegisterOptions, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      // process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })

  req.write(JSON.stringify(commandsList['meeting']['properties']))
  
  req.end()

  console.log('Im on')
})

var activeMeetings = []

client.ws.on('INTERACTION_CREATE', async (interaction) => {
  if (interaction.type === 3){
    let ids = interaction.data.custom_id.split("_")
    const username = interaction.member.user.username
    const userAvatar = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`
    const nickname = interaction.member.nick
    const id = interaction.member.user.id
    const discriminator = interaction.member.user.discriminator

    const person = {
      username: username,
      avatarUrl: userAvatar,
      nickname: nickname,
      id: id,
      discriminator: discriminator
    }
    if (activeMeetings.find(meeting => meeting.id === ids[1])){
      const meeting = activeMeetings.find(meeting => meeting.id === ids[1])

      switch (ids[0]){
        case 'yes':
          const yesReaction = new DiscordJs.MessageEmbed()
            .setColor('#43B581')
            .setTitle('Reaction Update!')
            .setDescription(`<@${id}> reacted with "Yes!"`)
            .setFooter("Meeting Reaction",userAvatar)
            .setTimestamp()

            reply(interaction, '', yesReaction)
            if(meeting.maybePeople.find(p => p.id === person.id)){
              meeting.maybePeople = meeting.maybePeople.filter(p => p.id !== person.id)
              console.log('ur mom is surely gay')
              //Handle this
            }else if(meeting.noPeople.find(p => p.id === person.id)){
              meeting.noPeople = meeting.noPeople.filter(p => p.id !== person.id)
            }else if(meeting.yesPeople.find(p => p.id === person.id)){return}

            meeting.yesPeople.push(person)

            
            break
        case 'maybe':
          const maybeReaction = new DiscordJs.MessageEmbed()
            .setColor('#7289DA')
            .setTitle('Reaction Update!')
            .setDescription(`<@${id}> reacted with "Maybe!"`)
            .setFooter("Meeting Reaction",userAvatar)
            .setTimestamp()

          reply(interaction, '', maybeReaction)
          
          if(meeting.yesPeople.find(p => p.id === person.id)){
            meeting.yesPeople = meeting.yesPeople.filter(p => p.id !== person.id)
            console.log('ur mom is maybe gay')
            //Handle this
          }else if(meeting.noPeople.find(p => p.id === person.id)){
            meeting.noPeople = meeting.noPeople.filter(p => p.id !== person.id)
          }else if(meeting.maybePeople.find(p => p.id === person.id)){return}
          meeting.maybePeople.push(person)
          
          break
        case 'no':
          const noReaction = new DiscordJs.MessageEmbed()
            .setColor('#F04747')
            .setTitle('Reaction Update!')
            .setDescription(`<@${id}> reacted with "No!"`)
            .setFooter("Meeting Reaction",userAvatar)
            .setTimestamp()

          reply(interaction, '', noReaction)
          if(meeting.yesPeople.find(p => p.id === person.id)){
            meeting.yesPeople = meeting.yesPeople.filter(p => p.id !== person.id)
            console.log('ur mom is not gay... SIKE!')
            //Handle this
          }else if(meeting.maybePeople.find(p => p.id === person.id)){
            meeting.maybePeople = meeting.maybePeople.filter(p => p.id !== person.id)
          }else if(meeting.noPeople.find(p => p.id === person.id)){return}

          meeting.noPeople.push(person)
        break
      }
      console.log(meeting)
    }
  }
  if (interaction.type === 2){  
    const { name, options } = interaction.data
    command = name.toLowerCase()

    console.log('\nCommand used: ' + command)
    
    switch(command){
      case 'meeting':
        const { name, options } = interaction.data.options[0]
        subcommand = name.toLowerCase()

        console.log('\nCommand used: ' + subcommand)
        switch(subcommand){
          case 'set':
            let arguments = {}

            if (options){
              for (const option of options){
                  const { name, value } = option
                  arguments[name] = value
              }
            }

            const meetingAuthor = interaction.member.user.username
            const meetingTheme = arguments['meeting_name']
            const meetingDay = arguments['day']
            const meetingTime = arguments['time']
            const meetingId = interaction.id

            var meeting = {
              id: meetingId,
              author: {
                author: meetingAuthor,
                id: interaction.member.user.id
              },
              channel_id: interaction.channel_id,
              interaction_id: interaction.id,
              interaction_token: interaction.token,
              arguments: {
                theme: meetingTheme,
                time: meetingTime,
                day: meetingDay
              },
              yesPeople:[],
              noPeople:[],
              maybePeople:[],
            }

            const userAvatar = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`

            const notificationEmbedMeeting = new DiscordJs.MessageEmbed()
                                            .setColor('#92000A')
                                            .setTitle('Alert! Meeting Set!')
                                            .setDescription('**' + meetingAuthor + ' **has arranged a general meeting with theme **"' + meetingTheme + '"**.')
                                            .setAuthor('Meeting set by ' + meetingAuthor, userAvatar)
                                            .addFields(
                                                {name: 'Meeting Day', value:   meetingDay.charAt(0).toUpperCase() + meetingDay.substring(1) + " 📅"},
                                                {name: 'Meeting Time', value: meetingTime},
                                            )
                                            .setFooter('Click "Yes", "Maybe" or "No" to show availability')
                                            .setTimestamp()
            
            const yesButton = new buttons.MessageButton()
                              .setID('yes_' + meetingId)
                              .setLabel('Yes')
                              .setStyle('green')
            const noButton = new buttons.MessageButton()
                              .setID('no_' + meetingId)
                              .setLabel('No')
                              .setStyle('red')
            const maybeButton = new buttons.MessageButton()
                              .setID('maybe_' + meetingId)
                              .setLabel('Maybe')
                              .setStyle('blurple')
            const availabilityRow = new buttons.MessageActionRow().addComponents(yesButton, maybeButton, noButton)

            if (arguments['notify']){
              reply(interaction, '@everyone', notificationEmbedMeeting, availabilityRow)
            }else{
              reply(interaction, '', notificationEmbedMeeting, availabilityRow)
            }

            activeMeetings.push(meeting)
            console.log(activeMeetings)
            break
          
          case 'view':
            const meetingView = new DiscordJs.MessageEmbed()
              .setColor('#92000A')
              .setTitle('Meeting Availability')
              .setDescription('**' + 'meetingAuthor' + ' **has arranged a general meeting with theme **"' + 'meetingTheme' + '"**.')
              .setAuthor('Meeting set by ' + 'meetingAuthoruserAvatar')
              .setFooter('Click "Yes", "Maybe" or "No" to show availability')
              .setTimestamp()

            reply(interaction, '', meetingView)
        }
        }
        
  }
  
})

const reply = async (interaction, content, embeds=[], components=[]) => {

  let data = await createAPIMessage(interaction, content, embeds, components)
  // console.log(data)
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: data,
    },
  })
}

const createAPIMessage = async (interaction, content, embeds, components) => {
  const { data, files } = await buttons.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content=content,
    embed=embeds,
    components=components,
  )
    .resolveData()
    .resolveFiles()

  return { ...data, files }
}

client.on('message', message =>{
  if (message.author.bot) return;

})

client.on('clickMenu', async (menu) => {})


client.login(process.env.TOKEN)

