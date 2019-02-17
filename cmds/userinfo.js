const Discord=require("discord.js");
const err = require("./botSettings.json");
module.exports.run = async (bot,message,args)=>{
    function errorMessage(e) {
        message.channel.send(bot.getmsg(err.responses.errmsg));
        console.log(`${err.errorMessage} ${e}`);
    }

    function Embed() {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription("Avatar URL = "+message.author.avatarURL)
            .setColor("#569D1C")
            .addField("Full Username:", `${message.author.username}#${message.author.discriminator}`)
            .addField("ID:", message.author.id)
            .addField("Created at:", message.author.createdAt);
        message.channel.send(embed);
    }

    function EmbedTarget(target) {
       
        let emmbed = new Discord.RichEmbed()
            .setAuthor(target.username)
            .setDescription("Avatar URL = "+target.avatarURL)
            .setColor("#569D1C")
            .addField("Full Username:", `${target.username}#${message.author.discriminator}`)
            .addField("ID:", target.id)
            .addField("Created at:", target.createdAt);

        message.channel.send(emmbed);
    }
    try{
        
        if (args.length <= 0) {Embed(); return;}
        if (message.mentions.users.array().length <= 0) {message.channel.send("No users specified, exiting programm."); return;}
        if (args.length <= 1) {EmbedTarget(message.mentions.users.first()); return;}
        if (args.length > 1) {
            
            for (let index = 0; index < message.mentions.users.array().length; index++) {
                EmbedTarget(message.mentions.users.array()[index]);
            }
            return;
        }
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "userinfo",
    help: "use: !userinfo <mention user>(default = command user)"
}