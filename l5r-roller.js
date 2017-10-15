var L5RRoll = L5RRoll || (function() {
    'use strict';

    var graphics = {
        skill : {
            B : 'https://i.imgur.com/4w3mLN9.jpg',
            ER : 'https://i.imgur.com/bW9UPO4.jpg',
            E : 'https://i.imgur.com/O2M7KL9.jpg',
            O : 'https://i.imgur.com/qOU9vc1.jpg',
            SO : 'https://i.imgur.com/uCNxk8a.jpg',
            S : 'https://i.imgur.com/oXft25o.jpg',
            SR : 'https://i.imgur.com/cBM9zwE.jpg'
        },
        ring : {
            B : 'https://i.imgur.com/ZvuGKYI.jpg',
            S : 'https://i.imgur.com/8irbdon.jpg',
            OR : 'https://i.imgur.com/mWmhk2F.jpg',
            SR : 'https://i.imgur.com/ppgxQJQ.jpg',
            ER : 'https://i.imgur.com/J5pxXQN.jpg',
            O : 'https://i.imgur.com/bUjhlxu.jpg'
        }
    }

    var setupImage = function(src) {
        return '<img src="' + src + '" width="30" height="30" alt="">';
    }

    // returns a random int between 1 and num
    var randomInteger = function(num) {
        var result = Math.floor(Math.random() * num) + 1;
        return result;
    }

    // takes number of dice as argument, returns array of results
    var rollSkillDice = function(count) {
        var finalResult = [];
        for(var i = 1;i <= count;i++) {
            var result = randomInteger(12);
            switch(result) {
                case 1:
                case 2:
                    // blank
                    result = graphics.skill.B;
                    break;
                case 3:
                case 4:
                    // success
                    result = graphics.skill.S;
                    break;
                case 5:
                case 6:
                case 7:
                    // opportunity
                    result = graphics.skill.O;
                    break;
                case 8:
                case 9:
                    // success + strife
                    result = graphics.skill.SR;
                    break;
                case 10:
                    // success + opportunity
                    result = graphics.skill.SO;
                    break;
                case 11:
                    // explosive + strife
                    result = graphics.skill.ER;
                    break;
                case 12:
                    // explosive
                    result = graphics.skill.E;
                    break;
            }
            finalResult.push(result);
        }    
        return finalResult;        
    };

    // takes number of dice as argument, returns array of results
    var rollRingDice = function(count) {
        var finalResult = [];
        for(var i = 1;i <= count;i++) {
            var result = randomInteger(6);
            switch(result) {
                case 1:
                    // blank
                    result = graphics.ring.B;
                    break;
                case 2:
                    // success
                    result = graphics.ring.S;
                    break;
                case 3:
                    // opportunity + strife
                    result = graphics.ring.OR;
                    break;
                case 4:
                    // opportunity
                    result = graphics.ring.O;
                    break;
                case 5:
                    // success + strife
                    result = graphics.ring.SR;
                    break;
                case 6:
                    // explosive + strife
                    result = graphics.ring.ER;
                    break;
            }
            finalResult.push(result);
        }
        return finalResult;        
    };

	var handleInput = function(msg) {
        var args;

		if (msg.type !== "api") {
			return;
        }
        
        var characterName = msg.who;

        args = msg.content.split(/\s+/);
        var result = {
            skill : [],
            ring : []
        };
        var count;
		switch(args[0]) {

            case '!l5r':
                for(var i = 1;i < args.length;i++) {
                    if(args[i].length == 2) {
                        if(args[i].indexOf('r') > -1) {       
                            count = args[i].replace('r','');
                            count = parseInt(count);
                            if(!isNaN(count)) {
                                result.ring = rollRingDice(count);
                            }                         
                        }
                        else if(args[i].indexOf('s') > -1) {
                            count = args[i].replace('s','');
                            count = parseInt(count);
                            if(!isNaN(count)) {
                                result.skill = rollSkillDice(count);
                            }
                        }
                    }
                }
                break;
        }
        var chatString = '<table style="width:100%;"><tr><th style="width:100%;background-color:red;padding:10px 0;color:white;text-align:center;">' + characterName + '</th></tr>';
        var stringPart = '';
        var ringFinal = '';
        var skillFinal = '';
        if(result.ring.length > 0) {            
            ringFinal = '<tr><td style="width:100%;padding:10px 0;text-align:center;"><b style="margin-right:2px;">Ring:</b> ';
            for(i = 0;i < result.ring.length;i++) {
                stringPart = setupImage(result.ring[i]);
                ringFinal = ringFinal + stringPart;
            }
            ringFinal = ringFinal + '</td></tr>';
        }
        if(result.skill.length > 0) {
            skillFinal = '<tr><td style="width:100%;padding:10px 0;text-align:center;"><b style="margin-right:2px;">Skill:</b> ';
            for(i = 0;i < result.skill.length;i++) {
                stringPart = setupImage(result.skill[i]);
                skillFinal = skillFinal + stringPart;
            }
            skillFinal = skillFinal + '</td></tr>';
        }
        chatString = chatString + ringFinal + skillFinal + '</table>';
        sendChat('', '/direct ' + chatString);
	},

	registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	return {
		RegisterEventHandlers: registerEventHandlers
	};
}());

on("ready",function(){
	'use strict';

	L5RRoll.RegisterEventHandlers();
});