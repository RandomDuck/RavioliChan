
const err = require("./botSettings.json");
const discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot,message,args)=>{
    function errorMessage(e) {
        message.channel.send(bot.getmsg(err.responses.errmsg));
        console.log(`${err.errorMessage} ${e}`);
    }
    // print current poll state to polls.json file
    function updatepoll(id){
        bot.polls["Server"+serverid]["poll"+(id)] = {
            pollstarter: bot.polls["Server"+serverid]["poll"+(id)].pollstarter,
            polledQuestion: bot.polls["Server"+serverid]["poll"+(id)].polledQuestion,
            pollid: id,
            votedfor:bot.polls["Server"+serverid]["poll"+(id)].votedfor,
            votedagainst:bot.polls["Server"+serverid]["poll"+(id)].votedagainst
         }
        fs.writeFileSync("./polls.json", JSON.stringify(bot.polls,null,4));
    }
    try{
        if(message.guild.member(message.author).nickname!=null){
            var nickname = "(\""+message.guild.member(message.author).nickname+"\")";
        }else{
            var nickname = " ";
        }
        // makes sure Poll isnt called with  no value
        if (args.length <= 0) {args.push("list");}
        // initial global values.
        var outputArgs = "";
        var mentUsers = message.mentions.users.array();
        var serverid = message.guild.id;
        // makes sure that ID is defined as something. (basicaly initialises new servers)
        if (bot.polls["Server"+serverid] == undefined) bot.polls["Server"+serverid]= { lastid:0} 
        var id = bot.polls["Server"+serverid].lastid;
        // For loop to make Mentions display as Tags and the sentance to be ready to parse.
        args.forEach(element => {
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
                                    
                                    if(message.guild.member(mentUsers[index]).nickname!=null){
                                        outputArgs = outputArgs + " " + mentUsers[index].tag + " (\""+message.guild.member(mentUsers[index]).nickname+"\")"+test[1];
                                        return;
                                    }else{
                                        outputArgs = outputArgs + " " + mentUsers[index].tag+test[1];
                                        return;
                                    }
                                }
                            }   
                        }
                    }
                
                
            outputArgs = outputArgs + " " + element;
            
     });

        var SpecifiedID;
            // switch statement for what to execute
            switch(args[0].toLowerCase()){
                // vote for poll id (latest poll if id not specified)
                case "agree":
                case "yes":
                case "yay":
                case "aye":
                    votemess="You have voted for."
                    if (args.length <= 1) {
                        SpecifiedID = id;
                    } else {
                        SpecifiedID = args[1];
                    }
                    if (SpecifiedID == 0){message.channel.send("No polls located.\nNothing to vote for."); break;}
                    // check if user has voted yay on this allready.
                    if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor[message.author.id]==message.author.id){
                        message.channel.send(`Sorry, ${message.author} but you can only vote once.`); 
                        break;
                    }
                    // check if the voter has voted nay before
                    if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst[message.author.id]==message.author.id){
                        bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst.length-=1;
                        bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst[message.author.id]=null;
                        votemess="You have changed your voted, you have voted for."
                    }
                    bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor.length+=1;
                    bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor[message.author.id]= message.author.id;
                    message.reply(votemess);
                    updatepoll(SpecifiedID);
                    break;
                // vote against poll id (latest poll if id not specified)
                case "disagree":
                case "no":
                case "nay":
                    votemess="You have voted against."
                    if (args.length <= 1) {
                        SpecifiedID = id;
                    } else {
                        SpecifiedID = args[1];
                    }
                    if (SpecifiedID == 0){message.channel.send("No polls located.\nNothing to vote againts."); break;}
                    // check if user has voted nay on this allready.
                    if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst[message.author.id]==message.author.id){
                        message.channel.send(`Sorry, ${message.author} but you can only vote once.`); 
                        break;
                    }
                    // check if the voter has voted yay before
                    if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor[message.author.id]==message.author.id){
                        bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor[message.author.id]=null;
                        bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor.length-=1;
                        votemess="You have changed your voted, you have voted against."
                    }
                    bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst.length+=1;
                    bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst[message.author.id]= message.author.id;
                    message.reply(votemess);
                    updatepoll(SpecifiedID);
                    break;
                // display status of poll id (last poll if id not specified)
                case "stats":
                case "status":
                    if (id == 0){message.channel.send("No polls in database.\nNo stats available"); break;}
                    if (args.length <= 1) {
                        SpecifiedID = id;
                    } else {
                        SpecifiedID = args[1];
                    }
                    // detect wich party is winning or if its a tie.
                    var WiningVote;
                    if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst.length>bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor.length) { 
                        WiningVote="Those Against are winning.";
                    } else if (bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst.length<bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor.length) { 
                        WiningVote="Those For are winning.";
                    } else {
                        WiningVote="It's a tie!";
                    }
                    // embed data
                    let pollembed = new discord.RichEmbed()
                        .setAuthor("Poll started by:")
                        .setDescription(bot.polls["Server"+serverid]["poll"+SpecifiedID].pollstarter)
                        .setColor("#ffd700")
                        .addField("Question posed: ", bot.polls["Server"+serverid]["poll"+SpecifiedID].polledQuestion )
                        .addField("ID:",bot.polls["Server"+serverid]["poll"+SpecifiedID].pollid )
                        .addField("Votes:",`For: ${bot.polls["Server"+serverid]["poll"+SpecifiedID].votedfor.length} vs Against: ${bot.polls["Server"+serverid]["poll"+SpecifiedID].votedagainst.length}`)
                        .addField("Status:",WiningVote);
                    // send the embed
                    message.channel.send(pollembed);
                        
                    break;
                 // resets poll in server
                case "reset":
                    //check user role
                    if (id == 0){message.channel.send("No polls in database.\nNothing to reset."); break;}
                    if(message.member.hasPermission("MANAGE_MESSAGES",false,true,true) || message.member.roles.find("name", "elevatedBotControl")|| message.author.id == err.OwnerID ){
                        // deletes all poll data on server
                        
                        
                        for(let f in bot.polls["Server"+serverid]){
                            
                                delete bot.polls["Server"+serverid][f];
                            
                        }
                        // clear the server in the json
                        bot.polls["Server"+serverid].lastid=0
                        var pollReset = fs.createWriteStream('./polls.json', {
                        flags:'w'
                        })
                        pollReset.write('');
                        pollReset.end();
                        // write default info to server
                        fs.writeFileSync("./polls.json", JSON.stringify(bot.polls,null,4));
                        
                        message.channel.send(message.author+", poll logs have been reset");
                    } else {
                        message.channel.send(message.author+", you do not have permissions to do that");
                    }
                    break;

                case "list": // sends a dm of all polls in server
                    if ( bot.polls["Server"+serverid].lastid==0){message.channel.send("No polls to list. Exiting command."); break;}
                    let polls="";
                    let listembed = new discord.RichEmbed()
                                .setColor("#ff0000")
                                .setAuthor("Heres a list of the current polls")
                                .setDescription(`Polls in server:\n ${message.guild.name}\nActive polls: ${bot.polls["Server"+serverid].lastid}\n`);
                    for(var f in bot.polls["Server"+serverid]){
                        if (f=="lastid") continue;
                        result = `<For: ${bot.polls["Server"+serverid][f].votedfor.length}> <Against: ${bot.polls["Server"+serverid][f].votedagainst.length}>\n<The_leading_vote_is: `
                        if(bot.polls["Server"+serverid][f].votedfor.length >bot.polls["Server"+serverid][f].votedagainst.length){
                            result += "For>"
                        } else if(bot.polls["Server"+serverid][f].votedfor.length >bot.polls["Server"+serverid][f].votedagainst.length){
                            result += "Against>"
                        } else {
                            result += "Tied>"
                        }
                        if (bot.polls["Server"+serverid][f].pollstarter.endsWith(" ")){
                            pollauth=bot.polls["Server"+serverid][f].pollstarter.split(" ")[0]
                        } else {
                            pollauth=bot.polls["Server"+serverid][f].pollstarter
                        }
                        polls="```html\n";
                        polls+=`<Question_Posed:\n${bot.polls["Server"+serverid][f].polledQuestion.substring(1)}> \n\n<Id: ${bot.polls["Server"+serverid][f].pollid}>\n<Author: ${pollauth}>\n`+result;
                        polls+="```";
                        listembed.addField(`Poll number ${bot.polls["Server"+serverid][f].pollid}`,polls);
                        
                    }
                    message.author.send(listembed);
                    message.channel.send("I sent a list of polls to you.")
                    break;


                default:
                    // default poll layout implementation
                    bot.polls.totalPolls +=1 ;
                    bot.polls["Server"+serverid].lastid = id+1;
                    bot.polls["Server"+serverid]["poll"+(id+1)] =  {
                        pollstarter: message.author.tag +" "+ nickname,
                        polledQuestion: outputArgs,
                        pollid: id+1,
                        votedfor:{length:0},
                        votedagainst:{length:0}
                     }
                    // the questiont to be polled int ourtputArgs should be "is poot a bitch?" sadly not evryone asks this question...
                    fs.writeFileSync("./polls.json", JSON.stringify(bot.polls,null,4));
                    let embpoll = new discord.RichEmbed()
                            .setColor("#ffd700")
                            .setAuthor("Poll started by:",bot.user.avatarURL)
                            .setDescription(message.author.tag+" "+nickname)
                            .addField("Question asked:\n",outputArgs)
                            .addField("Poll ID:", id+1)
                            .addField("To respond use:", "!poll yay <id>\nOr\n!poll nay <id>");
                    message.channel.send(embpoll);
                    break;
            }//end switch
    }
    catch (e){
        errorMessage(e);
    }
}
module.exports.help = {
    name: "poll",
    help: "use: !poll <arg>/<topic>"
}