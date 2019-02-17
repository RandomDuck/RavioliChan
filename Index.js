const botSettings = require("./cmds/botSettings.json");
const Discord = require("discord.js")
const bot = new Discord.Client({disableEveryone: true});
const prefix = botSettings.prefix;
const fs = require("fs");
const music = require("./music.json")
const ytdl = require("ytdl-core")
require(botSettings.logpath+"logs.js");
const ignore = require("./ignores.json");
bot.commands = new Discord.Collection();
bot.polls = require("./polls.json");
bot.vote = require("./votes.json");
bot.lewds = new Discord.Collection();
bot.mutes = require("./mutes");
bot.reminds = require("./reminds");
const util = require('util');
var log_file = fs.createWriteStream(__dirname + '/logs/debug.log', {flags : 'a'});
var log_stdout = process.stdout;
bot.getmsg=function(array){return array[Math.floor(Math.random()*array.length)];}
let sing = function(guildname,channelname,todl){
    const streamOptions = { seek: 0, volume: 1 };
    bot.guilds.find(guild => guild.name === guildname)
    .channels.find(channel => channel.name === channelname)
    .join().then(m=function(connection) {
        const stream = ytdl(todl[Math.floor(Math.random()*todl.length)], { filter : 'audioonly' });
        const dispatcher = connection.playStream(stream, streamOptions);
        dispatcher.on("end", end => {
            m(connection)
        });
    }).catch(er => console.log(er));
}
let checkmutes = function(){

}

let checkreminds = function(){

}

let listen = function (messageArray,mentUsers,message){
    mesfile = message.attachments
    mesembs = message.embeds
    filetext=""
    embtext=""
    if (mesfile!=null){
        
        mesfile.forEach(element => {
            filetext+=`<div style="border:black solid 2px;"><br><span style="padding:3px;color:orange;">File: ${element.filename}: 
            <br><a style="color:blue;" href="${element.url}"><img onerror="this.src='http://icons.iconarchive.com/icons/wilnichols/alumin-folders/512/Downloads-Black-Folder-icon.png'" src="${element.url}"></a></span></div>`
        });
    }
    if (mesembs!=null){
        mesembs.forEach(element => {
            x=""
            element.fields.forEach(element=>{x+= `<div style="border:black solid 2px;"><br><span style="padding:3px;color:red;">Name: ${element.name}<br>Value: ${element.value}</span></div>`});
            embtext+=`<div style="border:black solid 2px;"><br><span style="padding:3px;color:orange;">
            <br>author:${element.author.name}
            <br>title:${element.title}
            <br>colr:${element.hexColor}
            <br>fields: ${x}
            <br>Img: <a href="${element.image.url}"><img src="${element.image.url}"></a>
            <br>footer:${element.footer.text}
            <br><a style="color:blue;" href="${element.url}">Url: ${element.url}</a></span></div>`
        });
    }
    var outputArgs = "";
    messageArray.forEach(element => {
        var sliced=false;
        if (mentUsers.length>0){
                if(element.includes("<@!")) {
                    sliced=true;
                    var test=element.slice(3)
                                .split(">");
                }
                else if (element.includes("<@")) {
                    var test=element.slice(2)
                                .split(">");
                    sliced=true;
                }
                if(sliced){
                    for (let index = 0; index < mentUsers.length; index++) {
                        // checks if the object is a user
                            if (test[0]==mentUsers[index].id){
                                // converts user.tag and user nickname to stirngs.
                                
                                    outputArgs = outputArgs + mentUsers[index].tag + " ("+mentUsers[index].id+")"+test[1]+" ";
                                    return;
                                
                                }
                            }
                        }   
                    }    
            outputArgs = outputArgs + element+" ";
        });
    var log_chat = fs.createWriteStream(__dirname + `/logs/${message.guild.name}_log.html`, {flags : 'a'});
    tosave=`<div style="background: #333;padding: 5px;color: white;"><br><span style="color:orchid">${new Date()}</span>:<br>\n in <span style="color:skyblue">${message.channel.name}:</span><span style="color:lightgreen"> (${message.author.id}) ${message.author.tag}:</span><br>\nsaid:<span style="color:orange;"> <br>${outputArgs}</span>\n `
    tosave+=embtext+filetext+"</div>"
    log_chat.write(util.format(tosave) + '\n');
    if (logjson[message.guild.name]==undefined){
        logjson[message.guild.name]=tosave
    } else{
        logjson[message.guild.name]+=tosave
    }
    fs.writeFileSync(botSettings.logpath+"logs.js","logjson="+JSON.stringify(logjson,null,4))
}


