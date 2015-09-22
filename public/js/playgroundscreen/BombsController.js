var BombsController = (function() {
	
	function BombsController( world ) {

          this._world = world;
		this.animationTime = 3000;//3seconds
		this._bombList = new Array();

	}


	/******************************
     *
     *  newBomb
     *
     *  create a new bomb, add it to the list
     *	and return it
     *
     *    @param {Object}  position  x and y
     *	@param {int}  size  
     *	@param {int}  playerId  just to find it in the array later
     *	@param {int}  power power of the bomb from 2-12
     *
     *  return {Bomb} 
     *
     ******************************/
	BombsController.prototype.newBomb = function( position, size, power, playerId ) {


          var bomb = new Bomb();

          bomb.init( position, size );


          this._world.addElem( bomb.getObj() );

          if( undefined === this._bombList[playerId] ) this._bombList[playerId] = new Array();

          this._bombList[playerId].push(
               {
                    bomb: bomb,
                    power: power
               }
          )

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
	BombsController.prototype.animationHandeler = function( timeStamp ) {

		

	}

	return BombsController;

})()




























