
var PlayerController = (function() {

    /**
     *  PlayerController
     *
     *  @param {Oject}  palyerOption  various player option (name, color, etc...)
     *
     *  @return {Object}  PlayerController
     *
     */
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
        this._worldMaxBomb = gameOption.PLAYER_MAX_BOMB;

        this._bombPower = gameOption.BOMB_POWER;
        this._maxBombPower = gameOption.BOMB_MAX_POWER;

        this._bomb = 0;
        this._maxBomb = 1;
        this._actionButton = false;
        this._world;

        this._soundList = {
            run: new Howl({
                    urls: ['/sound/PLAYER_WALK.wav'],
                    volume: 0.05
                }),
            die: new Howl({
                    urls: ['/sound/PLAYER_OUT.mp3'],
                    volume: 1
                }),
        }

        this.initPlayer();

    }

    /**
     *  initPlayer
     *
     *  @return {void}
     *
     */
    PlayerController.prototype.initPlayer = function() {
        var self = this;
        if( undefined !== this._playerOption.pseudo && this._playerOption.pseudo != '' ) {
            this.pseudo = this._playerOption.pseudo;
        } else this.pseudo = 'Player'+this._playerOption.id;

        this.id = this._playerOption.id;

        for( var id in this._soundList ) {
            (function(id){
                var sound = self._soundList[id];
                sound.on('load', function() {
                    //sound.play();
                })
            })(id)
        }

    }

    /**
     *  initAvatar
     *
     *  @return {void}
     *
     */
    PlayerController.prototype.initAvatar = function( x, y, world ) {

        this.playerAvatar = new PlayerAvatar( this._playerOption, 25 );
        this.playerAvatar.initAvatar();

        var avatarMesh = this.playerAvatar.getAvatar();
        avatarMesh.position.set( x, 25, y );

        this._world = world;
        this._world.addElem( avatarMesh );

    }


    /**
     *  updatePlayerTempPos
     *
     *  @param {Oject}  playerData  an object with the direction and velocity informations
     *
     */
    PlayerController.prototype.updatePlayerTempPos = function( playerData ) {

        var direction = playerData.direction;
        var nowPos = this.playerAvatar.getPos();
        var scalar = direction.velocity * (this._speed/100);

        var newPos = {
            x: Math.cos( direction.radian ) * scalar,
            y: Math.sin( direction.radian ) * scalar
        }

        newPos.x += nowPos.x;
        newPos.y += nowPos.y;

        this._playerTempPos = newPos;

        this._playerTempPos.directionVector = {
            x: Math.cos( direction.radian ),
            y: Math.sin( direction.radian )
        }

        this._actionButton = playerData.ab;

    }

    /**
     *  getPlayerOption
     *
     *
     *  @return {Object}
     *
     */
    PlayerController.prototype.getPlayerOption = function() {

        return this._playerOption;

    }

    /**
     *  getPlayerPosition
     *
     *
     *  @return {Object}  x, y and direction( vector coordinate )
     *
     */
    PlayerController.prototype.getPlayerPosition = function() {

        return this.playerAvatar.get2DpositionFromTemp( this.playerAvatar.getPos() );

    }

    /**
     *  getPlayerTempPosition
     *
     *
     *  @return {Object}  x, y and direction( vector coordinate )
     *
     */
    PlayerController.prototype.getPlayerTempPosition = function( dummyPos ) {

        if( undefined === dummyPos )  return this._playerTempPos;
        else return this.playerAvatar.get2DpositionFromTemp( dummyPos );

    }

    /**
     *  getBomb
     *
     *  @return {int}
     *
     */
    PlayerController.prototype.getBomb = function() {
        return this._bomb;

    }

    /**
     *  setBomb
     *
     *  @param {int}  numberBomb
     *
     */
    PlayerController.prototype.setBomb = function( numberBomb ) {

        if( isNaN(numberBomb) ) {
            throw new Error(' set bomb must be a number ');
            return false;
        }

        if( numberBomb > this._maxBomb ) this._bomb = this._maxBomb;
        this._bomb = numberBomb;

    }

    /**
     *  plusOneBomb
     *
     */
    PlayerController.prototype.plusOneBomb = function() {

        this.setMaxBomb(this.getBomb()+1);
        console.log( "new max bomb", this._maxBomb );
        console.log( "plus one bomb ", this.getBomb(), this.getBomb()+1 );
        console.log( "world max bomb ", this._worldMaxBomb );

    }

    /**
     *  getMaxBomb
     *
     *  @return {int}
     *
     */
    PlayerController.prototype.getMaxBomb = function() {

        return this._maxBomb;

    }

    /**
     *  setMaxBomb
     *
     *  @param {int}  numberBomb
     *
     */
    PlayerController.prototype.setMaxBomb = function( numberBomb ) {

        if( isNaN(numberBomb) ) {
            throw new Error(' set max bomb must be a number ');
            return false;
        }

        if( numberBomb > this._worldMaxBomb ) return false;
        this._maxBomb = numberBomb;

    }

    /**
     *  getSpeed
     *
     *  @return {int}
     *
     */
    PlayerController.prototype.getSpeed = function() {

        return this._speed;

    }

    /**
     *  setSpeed
     *
     *  @param {int}  speed
     *
     */
    PlayerController.prototype.setSpeed = function( speed ) {

        if( isNaN(speed) ) {
            throw new Error(' set Speed must be a number ');
            return false;
        }

        if( speed > this._maxSpeed ) this._speed = this._maxSpeed;
        else this._speed = speed;

    }

    /**
     *  moreSpeed
     *
     *  @param {int}  speed
     *
     */
    PlayerController.prototype.moreSpeed = function() {

        this.setSpeed(this.getSpeed()+1);

    }


    /**
     *  getBombPower
     *
     *  @return {int}
     *
     */
    PlayerController.prototype.getBombPower = function() {

        return this._bombPower;

    }

    /**
     *  setBombPower
     *
     *  @param {int}  speed
     *
     */
    PlayerController.prototype.setBombPower = function( power ) {

        if( isNaN(power) ) {
            throw new Error(' set Bomb power must be a number ');
            return false;
        }

        if( power > this._maxBombPower ) this._bombPower = this._maxBombPower;
        else this._bombPower = power;

    }

    /**
     *  isActionBtnActif
     *
     *  @return {boolean}
     *
     */
    PlayerController.prototype.isActionBtnActif = function() {

        return this._actionButton;

    }

    /**
     *  isMoveable
     *
     *  if the getPlayerTempPosition return the
     *  same position as before we stop the sound
     *  reset the avatar postion and return false
     *
     *  @return {boolean}
     *
     */
    PlayerController.prototype.isMoveable = function() {

        var avatarPos = this.playerAvatar.getPos();
        var avatarSize = this.playerAvatar.getSize();
        var tempPos = this.getPlayerTempPosition();
        if(
            avatarPos.x == tempPos.x &&
            avatarPos.y == tempPos.y
        ) {
            this._soundList.run.stop();
            this.playerAvatar.resetPos();
            return false;
        } else return true;

    }

    /**
     *  moveTo
     *
     *  trigger the running sound +
     *  ask the avatar to move
     *
     *  @param {Object}  updatedPos  {x:0,y:0}
     *  @param {Object}  directionVector  {x:0,y:0}
     *
     */
    PlayerController.prototype.moveTo = function( updatedPos, directionVector ) {

        if( this._soundList.run.pos() === 0 ) this._soundList.run.play();
        this.playerAvatar.setPos( updatedPos, directionVector );

    }

    /**
     *  iAmDead
     *
     *  @return {boolean}
     *
     */
    PlayerController.prototype.iAmDead = function() {

        this._soundList.die.play();
        this.playerAvatar.dyingAvatarAnimation((function(){
            this._world.removeElem( this.playerAvatar.getAvatar() );
        }).bind(this));
    }

    return PlayerController;

}(THREE));
