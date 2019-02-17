const err = require("./botSettings.json");
const fs = require("fs");
module.exports.run = async (bot,message,args)=>{

    function errorMessage(e) {
       message.channel.send(bot.getmsg(err.responses.errmsg));
       console.log(`${err.errorMessage} ${e}`);
    }
    try{
        bot.fetchUser(err.OwnerID)
                .then(user => {user.send("A report has been made by:\n"+ message.author.tag+" \nIn:\n"+message.channel.guild.name+", "+message.channel.name+"\nAtt:\n"+new Date())});
        message.channel.send("We will work to fix this as soon as possible.\nThank you for reporting the error.");
        var mestostore = `{report starts}\n${new Date()}:\n${message.author.tag} reported:\n${args}\n[Log]\n${err.lastlog}\n[Log Ends]\n{report ends}\n\n`;
        fs.createWriteStream("./logs/reports.log", {flags : 'a'},).write(mestostore);
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "report",
    help: "Report a bug of the bot."
}