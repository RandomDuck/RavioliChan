const Discord = require("discord.js")
const err = require("./botSettings.json");
module.exports.run = async (bot,message,args)=>{

    function errorMessage(e) {
       message.channel.send(bot.getmsg(err.responses.errmsg));
       console.log(`${err.errorMessage} ${e}`);
    }
    try{
        ravray=bot.raviolis.array();
        number = Math.floor(Math.random()*ravray.length);

        embed=new Discord.RichEmbed();
        embed.setColor('#aa0077')
            .setAuthor(bot.getmsg(err.responses.ravmsg), bot.user.avatarURL)
            .attachFile(ravray[number],true);
        message.channel.send(embed);
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "ravioli",
    help: "Post some ravioli."
}