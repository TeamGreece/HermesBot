const Discord = require('discord.js');
const bot = new Discord.Client();
const BotToken = require("./token.json")
const token = BotToken.token;
const embed = require('rich-embed');
const PREFIX = '!';


var version = "Version 0.1" // Update
var servers = {};

bot.on('ready', () =>{
    console.log('Im On');
})

function bulk() {
    message.channel.bulkDelete(3)
}

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");


    switch(args[0]){
        // Reminder Feature (Not Finished)
        /*case 'r':
            message.channel.bulkDelete(1);
            if(message.author.bot) return;
            if(!message.member.roles.cache.some(r => r.name === "Reminder Manager")) {
                message.channel.send("You don't have permission to do that!")
                message.channel.bulkDelete(1)
                return;
            }
            if(!args[1]) {
                message.reply('```Error! | Usage: !r [word] [minutes]```')
                return;
            }
            if(!args[2]) {
                message.reply('```Error! | Usage: !r [word] [minutes]```')
                return;
            }
            
            let reminderWord = args[1];
            let reminderTime = args[2];
            let reminderTimeSeconds = (reminderTime * 1000);
            let reminderTimeM = (reminderTimeSeconds * 60);
            let reminderTimeMM = (reminderTimeM / 60000)
            let reminderTimeHour = (reminderTimeMM / 60)
            function reminder() {
                message.channel.send('@everyone');
                clearInterval(reminderTest)
            }
            const reminderConfirmation = new Discord.MessageEmbed()
                        .setColor('#D2691E')
                        .setTitle('Reminder Set!')
                        .setDescription('A **reminder** with theme **"' + reminderWord + '"** has been **scheduled** to alert @everyone in **' + reminderTime + ' minute(s)!**(' + reminderTimeHour.toFixed(2) + ' hours)')
                        .setTimestamp()
            message.channel.send(reminderConfirmation);
            var reminderTest = setInterval(reminder, reminderTimeM);
            const reminderAlert = new Discord.MessageEmbed()
                        .setColor('#D2691E')
                        .setTitle('Reminder Alert!')
                        .setDescription('Everyone, the reminder with theme **"' + reminderWord + '"** is over!')
                        .setTimestamp()
            message.channel.send(reminderTest);
            message.channel.send(reminderAlert);
            break;*/

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