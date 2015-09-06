
var PlayerController = (function() {

    /******************************
     *
     *  PlayerController
     *
     *  @param {Oject}  palyerOption  various player option (name, color, etc...)
     *
     *  @return {Object}  PlayerController
     *
     ******************************/
    function PlayerController(Game, playerOption) {

        this.playerOption = playerOption;
        this.game = Game;
        this.speed = Game.PLAYER_SPEED;
        this.maxSpeed = Game.PLAYER_MAX_SPEED;
        this._playerTempPos = {
            x: 0,
            y: 0
        }
        
        this.playerAvatar;
        this.id = 0;

        this.initPlayer();

    }

    /******************************
     *
     *  initPlayer
     *
     *  @return {void}
     *
     ******************************/
    PlayerController.prototype.initPlayer = function() {

        if( undefined === this.playerOption.pseudo || this.playerOption.pseudo != '' ) {
            this.pseudo = this.playerOption.pseudo;
        } else this.pseudo = 'Player'+playerOption.id;

        this.id = this.playerOption.id;

    }


    /******************************
     *
     *  updatePlayerTempPos
     *
     *  @param {Oject}  playerData  an object with the direction and velocity informations
     *
     ******************************/
    PlayerController.prototype.updatePlayerTempPos = function( playerData ) {

        var direction = playerData.direction;
        var nowPos = this.playerAvatar.getPos();
        var scalar = direction.velocity * (this.speed/100);

        var newPos = {
            x: Math.cos( direction.radian ) * scalar,
            y: Math.sin( direction.radian ) * scalar
        };

        newPos.x += nowPos.x;
        newPos.y += nowPos.y;

        this._playerTempPos = newPos;

        this._playerTempPos.directionVector = {
            x: Math.cos( direction.radian ),
            y: Math.sin( direction.radian )
        }

    }

    /******************************
     *
     *  getPlayerTempPosition
     *
     *
     *  @return {Object}  x, y and direction( vector coordinate )
     *
     ******************************/
    PlayerController.prototype.getPlayerTempPosition = function() {

        return this._playerTempPos;

    }

    return PlayerController;

}(THREE));
