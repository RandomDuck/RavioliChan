const err = require("./botSettings.json");
const Discord = require("discord.js")
module.exports.run = async (bot,message,args)=>{
    function errorMessage(e) {
        message.channel.send(bot.getmsg(err.responses.errmsg));
        console.log(`${err.errorMessage} ${e}`);
    }
    try{ 
        if(message.guild.member(message.author).nickname!=null){
            var nickname = " (\""+message.guild.member(message.author).nickname+"\")";
        }else{
            var nickname = " ";
        }
        if (args.length <= 0) {args.push("1d20")}
        //message.channel.send("arg test: " + args);
        var splitformodnegative = args[0].split("-");
        var splitformodpositive = args[0].split("+");
        if (splitformodnegative[1] != null) {
            var split ="-";
            var splitformod = args[0].split("-");
        } 
        else if (splitformodpositive[1] != null) {
            var split ="+";
            var splitformod = args[0].split("+");
        }
        else {
            var splitformod = args[0].split("+")
        }
        console.log(splitformod)
        
        var splitedargs = splitformod[0].split("d");
        //message.channel.send("splitedarg test: " + splitedargs);
        //message.channel.send("splitformod test: " + splitformod);
        var rollembed = new Discord.RichEmbed();
        if (isNaN(splitedargs[0])||isNaN(splitedargs[1])) {
            message.channel.send("Dices must be represented with numbers. Don't be stupid.");
            return;
        }
        if (splitedargs[0] < 1) {
            message.channel.send("You cannot roll 0 dices. What would be the point of that?");
            return;
        }
        if (splitedargs[1] < 2) {
            message.channel.send("You cant roll a dice with less than 2 sides.");
            return;
        }
        if (splitedargs[0] > 10) {
            message.channel.send("you cant use more than 10 dices att a time.");
            return;
        }
        if (isNaN(splitformod[1])&&splitformod[1]!=null) {
            message.channel.send("You must use a number as a modifire.");
            return;
            
        }
        rollembed.setAuthor(message.author.tag + nickname,message.author.avatarURL);
        rollembed.setColor("#3ABEFA");
        rollembed.setTimestamp(new Date());
        var rolled = "";
        var sum = 0;
        var modsum = 0;
        if (splitformod[1] ==  null){ 
            
            
            for (index = 0; index < splitedargs[0]; index++) {

                var roll = Math.floor(Math.random()*splitedargs[1] ) +1;
                rolled= rolled + "R"+(index+1)+": "+roll+"\n";
                sum += roll;

            }
            if (splitedargs[0]>1) {
                rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+":",rolled+"Sum: "+sum);
            }else{
                rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+":",rolled);
            }
            
            message.channel.send(rollembed);
        } else {
           if (split == "-"){
                for (index = 0; index < splitedargs[0]; index++) {

                        var roll = Math.floor(Math.random()*splitedargs[1] ) +1;
                        var rollwithmod = parseInt(roll)-parseInt(splitformod[1]);
                        rolled= rolled + "R"+(index+1)+":"+` ${roll} -${splitformod[1]} (${rollwithmod})\n`;
                        sum += roll;
                        
                        modsum += parseInt(splitformod[1]);
                
                    }
                    if (splitedargs[0]>1){
                        rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+" (-"+splitformod[1]+"):",rolled+"Sum: "+sum+" -"+modsum+" ("+(sum-modsum)+")");
                    }
                    else{
                        rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+" (-"+splitformod[1]+"):",rolled);
                    }
                    message.channel.send(rollembed);
                }
                
            }
            
           if (split == "+"){
             for (index = 0; index < splitedargs[0]; index++) {

                    var roll = Math.floor(Math.random()*splitedargs[1] ) +1;
                    var rollwithmod = parseInt(roll)+parseInt(splitformod[1]);
                    rolled= rolled + "R"+(index+1)+":"+` ${roll} +${splitformod[1]} (${rollwithmod})\n`;
                    sum += roll;
                    
                    modsum += parseInt(splitformod[1]);
              
                }
                if (splitedargs[0]>1){
                    rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+" (+"+splitformod[1]+"):",rolled+"Sum: "+sum+" +"+modsum+" ("+(sum+modsum)+")");
                }
                else{
                    rollembed.addField("Rolled "+splitedargs[0]+"d"+splitedargs[1]+" (+"+splitformod[1]+"):",rolled);
                }
                message.channel.send(rollembed);
            }
        
    }
    catch (e){
       errorMessage(e);
    }
}
module.exports.help = {
    name: "r",
    help: "use: !r <num-o-dice>d<dice-type>(<modifier>)\n example: !r 1d20+3"
}