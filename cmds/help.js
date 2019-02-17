const err = require("./botSettings.json");
const Discord = require("discord.js");
module.exports.run = async (bot,message,args)=>{
    function errorMessage(e) {
        message.channel.send(bot.getmsg(err.responses.errmsg));
        console.log(`${err.errorMessage} ${e}`);
    }
    
    try{
        var output = new Discord.RichEmbed()
        output.setAuthor(bot.getmsg(err.responses.helpmsg),bot.user.avatarURL)
        output.setColor("#00ff2b");
        for (var i = 0; i < bot.commands.array().length; i++) {
        var f = bot.commands.array()[i];
        output.addField(err.prefix+f.help.name,f.help.help);
        }
        output.setFooter("Buy the dev some coffe:\nSwish: 0707814755\nwith the message \"Nice Bots\"",err.helpthumb);
        message.channel.send(output);
        
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "help",
    help: "Display this message."
}