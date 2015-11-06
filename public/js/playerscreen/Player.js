

var Player = (function() {

    function Player(pseudo) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.pseudo = pseudo;
        this.myScore = 0;

        this.avatarList = {
            'blue' : {
                primaryColor    : '#4C55FF',
                secondaryColor  : '#90FFBF',
                imgUrl:'/img/ufoBlue.png'
            },
            'red' : {
                primaryColor    : '#E86C08',
                secondaryColor  : '#FF3204',
                imgUrl:'/img/ufoRed.png'
            },
            'green' : {
                primaryColor    : '#40FFCC',
                secondaryColor  : '#3AE860',
                imgUrl:'/img/ufoGreen.png'
            },
            'yellow' : {
                primaryColor    : '#E8C900',
                secondaryColor  : '#FFFA00',
                imgUrl:'/img/ufoYellow.png'
            },
            'pink' : {
                primaryColor    : '#E84396',
                secondaryColor  : '#DA56FF',
                imgUrl:'/img/ufoPink.png'
            },
            'orange' : {
                primaryColor    : '#E8775B',
                secondaryColor  : '#FFB371',
                imgUrl:'/img/ufoOrange.png'
            }
        }

        this.interval = null;

        this.avatar = {};

    }

    /**
     *  myAvatar
     *
     *  set player color/image setting
     *
     *  @param {Object}  option  player color choice
     *
     *  @return {void}
     *
     */
    Player.prototype.myAvatar = function( option ) {
        this.avatar = this.avatarList[option];

    }

    Player.prototype.initGamePad = function(elem) {
    }


    Player.prototype.whatIsMyDirection = function(passingObj) {

        passingObj.playerId = this.id;

    }

    /**
     *  wrapResults
     *
     *  wrap results
     *
     *  @param {Object}  gamePadData  object that contain the button datas
     *
     *  @return {Object} all the data that we want to pass to the server
     *
     */
    Player.prototype.wrapResults = function( gamePadData ) {
        return {
            'id' : this.id,
            'data'  : gamePadData
        }
    }


    Player.prototype.iAmDead = function() {

        clearInterval(this.interval);
        var playerTime = $('#messageArea').text();
        $('.playerScore').text(playerTime);

        socket.emit('hereIsMyScore', this.pseudo, this.myScore);

    }

    Player.prototype.iNeedABeer = function() {

        clearInterval(this.interval);
        var playerTime = $('#messageArea').text();
        $('.playerScore').text(playerTime);

        $('#freeBeer').show();

    }

    Player.prototype.endOfTheGame = function(ranking) {
        var _this = this;

        var rankingList = '<ol>';

        for( palyerPseudo in ranking ) {

            var timeScore = addZero(ranking[palyerPseudo]);
            timeScore = formatTime(timeScore);

            rankingList += '<li id="'+palyerPseudo+'"'+( palyerPseudo == _this.pseudo ? ' class="itsMe"' : '' )+'><span>'+palyerPseudo+'</span><span>'+timeScore+'</span></li>';
        }

        rankingList += '</ol>';

        $('#ranking').html(rankingList);
        $('#tryAgain').show();

        $('#ranking').animate({
            scrollTop : 0
        }, 0, function() {

            $('#ranking').animate({
                scrollTop : $('.itsMe').position().top
            }, 1000, 'swing');

        });


        // function to get the format 000510 (0min 5secondes and 10tenth) from 510
        function addZero (str) {
            str = str.toString();
            return str.length < 6 ? addZero("0" + str) : str;
        }

        //take a number and put the letter ":" every 2 letter
        function formatTime(s) {
            var i = 2;
            var a = new Array();
            do {
                a.push(s.substring(0, i));
            } while((s = s.substring(i, s.length)) != "");
            return a.join(':');
        }

    }

    Player.prototype.countingTo = function(until, callback) {
        var _this = this;

        until = until*1000;
        var elem = $('#messageArea'), i, accumulateTime;

        if(this.interval) clearInterval(this.interval);

        i=0;
        accumulateTime = 0;
        var timer = setInterval(function() {

            elem.attr('style', 'color : '+_this.avatar.secondaryColor).html(( i-(until/1000) )*-1);
            i++;

            if( until <= accumulateTime ) {
                clearInterval( timer );
                setTimeout(function(){elem.html('')}, 1000);
                callback();
            }

            accumulateTime += 1000;
        }, 1000);

    }

    return Player;

}());
