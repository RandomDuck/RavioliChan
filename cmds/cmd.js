const err = require("./botSettings.json");
const Discord = require("discord.js")
const fs = require("fs")
const ytdl = require("ytdl-core")
const music = require("../music.json")
let vars={}
module.exports.run = async (bot,message,args)=>{

    function errorMessage(e) {
       message.channel.send(`${message.author},\nERROR:\n\`\`\`css\n${e}\n\`\`\` ${bot.getmsg(err.responses.errmsg)}`);
       console.log(`${err.errorMessage} ${e}`);
    }
    playmusic = function(todl){
        if (!Array.isArray(todl)){
            todl=[todl];
        }
        if(todl.length<=0 || todl == undefined){
            return;
        }
        const streamOptions = { seek: 0, volume: 1 };
        message.member.voiceChannel.join().then(m=function(connection) {
                    const stream = ytdl(todl[Math.floor(Math.random()*todl.length)], { filter : 'audioonly' });
                    const dispatcher = connection.playStream(stream, streamOptions);
                    dispatcher.on("end", end => {
                        m(connection)
                    });
                }).catch(er => console.log(er));
    }
    getMessages = function(channel,ammount){
        channel.fetchMessages({limit:ammount}).then(messages=>{message.channel.send(messages.array().map(x=>x="\n----------------\n"+x+"\n---------------\n").toString())})
    }
    execCmd = function(cmd,channel=message.channel){
        message.channel=channel
        bot.commands.get(cmd).run(bot,message,args)
    }
    purge = function(ammount){
        message.channel.fetchMessages({limit:ammount}).then(messages=>{messages.filter(m => m.delete())})
    }
    listChan = function(){
        indextrack=0
        towrite=""
        guildchannels=[]
        guilds=bot.guilds.array()
        guilds.forEach(element=>{
                indextrackc=0
                towritec={}
                channels=element.channels.array()
                channels.forEach(element=>{
                towritec[indextrackc]={}
                towritec[indextrackc]["Channel"] = element.name
                indextrackc++
            });
            guildchannels.push(channels)
            towrite+="index: "+indextrack+"\nServer: "+element.name+"\nChannels:\n"+JSON.stringify(towritec,null,4)+"\n\n"
            indextrack++
    
        });
        message.channel.send("```JSON\n"+towrite+"\n{\"channels inside\":\"guildchannels\"}```")
    }
    try{
        if (message.author.id!=err.OwnerID) {
            message.channel.send(bot.getmsg(err.responses.masteronlymsg));
            return;
        }
        command=""
        args.forEach(element=>{
            command+=element+" ";
        });
        eval(command)
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "cmd",
    help: "Useable only by my maker."
}