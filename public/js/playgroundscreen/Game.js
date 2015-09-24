

var Game = (function() {

    /******************************
     *
     *  PlayerController
     *
     *  @param {HTMLElement}  elem  game container
     *
     *  @return {Object}  Game
     *
     ******************************/
    function Game(elem) {

        //Contstants
        this.PLAYER_SPEED = 10;
        this.PLAYER_MAX_SPEED = 20;
        this.BOMB_POWER = 2;
        this.BOMB_MAX_POWER = 12;
        this.MIN_PLAYER = 1;

        this.elem = elem;

        this.gameScript;
        this.plan;

        this.playerList = [];
        this.interval = [];
        this.gameStarted = false;

        this.init();

    }

    /******************************
     *
     *  init
     *
     *  warn the players
     *
     ******************************/
    Game.prototype.init = function() {
        var _this = this;

        if(
            !isCanvasSupported()
        ) {
            this.notSupported();
            return false;
        }

        socket.emit('thePlayGroundHasArrive');
        this.plan = new Plan( this.elem, this );

        this.initEvent();
        this.gameScript = new GameScript(this);

    }

    /******************************
     *
     *  initEvent
     *
     *  init the event
     *
     ******************************/
    Game.prototype.initEvent = function() {
        var _this = this;
    }


    /******************************
     *
     *  start
     *
     *  init the players avatar
     *
     ******************************/
    Game.prototype.start = function() {
        var _this = this;

        for ( playerId in this.playerList ) {

            this.plan.initPlayers();

        }

        this.gameStarted = true;

    }


    /******************************
     *
     *  didIKillSomeone
     *
     *  check if a player touch
     *  an element
     *
     ******************************/
    Game.prototype.didIKillSomeone = function(elem) {
        var _this = this;



    }

    /******************************
     *
     *  youNeedABeer
     *
     *  gice a free beer to the player
     *
     ******************************/
    Game.prototype.youNeedABeer = function(playerId) {

        socket.emit('youNeedABeer', playerId);

    }

    /******************************
     *
     *  youAreDead
     *
     *  a player lost
     *
     ******************************/
    Game.prototype.youAreDead = function(playerId) {
        socket.emit('youAreDead', playerId);
        delete this.playerList[playerId];
    }


    /******************************
     *
     *  addNewPlayer
     *
     *  is called every "newPlayer" event take a Player object as parameter and compare the
     *  id to the other player if new ID then add the player to the playerList array
     *
     *  @param {Object}  Player
     *
     ******************************/
    Game.prototype.addNewPlayer = function( Player ) {

        if( typeof(Player) != 'object' || Player.id == '' ) {
            throw new Error('a problem happpend with this player');
            return false;
        }

        var iid = Player.id;

        if(this.playerList.length > 1) {
            for(otherPlayer in this.playerList) {
                if(otherPlayer.id == Player.id) {
                    throw new Error('double ID');
                    return false;
                }
            }
        }

        var gameOption = {
            PLAYER_SPEED: this.PLAYER_SPEED,
            PLAYER_MAX_SPEED: this.PLAYER_MAX_SPEED,
            PLAYER_MAX_BOMB: this.PLAYER_MAX_BOMB,
            BOMB_POWER: this.BOMB_POWER,
            BOMB_MAX_POWER: this.BOMB_MAX_POWER
        }

        this.playerList[iid] = new PlayerController( gameOption, Player );

        if( !this.gameStarted ) { this.start(); }
        else this.plan.addPlayer( this.playerList[iid] )

    }

    /******************************
     *
     *  updatePlayerData
     *
     *  update the player position
     *
     *  @param {Object} playerPos got new position of the player and his id
     *
     ******************************/
    Game.prototype.updatePlayerData = function( playerPos ) {

        var myPlayer = this.playerList[playerPos.id];
        if( undefined === myPlayer ) {
            delete this.playerList[playerPos.id];
            return false;
        }

        myPlayer.updatePlayerTempPos( playerPos.data );

        this.plan.updatePlayerPos( myPlayer );
    }


    /******************************
     *
     *  getPlayerList
     *
     *  check if there is the minimum number of players
     *
     *  @return {Array}
     *
     ******************************/
    Game.prototype.getPlayerList = function() {
        return this.playerList;
    }

    /******************************
     *
     *  getaPlayerById
     *
     *  @param {string}  id  id of the player
     *
     *  @return {PlayerController}
     *
     ******************************/
    Game.prototype.getaPlayerById = function( id ) {

        if( !this.playerList[ id ] ) return false;

        return this.playerList[ id ];
    }

    /******************************
     *
     *  enoughPlayer
     *
     *  check if there is the minimum number of players
     *
     *  @return {boolean} yes or no
     *
     ******************************/
    Game.prototype.enoughPlayer = function() {
        return Object.keys(this.playerList).length >= this.MIN_PLAYER;
    }

    /******************************
     *
     *  removePlayer
     *  is called every "playerLeft" event take a id string
     *  look for the ID in the player list and remove it from the playerList
     *
     *  @param {integer} id of the player
     *
     ******************************/

    Game.prototype.removePlayer = function( id ) {
        var _this = this;

        if(id == null) return false;


        if(undefined == id || id == '' || Object.keys(this.playerList).length < 1) {
            /*throw new Error('no player found');
            return false;*/
        } else {
            for(var i = 0 ; i < Object.keys(this.playerList).length ; i++) {

                if(_this.playerList[id]) {
                    _this.plan.removePlayer( _this.playerList[id].playerAvatar );
                    delete _this.playerList[id];
                    return false;
                }
            }
        }

    }

    /******************************
     *
     *  notSupported
     *
     *  if canvas or a mandatory game's feature is not supported,
     *  add a visual element that inform the user that the gamepad will not work correctly
     *
     ******************************/

    Game.prototype.notSupported = function() {
        var elem = document.createElement('div');
        elem.style.position = 'fixed';
        elem.style.top = '0px';
        elem.style.left = '0px';
        elem.style.background = 'red';
        elem.style.color = '#FFFFFF';
        elem.style.padding = '3%';
        elem.style.width = '94%'

        elem.innerHTML = 'This device does NOT support the mandatory features to make the Game work correctly';
        document.getElementsByTagName('body')[0].appendChild(elem);
    }

    return Game;

}(THREE));
