const Discord = require('discord.js');
const bot = new Discord.Client();
const BotToken = require("./token.json")
const token = BotToken.token;
const embed = require('rich-embed');
const PREFIX = '!';


var version = "Version 0.4" // Update
var activeReminders = []; 
var reminder = [];
var activeMeetings = [];
var totalAnswers = [];
let peopleYes = [];
let peopleMaybe = [];
let peopleNo = [];
let peopleAll = [];




function set_time_out( id, code, time ) 
{
    if( id in reminder )
    {
        clearTimeout( reminder[id] )
    }
    reminder[id] = setTimeout( code, time )
}
const patchnotes = new Discord.MessageEmbed()
                        .setColor('#291127')
                        .setTitle(version + '!')
                        .setDescription("I'm currently running in " + version)
                        .setFooter( "For more info on the versions visit our Github https://github.com/TeamGreece/PoseidonBot/tree/master")
                        .setTimestamp()

bot.on('ready', () =>{
    console.log('Im On');
   // bot.channels.cache.get("706144360353235049").send("Im On")
    bot.user.setActivity('Team Greece!', { type: 'WATCHING' })
    bot.channels.cache.get("706456626143428628").send(patchnotes)
    
})


bot.on('message', message => {
    if(message.author.bot) return;
    let args = message.content.substring(PREFIX.length).split(" ");
    if(message.author.bot) return;

    switch(args[0]){
        // Reminder Feature (Officially finished)
        case 'rset':
            try {
                message.channel.bulkDelete(1);
            if(message.author.bot) return;
            // Variables
            let reminderTime = args[1];
            let timeType = reminderTime.replace(/[0-9]/g, '').toString();
            let originalMsg = message.content.toString();
            let originalMsgPhrase = originalMsg.replace('!rset', '').replace(reminderTime, '').replace(" ", '').substring(1);
            let originalMsgTime = reminderTime.replace(/[a-z]/g, '');
            let reminderTimeFormat = 0;
            let originalMsgMiliseconds = 0;
            

            function debugging() {
                console.log("\n");
                console.log("originalMsg : " + originalMsg);
                console.log("remiderTime : " + reminderTime);
                console.log("originalMsgPhrase : " + originalMsgPhrase);
                console.log("originalMsgTime : " + originalMsgTime);
                console.log("timeType : " + timeType);
                console.log("A reminder has been set: " + originalMsgPhrase + ", alarms in " + originalMsgTime +" " + reminderTimeFormat);
                console.log("Active reminders are : " + activeReminders);
                console.log("\n");
               // bot.channels.cache.get("706144360353235049").send("originalMsg : " + originalMsg)
               // bot.channels.cache.get("706144360353235049").send("remiderTime : " + reminderTime)
               // bot.channels.cache.get("706144360353235049").send("originalMsgPhrase : " + originalMsgPhrase)
               // bot.channels.cache.get("706144360353235049").send("originalMsgTime : " + originalMsgTime)
               // bot.channels.cache.get("706144360353235049").send("timeType : " + timeType)
               // bot.channels.cache.get("706144360353235049").send("A reminder has been set: " + originalMsgPhrase + ", alarms in " + originalMsgTime +" " + reminderTimeFormat)
               // bot.channels.cache.get("706144360353235049").send("Active reminders are : " + activeReminders)
            }


            // Based off the delimiter, sets the time
            switch (timeType) {
                case 's':
                    originalMsgMiliseconds = originalMsgTime * 1000;
                    reminderTimeFormat = "seconds";
                    // console.log("Yo i'm in here");
                    break;

                case 'm':
                    originalMsgMiliseconds = originalMsgTime * 1000 * 60;
                    reminderTimeFormat = "minutes";
                    break;

                case 'h':
                    originalMsgMiliseconds = originalMsgTime * 1000 * 60 * 60;
                    reminderTimeFormat = "hours";
                    break;

                case 'd':
                    originalMsgMiliseconds = originalMsgTime * 1000 * 60 * 60 * 24;
                    reminderTimeFormat = "days";
                    break;

                default:
                    originalMsgMiliseconds = originalMsgTime * 1000 * 60;
                    reminderTimeFormat = "minutes";
                    break;

            }
            
           
            // First Embed
            const reminder1 = new Discord.MessageEmbed()
                    .setColor('#0297DB')
                    .setTitle('Reminder Set!')
                    .setDescription('A reminder **"' + originalMsgPhrase + '"** has been set to go off in **' + originalMsgTime + " " + reminderTimeFormat + '!**')
                    .setFooter('Reminder set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .setTimestamp()
            message.channel.send(reminder1);
            
            // Notification Embed
            const notificationEmbed = new Discord.MessageEmbed()
                    .setColor('#0297DB')
                    .setTitle('Alert!')
                    .setDescription('The reminder with name **"' + originalMsgPhrase + '"** is over!')
                    .setFooter('Reminder set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .setTimestamp()
            
            // Notification Function
            function reminderFunction(){
                message.channel.send(notificationEmbed);
                message.channel.send("@everyone");
                setTimeout(function(){ message.channel.bulkDelete(1) }, 5000)
                
            }
            
            // Main Functionality
            set_time_out(originalMsgPhrase, reminderFunction, originalMsgMiliseconds);

            activeReminders.push(originalMsgPhrase);
            console.log(activeReminders);
           // bot.channels.cache.get("706144360353235049").send(activeReminders)

            setTimeout(function removeDone() {

                var index = activeReminders.indexOf(originalMsgPhrase);
                if (index > -1) {    activeReminders.splice(index, 1);}
                if (!isNaN(activeReminders)) {
                    console.log("Removed a done reminder. There are no active reminders");
                   // bot.channels.cache.get("706144360353235049").send("Removed a done reminder. There are no active reminders")
                    return activeReminders = [];
                }else{
                    console.log("Removed a done reminder. Active reminders: " +activeReminders); 
                   // bot.channels.cache.get("706144360353235049").send("Removed a done reminder. Active reminders: " +activeReminders)
                }
                
            }, originalMsgMiliseconds);


            debugging();
            console.log(activeReminders.indexOf(originalMsgPhrase));
           // bot.channels.cache.get("706144360353235049").send(originalMsgPhrase)

            
            if(isNaN(originalMsgTime)) {
                console.log("not a num")
               // bot.channels.cache.get("706144360353235049").send("not a num")

                throw "not a number"}
            if(originalMsgTime < 0){
                console.log("ngtv number")
               // bot.channels.cache.get("706144360353235049").send("ngtv number")
                throw "ngtv number"}
            
            break;

            } catch (error) {
                const errorEMb = new Discord.MessageEmbed()
                .setColor('#DC143C')
                .setTitle('Error!')
                .setDescription('Make sure you typed that correctly (!r {time} {Name of event})')
                .setFooter(':/')
                .setTimestamp()
            message.channel.send(errorEMb);
            }
            break;

        case 'rview':
            if (!isNaN(activeReminders)) {
                const noactiveEmb = new Discord.MessageEmbed()
                .setColor('#42f5ce')
                .setTitle('There are no active reminders.')
                .setFooter('PoseidonBot / Remind')
                .setTimestamp()
            message.channel.send(noactiveEmb);
                return activeReminders = [];
            }else{
                const viewEMb = new Discord.MessageEmbed()
                .setColor('#42f5ce')
                .setTitle('Active Reminders are:')
                .setDescription(activeReminders)
                .setFooter('PoseidonBot / Remind')
                .setTimestamp()
            message.channel.send(viewEMb);
            }
            
            break;

            case'rdel':
            let originalMsg = message.content.toString();
            let originalMsgPhrase = originalMsg.replace('!rdel', '').replace(" ", '');
            console.log(originalMsgPhrase);
            console.log(reminder[originalMsgPhrase]);
           // bot.channels.cache.get("706144360353235049").send(console.log(originalMsgPhrase))
           // bot.channels.cache.get("706144360353235049").send(reminder[originalMsgPhrase])
            try {
                
                if (activeReminders.includes(originalMsgPhrase))
                 {  
                    const clearEmb = new Discord.MessageEmbed()
                    .setColor('#8442f5')
                    .setTitle('Reminder ' + originalMsgPhrase + " cleared!")
                    .setFooter('PoseidonBot / Reminder Feature')
                    .setTimestamp()
                    message.channel.send(clearEmb);
                    function removeDone() {

                        var index = activeReminders.indexOf(originalMsgPhrase);
                        if (index > -1) {    activeReminders.splice(index, 1);}
                        if (!isNaN(activeReminders)) {
                            console.log("Removed a done reminder. There are no active reminders");
                           // bot.channels.cache.get("706144360353235049").send("Removed a done reminder. There are no active reminders")
                            return activeReminders = [];
                        }else{
                            console.log("Removed a done reminder. Active reminders: " + activeReminders); 
                           // bot.channels.cache.get("706144360353235049").send("Removed a done reminder. Active reminders: " + activeReminders)
                        }
                        
                    }
                    removeDone();
                    clearTimeout(reminder[originalMsgPhrase]);
                } else {throw 'item is not in the list'}
                
            } catch (error) {
                const rdelErrorEmbed = new Discord.MessageEmbed()
                    .setColor('#8442f5')
                    .setTitle('Error')
                    .setFooter('PoseidonBot / Reminder Feature')
                    .setTimestamp()
                message.channel.send(rdelErrorEmbed);
                
            }    
            break;   
        
        case 'help':
            message.channel.bulkDelete(1);
            const helpEmbed = new Discord.MessageEmbed()
                        .setColor('#291127')
                        .setTitle('All commands listed below!')
                        .addFields(
                            { name: '\!help', value: 'Displays this message.'},
                            { name: '\!version', value: 'Displays my current version.'},
                            { name: '\!rset {time} {Name of event}) ', value: 'Sets a reminder.'},
                            { name: '\!rview', value: 'Shows all current reminders.'},
                            { name: '\!rdel [reminder]', value: 'Cancels and deletes the selected reminder.'},
                            { name: '\!announce {Your message}', value: 'Admins can write a message and I will notify everyone!'},
                            { name: '\!say {Your message}', value: 'Anyone can write their message and I will say it!'},
                            { name: '\!meeting {Day} {Time} {Title}', value: 'Admins can set up general meetings. Should be used in the <#706152226543894578> channel.'},
                            { name: '\!meetingV', value: 'Admins can view whoever has responded to the meeting request.'},
                            { name: '\!poll {title}', value: 'Used to create polls. After using, you will be asked to insert values one by one. These will be what users will be able to vote on.'},
                        )
            message.channel.send(helpEmbed);
            break;
        case 'version':
            message.channel.bulkDelete(1);
            message.channel.send(patchnotes);
            break;
    
        case 'github':
            message.channel.send("For more info on the versions visit our Github https://github.com/TeamGreece/PoseidonBot/tree/master");
            break;
        case 'say':
            message.channel.bulkDelete(1);
            let sayMessage = message.content.toString();
            let sayMessageUnprefixed = sayMessage.replace('!say', '').substring(1);
            message.channel.send(sayMessageUnprefixed);
            break;
        case 'announce':
            if(!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send("You don't have permission to do that!")
            message.channel.bulkDelete(1);
            let announceMessage = message.content.toString();
            let announceMessageUnprefixed = announceMessage.replace('!announce', '').substring(1);
            message.channel.send('@everyone, ' + announceMessageUnprefixed);
            break;
        case 'meeting':
            if(!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send("You don't have permission to do that!")
            try {
            message.react('📅');
            let meetingMessage = message.content.toString();
            let meetingTime = args[2];
            let initialMeetingDate = args[1];
            let meetingDate = initialMeetingDate.toLowerCase();
            console.log(meetingDate);
           // bot.channels.cache.get("706144360353235049").send("meetingDate")
            let meetingTheme = meetingMessage.replace('!meeting', '').replace(initialMeetingDate, '').replace(meetingTime, '').replace(" ", '').substring(2);
            let meetingAuthor = message.member.user.tag;
            const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            var dayConfirmation;            
            // Embeds
            const meetingYes = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle('Yes :white_check_mark:!')
                    .setDescription('You have reacted with **"Yes!"**')
            const meetingMaybe = new Discord.MessageEmbed()
                    .setColor('#DC143C')
                    .setTitle('Maybe :woman_shrugging:!')
                    .setDescription('You have reacted with **"Maybe!"**')
            const meetingNo = new Discord.MessageEmbed()
                    .setColor('#D95417')
                    .setTitle('No :x:!')
                    .setDescription('You have reacted with **"No"!**')
            const meetingAlreadyAssigned = new Discord.MessageEmbed()
                    .setColor('#DC143C')
                    .setTitle('Error!')
                    .setDescription("You can't do that again!")
            function meetingDebugging() {
                console.log("\n");
                console.log("meetingMessage : " + meetingMessage);
                console.log("meetingTime : " + meetingTime);
                console.log("meetingTheme : " + meetingTheme);
                console.log("meetingDate : " + meetingDate);
                console.log("A meeting has been set: " + meetingTheme + ", alarms on " + meetingDate + " at " + meetingTime);
                console.log("Author : " + meetingAuthor);
                console.log("\n");
               // bot.channels.cache.get("706144360353235049").send("meetingMessage : " + meetingMessagee)
               // bot.channels.cache.get("706144360353235049").send("meetingTime : " + meetingTime)
               // bot.channels.cache.get("706144360353235049").send("meetingTheme : " + meetingTheme)
               // bot.channels.cache.get("706144360353235049").send("meetingDate : " + meetingDate)
               // bot.channels.cache.get("706144360353235049").send("A meeting has been set: " + meetingTheme + ", alarms on " + meetingDate + " at " + meetingTime)
               // bot.channels.cache.get("706144360353235049").send("Author : " + meetingAuthor)

            }
            if(allDays.includes(meetingDate, 0)){
                dayConfirmation = true;
            }else{
                dayConfirmation = false;
            }

            if(dayConfirmation){
                console.log('Day Approved');
               // bot.channels.cache.get("706144360353235049").send('Day Approved')
            }
            else{
                console.log('Day not approved')
               // bot.channels.cache.get("706144360353235049").send('Day not approved')
                throw "Day not approved"
            }
        
            // First Meeting Embed
            const meetingEmbed1 = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle('Meeting Set!')
                    .setDescription('The **meeting** has been set correctly! I will now notify **everyone**! Meeting Name: **"' + meetingTheme + '"!**')
                    .setFooter('Meeting set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .setTimestamp()
            message.channel.send(meetingEmbed1);
            meetingDebugging();


            // Notification-DM embed
            const notificationEmbedMeeting = new Discord.MessageEmbed()
                    .setColor('#92000A')
                    .setTitle('Alert! Meeting Set!')
                    .setDescription('**' + meetingAuthor + ' **has arranged a general meeting with theme **"' + meetingTheme + '"**.')
                    .setAuthor('Meeting set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .addFields(
                        {name: 'Meeting Day', value:  meetingDate.charAt(0).toUpperCase() + meetingDate.substring(1) + " 📅"},
                        {name: 'Meeting Time', value: meetingTime},
                    )
                    .setFooter('Write "Yes", "Maybe" or "No" to show availability')
                    .setTimestamp()
            message.channel.send(notificationEmbedMeeting);
            const collector = new Discord.MessageCollector(message.channel, m => m.channel.id === message.channel.id);
            collector.on('collect', message => {
                if(message.content.toLowerCase() == "yes") {
                    if(!peopleAll.includes('<@' + message.member.id + '>')){
                        console.log(peopleAll)
                       // bot.channels.cache.get("706144360353235049").send(peopleAll)
                        console.log('they said yes');
                        let yesPerson = '<@' + message.member.id + '>';
                        peopleYes.push(yesPerson);
                        console.log(peopleYes);
                       // bot.channels.cache.get("706144360353235049").send(peopleYes)
                        message.channel.send(meetingYes)
                        peopleAll = peopleYes.concat(peopleMaybe, peopleNo);
                    }else{
                        setTimeout(function(){ message.channel.bulkDelete(2) }, 5000)
                        message.channel.send(meetingAlreadyAssigned);
                        console.log(peopleAll);
                       // bot.channels.cache.get("706144360353235049").send(peopleAll)
                        return;
                    }
                }else if (message.content.toLowerCase() == "maybe") {
                    if(!peopleAll.includes('<@' + message.member.id + '>')){
                        console.log(peopleAll)
                       // bot.channels.cache.get("706144360353235049").send(peopleAll)
                        console.log('they said maybe');
                        let maybePerson = '<@' + message.member.id + '>';
                        peopleMaybe.push(maybePerson);
                        console.log(peopleMaybe);
                       // bot.channels.cache.get("706144360353235049").send(peopleMaybe)
                        message.channel.send(meetingMaybe)
                        peopleAll = peopleMaybe.concat(peopleYes, peopleNo);
                    }else{
                        setTimeout(function(){ message.channel.bulkDelete(2) }, 5000)
                        message.channel.send(meetingAlreadyAssigned);
                        console.log(peopleAll);
                       // bot.channels.cache.get("706144360353235049").send(peo)
                        return;
                    }
                }else if (message.content.toLowerCase() == "no") {
                    if(!peopleAll.includes('<@' + message.member.id + '>')){
                        console.log(peopleAll)
                       // bot.channels.cache.get("706144360353235049").send(peopleAll)
                        console.log('they said no');
                        let noPerson = '<@' + message.member.id + '>';
                        peopleNo.push(noPerson);
                        console.log(peopleNo);
                       // bot.channels.cache.get("706144360353235049").send(peopleNo)
                        message.channel.send(meetingNo)
                        peopleAll = peopleNo.concat(peopleMaybe, peopleYes);
                    }else{
                        setTimeout(function(){ message.channel.bulkDelete(2) }, 5000)
                        message.channel.send(meetingAlreadyAssigned);
                        console.log(peopleAll);
                       // bot.channels.cache.get("706144360353235049").send(peopleAll)
                        return;
                    }
                }
            });
                

        
        } catch (error) {
            const meetingErrorEmbed = new Discord.MessageEmbed()
            .setColor('#DC143C')
            .setTitle('Error!')
            .setDescription('Make sure you typed that correctly (!meeting {day} {time} {Name of meeting})')
            .setFooter(':/')
            .setTimestamp()
        message.channel.send(meetingErrorEmbed);
        setTimeout(function(){ message.channel.bulkDelete(1) }, 5000)
        }

        break;
        case 'meetingV':
            if(!message.member.roles.cache.some(r => r.name === "Admin")) {
                setTimeout(function(){ message.channel.bulkDelete(2) }, 5000)
                return message.channel.send("You don't have permission to do that!");
            }
            // Embeds
            const YesEmb = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle('Reacted with :white_check_mark:!')
                    .setDescription(peopleYes.toString())
                    .setFooter('PoseidonBot / Smart Meeting Feature')
                    .setTimestamp()
            const MaybeEmb = new Discord.MessageEmbed()
                    .setColor('#DC143C')
                    .setTitle('Reacted with :woman_shrugging:!')
                    .setDescription(peopleMaybe.toString())
                    .setFooter('PoseidonBot / Smart Meeting Feature')
                    .setTimestamp()
            const NoEmb = new Discord.MessageEmbed()
                    .setColor('#D95417')
                    .setTitle('Reacted with :x:!')
                    .setDescription(peopleNo.toString())
                    .setFooter('PoseidonBot / Smart Meeting Feature')
                    .setTimestamp()
            
            if (!isNaN(peopleYes) && !isNaN(peopleMaybe) && !isNaN(peopleNo)) {
                const noactiveEmb = new Discord.MessageEmbed()
                .setColor('#42f5ce')
                .setTitle('No one has reacted :frowning:')
                .setFooter('PoseidonBot / Smart Meeting Feature')
                .setTimestamp()
            message.channel.send(noactiveEmb);
                return peopleYes = [];
            }
            if(isNaN(peopleYes)) message.channel.send(YesEmb)
            if(isNaN(peopleMaybe)) message.channel.send(MaybeEmb)
            if(isNaN(peopleNo)) message.channel.send(NoEmb)
        break;

        case 'poll' :
            let pollTitle = message.content.toString().replace("!poll", '').substring(1);
            let options = [];
            let showOptions = [];
            //let length = options.length
            let emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
            let emojiCount = options.length
            let cancelPoll = true;

            console.log(pollTitle)
            const pollObject = new Discord.MessageCollector(message.channel, m => m.channel.id === message.channel.id);
            //console.log(length)
            console.log(emojiCount)
            
            const pollEmb = new Discord.MessageEmbed()
                .setColor('#32908F')
                .setTitle('Poll with title "' + pollTitle + '" has been initialized')
                .setDescription('To add elements to the poll, simply type one at a time below')
                .setFooter('PoseidonBot / Poll Feature')
                .setTimestamp()
            message.channel.send(pollEmb)
            
            
            pollObject.on('collect', message => {
                if(!message.author.bot){
                    if (!message.content.toString() == ''){
                        if (cancelPoll){
                            if(message.content.toString().toLowerCase() == 'cancel'){
                                cancelPoll = false;
                                message.channel.send('Poll has been canceled syccessfully')
                                return;
                            }
                            if(message.content.toString().toLowerCase() == "end") {
                                cancelPoll = false;
                                message.channel.send('Poll has been made successfully')
                                console.log('Poll Operation Failed Successfully') // ?
                               
                                for (x=0;x < options.length; x++) {
                                    showOptions.push(emojis[x] + " " + options[x])
                                    console.log(showOptions[x])
                                }
                                const pollEmb = new Discord.MessageEmbed()
                                    .setColor('#32908F')
                                    .setTitle('Poll "' + pollTitle + '"')
                                    .setDescription(showOptions)
                                    .setFooter('PoseidonBot / Poll Feature')
                                    .setAuthor('Poll started by ' + message.member.user.tag, message.author.displayAvatarURL())
                                    .setTimestamp()
                                message.channel.send(pollEmb).then(embedMessage => {
                                    for (t=0;t < showOptions.length; t++) {
                                        embedMessage.react(emojis[t])
                                    }
                                });
                    
                                
                                return;
                                
                            }
                        
                        else{
                                console.log('hola ich bin here')
                                console.log(message.content.toString())
                                let option = message.content.toString()
                                options.push(option)
                                message.channel.send('Element has been added successfully. If you rather add more elements, go on or if you wish to end type "end"')
                                console.log(options)
                                console.log(showOptions)
                        }
                        }
                    }
                }
                
            });
            
            //message.react('5️⃣')

            // for (var x of options.length) {
            //     message.react(":five:")
            // }
               
        break;

        }
});

bot.login(token);