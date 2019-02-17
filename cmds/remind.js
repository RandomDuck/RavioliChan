const err = require("./botSettings.json");
const fs = require("fs");
module.exports.run = async (bot,message,args)=>{

    let modifier={
        "s":1000,
        "m":60000,
        "h":3600000
    }
    function errorMessage(e) {
       message.channel.send(`\`\`\`${e}\`\`\` ${bot.getmsg(err.responses.errmsg)}`);
       console.log(`${err.errorMessage} ${e}`);
    }
    function getTimeStamp() {
        
        return {
            "stamp":args[0].charAt(args[0].length-1),
            "time":args[0].slice(0,args[0].length-1)
        }
    }

    try{
        let timeData=getTimeStamp()
        if(timeData.stamp=="s" && timeData.time<5){message.channel.reply("Minimum reminder time is 5s");return;}
        bot.reminds[message.guid.id][message.author.id]={
            "duration":timeData.time*modifier[time.stamp],
            "message":messageArray.slice(1),
            "tag":message.author.tag,
            "id":message.author.id
        }
        fs.writeFileSync("./reminds.json", JSON.stringify(bot.reminds,null,4));
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "remind",
    help: "Usage: !remind <time(m/h/s)> <message>\nExample: !remind 5m message me in 5 mins"
}