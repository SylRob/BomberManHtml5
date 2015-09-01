
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

        this.plan = Game.plan;
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
     *  initPlayerAvatar
     *
     *  @return {void}
     *
     ******************************/
    PlayerController.prototype.initPlayerAvatar = function() {

        this.playerAvatar = new PlayerAvatar( this.playerOption );
        this.game.plan.initPlayer( this.playerAvatar.initAvatar() );

    }

    /******************************
     *
     *  updatePlayerPos
     *
     *  @param {Oject}  playerData  an object with the direction and velocity informations
     *
     *  @return {Object.PlayerController}  the updated player instance
     *
     ******************************/
    PlayerController.prototype.updatePlayerPos = function( playerData ) {

        var direction = playerData.direction;
        var nowPos = this.playerAvatar.getPos();
        var scalar = direction.velocity * (this.speed/100);

        var newPos = {
            x: Math.cos( direction.radian ) * scalar,
            y: Math.sin( direction.radian ) * scalar
        };

        newPos.x += nowPos.x;
        newPos.y += nowPos.y;

        this.checkForOOB( newPos );
        /*newPos = */this.plan.lookForCollision( this.playerAvatar.getAvatar() );

        this.playerAvatar.setPos( newPos );

    }

    /******************************
     *
     *  setPlayerSpeed
     *
     *  @param {Object.PlayerController}  myPlayer  the player instance we want to update the position
     *  @param {integer}  newSpeed  the new speed
     *
     *  @return {void}
     *
     ******************************/
    PlayerController.prototype.setPlayerSpeed = function( newSpeed ) {



    }

    /******************************
     *
     *  checkForOOB
     *
     *  check that the given coordinates are not
     *  outside of the plan
     *
     *  @param {Object}  coordinates  containing an x and a y
     *
     *  @return {Object}  the same object with new values
     *
     ******************************/
    PlayerController.prototype.checkForOOB = function( coordinates ) {

        if( coordinates.x > this.plan.references.world.w - this.playerAvatar.getSize().w )
            coordinates.x = this.plan.references.world.w - this.playerAvatar.getSize().w;
        else if( coordinates.x < 0 ) coordinates.x = 0;

        if( coordinates.y > this.plan.references.world.d - this.playerAvatar.getSize().d )
            coordinates.y = this.plan.references.world.d - this.playerAvatar.getSize().d;
        else if( coordinates.y < 0 ) coordinates.y = 0;

    }

    /******************************
     *
     *  removePlayer
     *
     *  remove the player
     *
     ******************************/
    PlayerController.prototype.removePlayer = function() {

        this.plan.world.removeElem( this.playerAvatar.getAvatar() );

    }

    return PlayerController;

}(THREE));
