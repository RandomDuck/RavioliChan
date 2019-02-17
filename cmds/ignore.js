const err = require("./botSettings.json");
const ignore = require("../ignores.json");
const fs = require("fs");
module.exports.run = async (bot,message,args)=>{

    function errorMessage(e) {
       message.channel.send(bot.getmsg(err.responses.errmsg));
       console.log(`${err.errorMessage} ${e}`);
    }
    try{
        if(!ignore[message.guild.id]){ignore[message.guild.id]=[];fs.writeFileSync("./ignores.json", JSON.stringify(ignore,null,4));}
        if(message.member.hasPermission("MANAGE_MESSAGES",false,true,true) || message.member.roles.find("name", "elevatedBotControl")|| message.author.id == err.OwnerID ){
            if (args.length <= 0) {message.channel.send("No users specified, exiting programm."); return;}
            if (message.mentions.users.array().length <= 0) {message.channel.send("No users specified, exiting programm."); return;}
            let ignoring=""
            x=message.mentions.users.array()
            x.forEach(element => {
                if (element.id==err.OwnerID){
                    message.channel.send("I wont ignore master!");
                    return;
                }
                ignoring+=element.tag+" ";
                ignore[message.guild.id].push(element.id);
            });
            if (ignoring!="") {
            message.channel.send("ignoring: "+ignoring);
            fs.writeFileSync("./ignores.json", JSON.stringify(ignore,null,4));
            }
        }else{
            message.channel.send("Access denied.")
        }
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "ignore",
    help: "Make me ignore a user. (multiple users can be specified)"
}