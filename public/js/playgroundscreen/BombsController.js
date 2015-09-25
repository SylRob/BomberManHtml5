var BombsController = (function() {

	function BombsController( world ) {

          this._world = world;
		  this.animationTime = 5000;//4seconds
		  this.explodedAnimationTime = 1000;
		  this.collisionDetection = new TwoDBoxCollisionDetectionEngine( this._world.getGroundCoordinates() )
		  this._bombList = new Array();

	}


	/******************************
     *
     *  newBomb
     *
     *  create a new bomb, add it to the list
     *	and return it
     *
     *  @param {Object}  position  x and y
     *	@param {int}  size
     *	@param {int}  playerId  just to find it in the array later
     *	@param {int}  power power of the bomb from 2-12
     *
     *  @return {boolean} succed or not
     *
     ******************************/
	BombsController.prototype.newBomb = function( position, size, power, playerId ) {
        var bomb = new Bomb();
		var timeStamp = new Date().getTime();

		if( undefined === this._bombList[playerId] ) this._bombList[playerId] = new Array();
		else {
			//just to check that the user does not put his bomb on an other one he just put
			for( var i in this._bombList[playerId] ) {
			  	var bombPosition = this._bombList[playerId][i].bomb.get2DPosition();
				//same place as the previous bomb ! return false
			  	if( this.collisionDetection.sameCoordinates( position, bombPosition ) )  return false;
			}
		}

        bomb.init( position, size );
        this._world.addElem( bomb.getObj() );
        this._bombList[playerId].push(
          {
            bomb: bomb,
            power: power,
			startTime: timeStamp,
			duration: this.animationTime,
			isExploded: false
          }
        )

		return true;
	}


	/******************************
     *
     *  getBombsList
     *
     *  get the bombs list
     *
     *  return {array}
     *
     ******************************/
	BombsController.prototype.getBombsList = function() {

		return this._bombList;

	}


	/******************************
     *
     *  animationHandeler
     *
     *	assign animation state to the bomb list
     *
     *	@param {int}  timeStamp
     *
     ******************************/
	BombsController.prototype.animationHandeler = function( timeStamp, explodedBombCallBack ) {

		for( var userId in this._bombList ) {

			var userBombs = this._bombList[userId];
			for( var id in userBombs ) {
				var bombInfo = userBombs[id];
				var bombObj = userBombs[id].bomb;
				var animPercentage = Math.round( (timeStamp - bombInfo.startTime) / (bombInfo.duration - this.explodedAnimationTime) * 100 )/100;

				bombObj.animationStep( animPercentage );

				//if( animPercentage >= 1 ) this.removeBomb( userId, id, explodedBombCallBack );
			}

		}

		/******************************
	     *
	     *  removeBomb
	     *
	     *  @param {int}  userId  to find the user in the bomb list
	     *  @param {int}  id  to find the bomb in the bomb list
	     *
	     ******************************/
		BombsController.prototype.removeBomb = function( userId, id, explodedBombCallBack ) {

			this._world.removeElem( this._bombList[userId][id].bomb.getObj() );
			delete this._bombList[userId][id];

			if( typeof explodedBombCallBack === 'function' ) {
				explodedBombCallBack( userId );
			}

		}

	}

	return BombsController;

})()
