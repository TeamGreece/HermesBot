const Discord = require('discord.js');
const bot = new Discord.Client();
const BotToken = require("./token.json")
const token = BotToken.token;
const embed = require('rich-embed');
const PREFIX = '!';


var version = "Version 0.3" // Update
var activeReminders = []; 
var reminder = [];

function set_time_out( id, code, time ) /// wrapper
{

    if( id in reminder )
    {
        clearTimeout( reminder[id] )
    }

    reminder[id] = setTimeout( code, time )
}

bot.on('ready', () =>{
    console.log('Im On');
})


bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");
    

    switch(args[0]){
        // Reminder Feature (Not Finished)
        case 'r':
            if(!message.member.roles.cache.some(r => r.name === "Reminder Manager")) return message.channel.send("You don't have permission to do that!")
            try {
                message.channel.bulkDelete(1);
            if(message.author.bot) return;
            // Variables
            let reminderTime = args[1];
            let timeType = reminderTime.replace(/[0-9]/g, '').toString();
            let originalMsg = message.content.toString();
            let originalMsgPhrase = originalMsg.replace('!r', '').replace(reminderTime, '').replace(" ", '').substring(1);
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
            }


            // Based off the delimiter, sets the time
            switch (timeType) {
                case 's':
                    originalMsgMiliseconds = originalMsgTime * 1000;
                    reminderTimeFormat = "seconds";
                    console.log("Yo i'm in here");
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
            
            
            //if(originalMsgTime == "") throw "empty";
            if(isNaN(originalMsgTime)) throw "not a number";
            if(originalMsgTime < 0)throw "ngtv number"
            
           
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
                //DONT FORGET TO ENABLE THIS vvvv
                /*message.channel.send("@everyone");
                setTimeout(function(){ message.channel.bulkDelete(1) }, 5000)*/
                
            }
            
            // Main Functionality
           
            //reminder = setTimeout(reminderFunction, originalMsgMiliseconds);

            set_time_out(originalMsgPhrase, reminderFunction, originalMsgMiliseconds);

            activeReminders.push(originalMsgPhrase);
            console.log(activeReminders);

            setTimeout(function removeDone() {

                var index = activeReminders.indexOf(originalMsgPhrase);
                if (index > -1) {    activeReminders.splice(index, 1);}
                if (!isNaN(activeReminders)) {
                    console.log("Removed a done reminder. There are no active reminders");
                    return activeReminders = [];
                }else{
                    console.log("Removed a done reminder. Active reminders: " +activeReminders); 
                }
                
            }, originalMsgMiliseconds);


            debugging();
            console.log(activeReminders.indexOf(originalMsgPhrase));

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
                const errorEMb = new Discord.MessageEmbed()
                .setColor('#ffcc00')
                .setTitle('There are no active reminders.')
                .setFooter('PoseidonBot / Remind')
                .setTimestamp()
            message.channel.send(errorEMb);
                return activeReminders = [];
            }else{
                const errorEMb = new Discord.MessageEmbed()
                .setColor('#ffcc00')
                .setTitle('Active Reminders are:')
                .setDescription(activeReminders)
                .setFooter('PoseidonBot / Remind')
                .setTimestamp()
            message.channel.send(errorEMb);
            }
            
            break;

        case'rdel':
            let originalMsg = message.content.toString();
            let originalMsgPhrase = originalMsg.replace('!delRem', '').replace(" ", '');
            console.log(originalMsgPhrase);
            //console.log(reminder.includes(originalMsgPhrase));
            console.log(reminder[originalMsgPhrase]);
            try {
                
                if (activeReminders.includes(originalMsgPhrase))
                 {  
                    console.log("yo im in the if");
                    const clearEmb = new Discord.MessageEmbed()
                    .setColor('#ffcc00')
                    .setTitle('Reminder ' + originalMsgPhrase + " cleared!")
                    .setFooter('PoseidonBot / Remind')
                    .setTimestamp()
                    message.channel.send(clearEmb);
                    function removeDone() {

                        var index = activeReminders.indexOf(originalMsgPhrase);
                        if (index > -1) {    activeReminders.splice(index, 1);}
                        if (!isNaN(activeReminders)) {
                            console.log("Removed a done reminder. There are no active reminders");
                            return activeReminders = [];
                        }else{
                            console.log("Removed a done reminder. Active reminders: " +activeReminders); 
                        }
                        
                    }
                    removeDone();
                    clearTimeout(reminder[originalMsgPhrase]);
                } else {throw 'item is not in the list'}
            } catch (error) {
                const errEMb = new Discord.MessageEmbed()
                    .setColor('#ffcc00')
                    .setTitle('Error')
                    .setFooter('PoseidonBot / Remind')
                    .setTimestamp()
                message.channel.send(errEMb);
             }
        case 'clear':
            if(!args[1]) return message.reply('Error, please define the number of messages you want to delete!')
            message.channel.bulkDelete(args[1]);
            break;
        
        case 'version':
            message.channel.bulkDelete(1);
            const patchnotes = new Discord.MessageEmbed()
                        .setColor('#D2691E')
                        .setTitle(version + '!')
                        .setDescription("I'm currently running in " + version)
                        .addFields(
                            { name: '!r', value:'Permitted people can use the !r command to set a reminder(Usage in !help)' },
                        )
                        .setTimestamp()
            message.channel.send(patchnotes);
            break;
        case 'help':
            message.channel.bulkDelete(1);
            const helpEmbed = new Discord.MessageEmbed()
                        .setColor('#FFFF00')
                        .setTitle('All commands listed below!')
                        .addFields(
                            { name: '\!help', value: 'Displays this message.'},
                            { name: '\!version', value: 'Displays my current version.'},
                            { name: '\!clear [number]', value: 'Clears a certain amount of messages.'},
                            { name: '\!r {time} {Name of event}) ', value: 'Sets a reminder.'},
                            { name: '\!rview', value: 'Shows all current reminders.'},
                            { name: '\!rdel [reminder]', value: 'Cancels and deletes the selected reminder.'},

                        )
            message.channel.send(helpEmbed);
    










        }
});




bot.login(token);