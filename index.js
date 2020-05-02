const Discord = require('discord.js');
const bot = new Discord.Client();
const BotToken = require("./token.json")
const token = BotToken.token;
const embed = require('rich-embed');
const PREFIX = '!';


var version = "Version 0.2" // Update
var activeReminders = []; 
var reminder = [];
var activeMeetings = [];

function set_time_out( id, code, time ) // wrapper - gamato
{

    if( id in reminder )
    {
        clearTimeout( reminder[id] )
    }

    reminder[id] = setTimeout( code, time )

}
bot.on('ready', () =>{
    console.log('Im On');
    bot.user.setActivity('Team Greece!', { type: 'WATCHING' })
    
})


bot.on('message', message => {

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

            
            if(isNaN(originalMsgTime)) {
                console.log("not a num")
                throw "not a number"}
            if(originalMsgTime < 0){
                console.log("ngtv number")
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
            //console.log(reminder.includes(originalMsgPhrase));
            console.log(reminder[originalMsgPhrase]);
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
                            return activeReminders = [];
                        }else{
                            console.log("Removed a done reminder. Active reminders: " +activeReminders); 
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
                break;
            }       
        
        case 'version':
            message.channel.bulkDelete(1);
            const patchnotes = new Discord.MessageEmbed()
                        .setColor('#D2691E')
                        .setTitle(version + '!')
                        .setDescription("I'm currently running in " + version)
                        .setFooter( "For more info on the versions visit our Github https://github.com/TeamGreece/PoseidonBot/tree/master")
                        .setTimestamp()
            message.channel.send(patchnotes);
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
                            { name: '\!github', value: 'More about this project'},

                        )
            message.channel.send(helpEmbed);
            break;
        case 'github':
            message.channel.send("For more info on the versions visit our Github https://github.com/TeamGreece/PoseidonBot/tree/master");
        break;
    }
});


bot.login(token);