fs.readdir("./ravioli/", (err, files) => {
    if (err) console.error(err);

    if (files.length <= 0) {
        console.log("error: no lewds to load"); 
        return;
    }
    console.log(`loading ${files.length} lewds`);
    files.forEach((f,i)=>{
        let lewds = `${__dirname}/lewds/${f}`;
        bot.lewds.set(i+1, lewds)
    });
});

fs.readdir("./cmds/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() == "js");
    if (jsFiles.length <= 0) {
        console.log("error: no commands to load"); 
        return;
    }
    console.log(`loading ${jsFiles.length} commands`);
    jsFiles.forEach((f,i)=>{
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}: ${f} loaded!`)
        bot.commands.set(props.help.name, props)
    });
});


bot.on("ready", ()=>{
    log_file.write(util.format(`${new Date()}: Started Bot.`) + '\n');
    console.log("In servers:")
    for (let index = 0; index < bot.guilds.array().length; index++) {
        console.log(bot.guilds.array()[index].name);
    }
    bot.user.setActivity("with dice!");
    console.log = function(d) { //
            log_file.write(util.format(`${new Date()}: ${d}`) + '\n');
            botSettings.lastlog = d;
            log_stdout.write(util.format(d) + '\n');
        };
    //sing("Original's basment of shitty memes and Chinese cartoons","Ravioli-chan's christmas carols",music.xmas)
//         let Ownerembed = new Discord.RichEmbed()
//             .addField("Bot intiated", bot.readyAt)
//             .setAuthor(bot.user.username,bot.user.avatarURL)
//             .setColor("#569D1C")
//             .addField("Full Username:", `${bot.user.username}#${bot.user.discriminator}`)
//             .addField("ID:", bot.user.id)
//             .addField("Created at:", bot.user.createdAt)
//             .setFooter(bot.user.avatarURL);
//         bot.fetchUser(botSettings.OwnerID)
//             .then(user => {user.send(Ownerembed);user.send(dedemmbed);});
//     console.log(bot.user.username+" is ready for action.");
})



bot.on("message", async message => {
    
    let messageArray = message.content.split(" ");
    var mentUsers = message.mentions.users.array();
    let args = messageArray.slice(1);
    let command = messageArray[0].toLowerCase();
    if (message.channel.type === "dm") {
        if(message.author.id==botSettings.OwnerID){
            if (command=="!cmd"){
                let cmd = bot.commands.get(command.slice(prefix.length));
                if (cmd) cmd.run(bot,message,args);
            }
        } else if (!message.author.bot){
            message.channel.send("I dont take commands in DM chat");
        } 
        return;
    } else {listen(messageArray,mentUsers,message);}

    //if (!message.guild.roles.find("name", "elevatedBotControl")) message.guild.createRole(["elevatedBotControl","#DDDDDD",false],"created to alow owner to give users full bot control");
    if (message.author.bot) return;
    if (message == prefix+"ping") {message.channel.send("Pong!"); return;}
    let access=true;
    if (!message.content.startsWith(prefix)) return;
    if (ignore[message.guild.id]==undefined){ignore[message.guild.id]=[]}
    ignore[message.guild.id].forEach(element=>{
        if (message.author.id == element) {
            message.channel.send(bot.getmsg(botSettings.responses.deniedmsg))
            access=false;
            return;
        }
    });
    if(!access) return;
    if (command=="!listresponses"){
        if(message.author.id == "287255202673983502" || message.author.id == botSettings.OwnerID){
            message.channel.send("```json\n"+JSON.stringify(botSettings.responses,null,4)+"```");
        } else {message.channel.send(bot.getmsg(botSettings.responses.deniedmsg));}
    }
    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) {cmd.run(bot,message,args);}else{message.channel.send(bot.getmsg(botSettings.responses.errmsg))}
   
})
bot.login(botSettings.token);

////////////////////////////Module Template///////////////////////////////////
// const err = require("./botSettings.json");
// module.exports.run = async (bot,message,args)=>{
//
//     function errorMessage(e) {
//        message.channel.send(`${message.author}, ${bot.getmsg(err.responses.errmsg)}`);
//        console.log(`${err.errorMessage} ${e}`);
//     }
//      //insert code here
//     try{
//
//     }
//     catch (e){
//         errorMessage(e);
//     }
// }
// module.exports.help = {
//     name: "nameOfCommand",
//     help: "insert help text here"
// }
//////////////////////////////////////////////////////////////////////////////

////////////////////////////STANDARD PERMISIONS CHECK/////////////////////////
// if(message.member.hasPermission("MANAGE_MESSAGES",false,true,true) || message.member.roles.find("name", "elevatedBotControl")|| message.author.id == err.OwnerID ){
// //has permisions
// }else{
// //has no permisions
// }
// break;
////////////////////////////////////////////////////////////////////////////