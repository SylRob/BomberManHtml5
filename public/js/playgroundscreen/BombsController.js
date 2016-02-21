var BombsController = (function() {

	function BombsController( world, stepX, stepY, planeSizeW, planeSizeH ) {

          this._world = world;
		  this.animationTime = 5000;//4seconds
		  this._step = {
			  x: stepX-0.01,
			  y: stepY-0.01
		  }
		  this._planeSize = {
			  w: planeSizeW,
			  h: planeSizeH
		  }
		  this.explodedAnimationTime = 1000;
		  this.collisionDetection = new TwoDBoxCollisionDetectionEngine( this._world.getGroundCoordinates() )
		  this._bombList = new Array();
		  this._explodedBomb = new Array();
		  this._soundList = {
              explodeS: new Howl({
                      urls: ['/sound/BOM_11_S.mp3']
                  }),
              explodeM: new Howl({
                      urls: ['/sound/BOM_11_M.mp3']
                  }),
              explodeL: new Howl({
                      urls: ['/sound/BOM_11_L.mp3']
                  }),
		      bombSet: new Howl({
                      urls: ['/sound/BOM_SET02.wav'],
                      volume: 0.2
                  })
          }

	}


	/**
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
     */
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

		this._soundList.bombSet.play();

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


	/**
     *  getBombsList
     *
     *  get the bombs list
     *
     *  return {array}
     *
     */
	BombsController.prototype.getBombsList = function() {

		return this._bombList;

	}

	/**
     *  getExplodedList
     *
     *  get the exploded bombs list
     *
     *  return {array}
     *
     */
	BombsController.prototype.getExplodedList = function() {

		return this._explodedBomb;

	}

	/**
     *  setSteps
     *
     *  set the step width
     *
     *  @param {int}  stepX
     *  @param {int}  stepY
     *
     */
	BombsController.prototype.setSteps = function( stepX, stepY ) {

		this._step = {
			x: stepX,
			y: stepY
		}

	}


	/**
     *  animationHandeler
     *
     *	assign animation state to the bomb list
     *
     *	@param {int}  timeStamp
     *	@param {function}  explodedBombCallBack  send explodedBombObj
     *
     */
	BombsController.prototype.animationHandeler = function( timeStamp, explodedBombCallBack ) {

		for( var userId in this._bombList ) {

			var userBombs = this._bombList[userId];
			for( var id in userBombs ) {
				var bombInfo = userBombs[id];
				var bombObj = userBombs[id].bomb;
				var timeSpent = timeStamp - bombInfo.startTime;
				var animPercentage = Math.round( timeSpent / (bombInfo.duration - this.explodedAnimationTime) * 100 )/100;

				bombObj.animationStep( animPercentage );
				if ( !bombObj.isExploded && animPercentage >= 1 ) {
					bombObj.isExploded = true;
					this.explodeSequenceTemp( userId, id, explodedBombCallBack );
				}

				if( timeSpent >= this.animationTime ) this.removeBomb( userId, id );


			}//end for( var id in userBombs )

		}//end for( var userId in this._bombList )
	}

	/**
     *  removeBomb
     *
     *  @param {int}  userId  to find the user in the bomb list
     *  @param {int}  id  to find the bomb in the bomb list
     *
     */
	BombsController.prototype.removeBomb = function( userId, id ) {

		if( this._explodedBomb[userId][id] ){
			this._world.removeElem( this._explodedBomb[userId][id].horizontalObj );
			this._world.removeElem( this._explodedBomb[userId][id].verticalObj );
			delete this._explodedBomb[ userId ][ id ];
		} else {
			this._world.removeElem( this._bombList[ userId ][ id ].bomb.getObj() );
		}

		delete this._bombList[ userId ][ id ];
	}

	/**
     *  explodeSequenceTemp
     *
     *  @param {int}  userId  to find the user in the bomb list
     *  @param {int}  id  to find the bomb in the bomb list
     *  @param {function}  explodedBombCallBack  send explodedBombObj
     *
     */
	BombsController.prototype.explodeSequenceTemp = function( userId, id, explodedBombCallBack ) {

		var bombObj = this._bombList[userId][id];
		var bomb = bombObj.bomb;

		this._soundList[ ['explodeS', 'explodeM', 'explodeL'][Math.floor(Math.random() * 3)] ].play();
		var bombCoor = bomb.get2DPosition();

		var horizontalCoor = [
			{ x: bombCoor[0].x - (bombObj.power * this._step.x) + 0.01, y: bombCoor[0].y + 0.01 },
			{ x: bombCoor[1].x + (bombObj.power * this._step.x) - 0.01, y: bombCoor[1].y + 0.01 },
			{ x: bombCoor[2].x + (bombObj.power * this._step.x) - 0.01, y: bombCoor[2].y - 0.01 },
			{ x: bombCoor[3].x - (bombObj.power * this._step.x) + 0.01, y: bombCoor[3].y - 0.01 }
		];

		var verticalCoor = [
			{ x: bombCoor[0].x + 0.01, y: bombCoor[0].y - (bombObj.power * this._step.y) + 0.01 },
			{ x: bombCoor[1].x - 0.01, y: bombCoor[1].y - (bombObj.power * this._step.y) + 0.01 },
			{ x: bombCoor[2].x - 0.01, y: bombCoor[2].y + (bombObj.power * this._step.y) - 0.01 },
			{ x: bombCoor[3].x + 0.01, y: bombCoor[3].y + (bombObj.power * this._step.y) - 0.01 }
		]

		var bombExplodedObj = {
			userId : userId,
			id: id,
			power: bombObj.power,
			position: bomb.get2DPosition(),
			horizontalCoor: horizontalCoor,
			verticalCoor: verticalCoor
		}

		if( !(userId in this._explodedBomb) ) this._explodedBomb[ userId ] = new Array();

		this._explodedBomb[ userId ][ id ] = bombExplodedObj;

		this._world.removeElem( bomb.getObj() );

		if( typeof explodedBombCallBack == "function" ) explodedBombCallBack( bombExplodedObj );

	}

	/**
     *  drawEpxlodedBomb
     *
     *  @param {object}  bombExoplodedObj
     *
     */
	BombsController.prototype.drawEpxlodedBomb = function( bombExoplodedObj ) {

		var bomb = this._bombList[ bombExoplodedObj.userId ][ bombExoplodedObj.id ].bomb;

		var obj = bomb.destroyAnimation( bombExoplodedObj.horizontalCoor, bombExoplodedObj.verticalCoor );

		if( !(bombExoplodedObj.userId in this._explodedBomb) ) {
			throw new Error( 'cannot find the exploded bomb' );
			return false;
		}

		this._explodedBomb[ bombExoplodedObj.userId ][ bombExoplodedObj.id ].horizontalObj = obj.h;
		this._explodedBomb[ bombExoplodedObj.userId ][ bombExoplodedObj.id ].verticalObj = obj.v;

		this._world.addElem( obj.h );
		this._world.addElem( obj.v );

	}

	/**
     *  checkBombCollision
     *
     *  @param {object}  bombExoplodedObj
     *
     */
	BombsController.prototype.checkBombCollision = function( bombExoplodedObj ) {

		for( var playerId in this._bombList ) {

			for( var i in this._bombList[playerId] ) {
				var bomb = this._bombList[playerId][i].bomb;

				if( (bombExoplodedObj.userId == playerId && bombExoplodedObj.id == i) || bomb.isExploded ) continue;

				var bombPosition = bomb.get2DPosition();

				if( !this.collisionDetection.isColliding( bombExoplodedObj.horizontalCoor, bombPosition ) &&
			 	!this.collisionDetection.isColliding( bombExoplodedObj.verticalCoor, bombPosition ) ) continue;
				else {
					// lets put the start time to 1 so the next animation frame will make the bomb explod
					this._bombList[playerId][i].startTime = 1;
				}
			}
		}

	}

	return BombsController;

})();
