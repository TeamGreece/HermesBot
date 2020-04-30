const Discord = require('discord.js');
const bot = new Discord.Client();
const BotToken = require("./token.json")
const token = BotToken.token;
const embed = require('rich-embed');
const PREFIX = '!';


var version = "Version 0.1" // Update


bot.on('ready', () =>{
    console.log('Im On');
})


bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");


    switch(args[0]){
        // Reminder Feature (Not Finished)
        case 'r':
            message.channel.bulkDelete(1);
            if(message.author.bot) return;
            // Variables 
            let reminderTime = args[1];
            let reminderVar = message.content.substring(3);
            let reminderVarLetters = reminderVar.replace(/[0-9]/g, '').substring(2);
            let reminderVarLettersBoolean = reminderVarLetters;
            let reminderVarTime = reminderTime.replace(/[a-z]/g, '');
            let reminderTimeFormat = 0;
            let reminderVarMiliseconds = 0;
            /* let reminderMins = reminderVar.includes("minutes");
            let reminderHours = reminderVar.includes("hours"); */
            
            /*if(reminderMins){
                reminderTimeNew = reminderVarTimeM;
                reminderTimeFormat = "minutes";
                reminderFinal = reminderVarLetters2M.substring(1);
                reminderTimeMilisecs = reminderTimeM;
            }else if(reminderHours){
                reminderTimeNew = reminderVarTimeH;
                reminderTimeFormat = "hours";
                reminderFinal = reminderVarLetters2H.substring(1);
                reminderTimeMilisecs = reminderTimeH;
            }*/

            // Based off the delimiter, sets the time
            switch (reminderVarLettersBoolean) {
                case 's':
                    reminderVarMiliseconds = reminderVarTime * 1000;
                    reminderTimeFormat = "seconds";
                    break;

                case 'm':
                    reminderVarMiliseconds = reminderVarTime * 1000 * 60;
                    reminderTimeFormat = "minutes";
                    break;

                case 'h':
                    reminderVarMiliseconds = reminderVarTime * 1000 * 60 * 60;
                    reminderTimeFormat = "hours";
                    break;

                case 'd':
                    reminderVarMiliseconds = reminderVarTime * 1000 * 60 * 60 * 24;
                    reminderTimeFormat = "days";
                    break;

                /*default:
                    reminderVarMiliseconds = reminderVarTime * 1000 * 60;
                    reminderTimeFormat = "minutes";
                    break;*/
            }
        
            
            // Error check - Ignore
            if(reminderTime < 0){
                message.channel.send('Unexpected error');
                return;
            }
            // First Embed
            const reminder1 = new Discord.MessageEmbed()
                    .setColor('#0297DB')
                    .setTitle('Reminder Set!')
                    .setDescription('A reminder **"' + reminderVarLetters + '"** has been set to go off in **' + reminderVarTime + " " + reminderTimeFormat + '!**')
                    .setFooter('Reminder set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .setTimestamp()
            message.channel.send(reminder1);
            // Notification Embed
            const notificationEmbed = new Discord.MessageEmbed()
                    .setColor('#0297DB')
                    .setTitle('Alert!')
                    .setDescription('The reminder with name **"' + reminderVarLetters + '"** is over!')
                    .setFooter('Reminder set by ' + message.member.user.tag, message.author.displayAvatarURL())
                    .setTimestamp()
            // Notification Function
            function reminderFunction(){
                message.channel.send(notificationEmbed);
                message.channel.send("@everyone");
                setTimeout(function(){ message.channel.bulkDelete(1) }, 5000)
            }
            // Main Functionality
            setTimeout(reminderFunction, reminderVarMiliseconds);
            break;

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
                            { name: '\!v', value: 'Displays my current version.'},
                            { name: '\!clear [number]', value: 'Clears a certain amount of messages.'},
                            { name: '\!r [reminder] [time in minutes]', value: 'Clears a certain amount of messages.'},
                        )
            message.channel.send(helpEmbed);
    










        }
});




bot.login(token);