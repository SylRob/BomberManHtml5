
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
    function PlayerController(gameOption, playerOption) {

        this._playerOption = playerOption;
        this._playerTempPos = {
            x: 0,
            y: 0
        }

        this.playerAvatar;
        this.id = 0;
        this._speed = gameOption.PLAYER_SPEED;
        this._maxSpeed = gameOption.PLAYER_MAX_SPEED;
        this._maxBomb = gameOption.PLAYER_MAX_BOMB;

        this._bomb = 1;
        this._actionButton = false;

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

        if( undefined !== this._playerOption.pseudo && this._playerOption.pseudo != '' ) {
            this.pseudo = this._playerOption.pseudo;
        } else this.pseudo = 'Player'+this._playerOption.id;

        this.id = this._playerOption.id;

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
        var scalar = direction.velocity * (this._speed/100);

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

        this._actionButton = playerData.ab;

    }

    /******************************
     *
     *  getPlayerOption
     *
     *
     *  @return {Object}
     *
     ******************************/
    PlayerController.prototype.getPlayerOption = function() {

        return this._playerOption;

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

    /******************************
     *
     *  getMaxBomb
     *
     *  @return {int}
     *
     ******************************/
    PlayerController.prototype.getMaxBomb = function() {

        return this._maxBomb;

    }

    /******************************
     *
     *  setBomb
     *
     *  @param {int}  numberBomb
     *
     ******************************/
    PlayerController.prototype.setBomb = function( numberBomb ) {

        if( isNaN(numberBomb) ) {
            throw new Error(' set Speed must be a number ');
            return false;
        }

        if( numberBomb > this._maxBomb ) this._bomb = this._maxBomb;
        this._bomb = numberBomb;

    }

    /******************************
     *
     *  getSpeed
     *
     *  @return {int}
     *
     ******************************/
    PlayerController.prototype.getSpeed = function() {

        return this._speed;

    }

    /******************************
     *
     *  setSpeed
     *
     *  @param {int}  speed
     *
     ******************************/
    PlayerController.prototype.setSpeed = function( speed ) {

        if( isNaN(speed) ) {
            throw new Error(' set Speed must be a number ');
            return false;
        }

        if( speed > this._maxSpeed ) this._speed = this._maxSpeed;
        else this._speed = speed;

    }

    /******************************
     *
     *  actionBtnHandeler
     *
     ******************************/
    PlayerController.prototype.actionBtnHandeler = function() {



    }

    return PlayerController;

}(THREE));
