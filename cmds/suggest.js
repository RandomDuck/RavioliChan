const err = require("./botSettings.json");
const fs = require("fs");
module.exports.run = async (bot,message,args)=>{

    function errorMessage(e) {
       message.channel.send(bot.getmsg(err.responses.errmsg));
       console.log(`${err.errorMessage} ${e}`);
    }
    try{

        bot.fetchUser(err.OwnerID)
                .then(user => {user.send("A suggestion has been made by:\n"+ message.author.tag+" \nIn:\n"+message.channel.guild.name+", "+message.channel.name+"\nAtt:\n"+new Date())});
        message.channel.send("We will take this into consideration.\nThank you for taking part in the development.");
        var mestostore = `{Sugestion starts}\n${new Date()}:\n${message.author.tag} sugested:\n${args}\n{Sugestion ends}\n\n`;
        fs.createWriteStream("./logs/sugestions.log", {flags : 'a'},).write(mestostore);
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "suggest",
    help: "suggest a feature for the bot."
}