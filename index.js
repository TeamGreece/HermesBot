const DiscordJs = require('discord.js')
const buttons = require('discord-buttons')
const commandsList = require('./commands.json')
require('dotenv').config()
const https = require('https')
const { match } = require('assert')

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
// setInterval(function(){
//   console.log(activeMeetings)
// }, 5000)

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
            //Handle this
          }else if(meeting.maybePeople.find(p => p.id === person.id)){
            meeting.maybePeople = meeting.maybePeople.filter(p => p.id !== person.id)
          }else if(meeting.noPeople.find(p => p.id === person.id)){return}

          meeting.noPeople.push(person)
        break
      }
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
            const meetingChannel = client.channels.cache.get(interaction.channel_id)
            const meetingAuthor = interaction.member.user.username
            const meetingTheme = arguments['theme']
            const meetingDate = arguments['date']
            const meetingMonth = arguments['month']
            const meetingYear = arguments['year']
            const meetingHour = arguments['hour']
            const meetingMin = arguments['minute']
            const meetingNotifees = arguments['notify']

            let notifees;
            if(arguments['notify']){
              switch(arguments['notify']){
                case 'everyone':
                  notifees = "@everyone"
                  break;
                case 'cad':
                  notifees = "<@&865253589893906432>"
                  break;
                case 'social':
                  notifees = "<@&865253589893906432>"
                  break;
                case 'website':
                  notifees = "<@&865253589893906432>"
                  break;
                case 'creative':
                  notifees = "<@&865255215812706324>"
                  break;
                case 'fundraising':
                  notifees = "<@&865255215812706324>"
                  break;
                case 'community':
                  notifees = "<@&865255215812706324>"
                  break;
                case 'mods':
                  notifees = "<@&865253589893906432>"
                  break;
              }
            }

            if(meetingDate.toString().length > 2 || meetingDate > 31){
              reply(interaction, 'error')
              return;
            }
            if(meetingYear.toString().length > 4){
              reply(interaction, 'error')
              return;
            }
            let messageTime = Date.parse(meetingYear + "-" + meetingMonth + "-" + meetingDate + " " + meetingHour + ":" + meetingMin + ":00+00:00")
            let currentTime = new Date();
            let currentTimeMs = Date.parse(currentTime)
            var n = currentTime.getTimezoneOffset()
            n = n * 60000
            currentTimeMs -= n

            if(messageTime < currentTimeMs){
              reply(interaction, 'Invalid Time Input')
              return;
            }

            let timeDifference = messageTime - currentTimeMs;
            timeDifference -= 300000
            if(timeDifference < 0){
              timeDifference = 500
            }
            if(timeDifference > 604800000){
              reply(interaction, 'You cant set a meeting for that long!')
              return;
            }
            const meetingNow = new DiscordJs.MessageEmbed()
                .setColor('#102542')
                .setTitle('Meeting Alert!')
                .setDescription('Meeting with theme: **' + meetingTheme + '** by **' + meetingAuthor + '** starts in __**5 Minutes**__!\n\nMeeting regards: ' + notifees)
            setTimeout(function(){
              meetingChannel.send(notifees)
              meetingChannel.send(meetingNow)
            }, timeDifference)
            setTimeout(function(){
              activeMeetings = activeMeetings.filter(m => m.id !== interaction.id)
            }, timeDifference)// + 300000)
            console.log(activeMeetings.indexOf(meeting))
            // console.log(activeMeetings = meeting.yesPeople.filter(p => p.id !== person.id))
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
                time: meetingHour + ":" + meetingMin,
                day: meetingDate + "/" + meetingMonth + "/" + meetingYear
              },
              yesPeople:[],
              noPeople:[],
              maybePeople:[],
            }
            console.log(meeting)

            const userAvatar = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`

            const notificationEmbedMeeting = new DiscordJs.MessageEmbed()
                                            .setColor('#FF7F11')
                                            .setTitle('Hey Team Greece! New Meeting organized by **' + meetingAuthor + "!**")
                                            .setDescription('The meeting with theme **"' + meetingTheme + '"** will occur on **' + meetingDate + "/" + meetingMonth + "/" + meetingYear + "** at **" + meetingHour + ":" + meetingMin + "!**\n\nPlease use the corresponding button below to show **if you will be able to attend!**")
                                            .setAuthor('Meeting organized by ' + meetingAuthor + '!', userAvatar)
            
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
              reply(interaction, notifees, notificationEmbedMeeting, availabilityRow)
            }else{
              reply(interaction, '', notificationEmbedMeeting, availabilityRow)
            }

            activeMeetings.push(meeting)
            break
          
          case 'view':
            let argumentsView = {}
            if (options){
              for (const option of options){
                  const { name, value } = option
                  argumentsView[name] = value
              }
            }
            let meetingCounter = 0;
            const meetingViewNone = new DiscordJs.MessageEmbed()
              .setColor('#FF0000')
              .setTitle('No Meeting Found :(')
              .setDescription("We couldn't find a meeting that you have arranged :/")
              .setFooter(":/")
            const meetingviewAuthor = interaction.member.user.id
            for(i in activeMeetings){
              console.log(i)
              let meetingId = activeMeetings[i]['author']['id']
              if(meetingId == meetingviewAuthor){
                meetingCounter += 1;
                let meetingNameView = activeMeetings[i]['arguments']['theme'] || 'undefined'
                let meetingDayView = activeMeetings[i]['arguments']['day'] || 'undefined'
                let meetingTimeView = activeMeetings[i]['arguments']['time'] || 'undefined'
                let meetingYesView = activeMeetings[i]['yesPeople']
                let meetingMaybeView = activeMeetings[i]['maybePeople']
                let meetingNoView = activeMeetings[i]['noPeople']
                let meetingYesArrayView = []
                let meetingMaybeArrayView = []
                let meetingNoArrayView = []
                for(y in meetingYesView){
                  meetingYesArrayView.push(activeMeetings[i]['yesPeople'][y]['username'])
                }
                for(m in meetingMaybeView){
                  meetingMaybeArrayView.push(activeMeetings[i]['maybePeople'][m]['username'])
                }
                for(n in meetingNoView){
                  meetingNoArrayView.push(activeMeetings[i]['noPeople'][n]['username'])
                }
                meetingYesView = meetingYesArrayView.toString().replace(",", ", ")
                meetingMaybeView = meetingMaybeArrayView.toString().replace(",", ", ")
                meetingNoView = meetingNoArrayView.toString().replace(",", ", ")
                var meetingView = new DiscordJs.MessageEmbed()
                .setColor('##51d437')
                .setTitle('Meeting Found!')
                // .setDescription('We found a meeting that you have arranged!')
                .addFields(
                  {name: 'Meeting Name', value: meetingNameView},
                  {name: 'Meeting Date', value: meetingDayView},
                  {name: 'Meeting Time', value: meetingTimeView},
                  {name: 'Reacted with: YES', value: meetingYesView || "-"},
                  {name: 'Reacted with: MAYBE', value: meetingMaybeView || "-"},
                  {name: 'Reacted with: NO', value: meetingNoView || "-"},
                )
                var meetingViewMore = new DiscordJs.MessageEmbed()
                  .setColor('##3769d4')
                  .setTitle('Multiple Meetings Found!')
                  .setDescription("We found **" + meetingCounter + "** meetings that you have organised. To see them, please add the according number to the command(e.g. /meeting view int:1)")
                  for(const m of activeMeetings){
                    if(m.author.id === meetingviewAuthor){
                      meetingViewMore.addField(
                        `${activeMeetings.indexOf(m) + 1})`, m.arguments.theme, true
                      )
                    }
                  }
                 if(!isNaN(argumentsView['int'])){
                  if(argumentsView['int'] == meetingCounter){
                    reply(interaction, '', meetingView)
                  }
                }
              }
            }
            if(meetingCounter == 1 && Object.keys(argumentsView).length === 0 && argumentsView.constructor === Object){ // Second condition checks if object argumentsview is empty
              reply(interaction, '', meetingView)
            }else if(meetingCounter == 0){
              reply(interaction, '', meetingViewNone)
            }else if(argumentsView['int'] > meetingCounter || argumentsView['int'] <= 0){
              reply(interaction, '', meetingViewNone)
            }
            else if(meetingCounter > 1){
              reply(interaction, '', meetingViewMore)
            }
          }
        }
        
  }
  
})

const reply = async (interaction, content, embeds=[], components=[]) => {

  let data = await createAPIMessage(interaction, content, embeds, components)
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
  
  var Attachment = (message.attachments).array();
  if (message.attachments.size > 0) {
      message.channel.send('A copy of the file sent by ' + message.member.user.tag + ' is now sent to #files!')
      setTimeout(function(){message.channel.bulkDelete(1)}, 4000)
      console.log("New Attachment")
      // console.log(Attachment[0].url);
      // bot.channels.cache.get('696005900863012866').send('Attachment sent by ' + message.member.user.tag + ' in ' + "<#" + message.channel.id + '>   ' + Attachment[0].url);
      client.channels.cache.get('711249792151453697').send('Attachment sent by ' + message.member.user.tag + ' in ' + "<#" + message.channel.id + '>   ' + Attachment[0].url);
      
  }

})

client.on('clickMenu', async (menu) => {})


client.login(process.env.TOKEN)

