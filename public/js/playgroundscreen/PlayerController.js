
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
    function PlayerController(GameController, palyerOption) {

        this.palyerOption = palyerOption;
        this.gameController = GameController;
        this.speed = GameController.PLAYER_SPEED;
        this.maxSpeed = GameController.PLAYER_MAX_SPEED;

        this.plan = GameController.plan;

        this.avatar = new PlayerAvatar( palyerOption );

        this.plan.add( this.avatar );

    }

    /******************************
     *
     *  updatePlayerPos
     *
     *  @param {Object.PlayerController}  myPlayer  the player instance we want to update the position
     *  @param {Oject}  playerPos  an object with the new position informations
     *
     *  @return {Object.PlayerController} the updated player instance
     *
     ******************************/
    PlayerController.prototype.updatePlayerPos = function( myPlayer, playerPos ) {

        /*var nowPos = {
            x   : myPlayer.pos.x
            ,y  : myPlayer.pos.y
        }*/

        console.log( playerPos, myPlayer );

        return myPlayer;

    }

    /******************************
     *
     *  setPlayerSpeed
     *
     *  @param {Object.PlayerController}  myPlayer  the player instance we want to update the position
     *  @param {integer}  newSpeed  the new speed
     *
     *  @return {Object.PlayerController} the updated player instance
     *
     ******************************/
    PlayerController.prototype.setPlayerSpeed = function( myPlayer, newSpeed ) {

        var nowPos = {
            x   : myPlayer.pos.x
            ,y  : myPlayer.pos.y
        }

        return myPlayer;

    }

    /******************************
     *
     *  resetPlayerPos
     *
     *  @param {Object.PlayerController}  myPlayer  the player instance we want to update the position
     *
     *  @return {Object.PlayerController} the updated player instance
     *
     ******************************/
    PlayerController.prototype.updatePlayerPos = function( myPlayer ) {

        myPlayer.pos.x = myPlayer.pos.y = 0;
        myPlayer.actionBtn = false;

        return myPlayer;

    }

    return PlayerController;

}(THREE));
