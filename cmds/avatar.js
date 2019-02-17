const err = require("./botSettings.json");
const Discord = require("discord.js");
module.exports.run = async (bot,message,args)=>{
    function errorMessage(e) {
        message.channel.send(bot.getmsg(err.responses.errmsg));
        console.log(`${err.errorMessage} ${e}`);
    }
    function makeEmbed(user){
        var output = new Discord.RichEmbed()
        output.setAuthor(bot.getmsg(err.responses.avatarmsg),bot.user.avatarURL)
        output.setColor("#0000ff")
        output.setImage(user.avatarURL)
        output.setFooter("Avatar of: "+user.tag+" requested by "+message.author.tag,message.author.avatarURL)
        message.channel.send(output);
    }
    try{
        if (message.mentions.users.array().length>=1){
            makeEmbed(message.mentions.users.first())
        } else {
            makeEmbed(message.author)
        }
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "avatar",
    help: "Display your profile picture and link to it."
}