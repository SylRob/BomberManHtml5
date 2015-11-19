var BoxsController = (function() {

	function BoxsController( world, w, h ) {

          this._world = world;
          this._planeSize = {
              w: w,
              h: h
          }
		  this._boxsUndestructibleList = new Array();
		  this._boxsDestructibleList = new Array();
		  this._boxsUnvisibleBoxsList = new Array();
          this.collisionDetection = new TwoDBoxCollisionDetectionEngine( this._world.getGroundCoordinates() )
          this._boxPerLine = 0;
          this.explodedAnimBox = new Array();
		  this._explodAnimationTime = 1500;
	}

    /**
     *  newBox
     *
     *  create a new box, add it to the list
     *	and return it
     *
     *  @param {Object}  position  x and y
     *	@param {int}  size
     *	@param {boolean}  destroyed  is it already destoyed ?
     *	@param {boolean}  destroyable is it destroyable
     *
     */
	BoxsController.prototype.newBox = function( position, size, destroyed, destroyable ) {
        var box = new Box();

        var box = new Box( boxWidth, boxHeight, boxDepth, 0x000FFF, false );
        box.getObj().position.set(
            boxXpos,
            0,
            boxZpos
        );

	}

    /**
     *  generateBox
     *
     *	assign animation state to the selected box
     *
     *	@param {int}  boxPerLine
     *
     */
	BoxsController.prototype.generateBox = function( boxPerLine ) {

        if( isNaN(boxPerLine) ) {
            throw new Error( 'the argument of the generateBox must be a number' );
        }

        this._boxPerLine = boxPerLine;

        //Boxes
        var boxWidth = this._planeSize.w/this._boxPerLine;
        var boxHeight = this._planeSize.w/this._boxPerLine;
        var boxDepth = this._planeSize.h/this._boxPerLine;
        var occurences = this._boxPerLine*this._boxPerLine;

        var boxXpos = 0;
        var boxZpos = 0;

        var line = 0;

        for( var i=0; i<occurences; i++ ) {
            // not destructible
            if( !(i%4) && !(line%4) ) {

                var box = new Box( boxWidth, boxHeight, boxDepth, 0x000FFF, false );
                box.getObj().position.set(
                    boxXpos,
                    0,
                    boxZpos
                );
                //box.getObj().add( this.axisPaint() )
                //push the cube in the list to remember it
                this._boxsUndestructibleList.push( box );

            } else {
            // destructible
                var box = new Box( boxWidth, boxHeight, boxDepth, 0x8A2BE2, true );
                box.getObj().position.set(
                    boxXpos,
                    0,
                    boxZpos
                );
                this._boxsDestructibleList.push( box );
            }

            this._world.addElem( box.getObj() );
            boxXpos += boxWidth;

            if(boxXpos >= this._planeSize.w - boxWidth) {
                line++;
                boxZpos += boxDepth;
                boxXpos = 0;
            }
        }

	}

    /**
     *  animationHandeler
     *
     *	assign animation state to the selected box
     *
     *	@param {int}  timeStamp
     *	@param {function}  explodedBoxCallBack  send explodedBombObj
     *
     */
	BoxsController.prototype.animationHandeler = function( timeStamp, explodedBoxCallBack ) {


	}

    /**
     *  getAllVisibleBoxsList
     *
     *  get the visible box list
     *
     *  return {array}
     *
     */
	BoxsController.prototype.getAllVisibleBoxsList = function() {

        return this._boxsDestructibleList.concat(this._boxsUndestructibleList);

	}

    /**
     *  getUnvisibleBoxsList
     *
     *  return {array}
     *
     */
	BoxsController.prototype.getUnvisibleBoxsList = function() {
        return this._boxsUnvisibleBoxsList;
	}

    /**
     *  getDestructibleBoxList
     *
     *  return {array}
     *
     */
	BoxsController.prototype.getDestructibleBoxList = function() {
        return this._boxsDestructibleList;
	}

	/**
     *  getDestructibleBoxId
     *
     *  return int;
     *
     */
	BoxsController.prototype.getDestructibleBoxId = function( box ) {

        return this._boxsDestructibleList.indexOf(box);

	}


    /**
     *  destroyBoxsNoAnim
     *
     *  destroy a box and skip the destroy animation
     *
     *  @param {Array}  arr  an array of box to switch
     *
     */
	BoxsController.prototype.destroyBoxsNoAnim = function( arr ) {

        for( var id in arr ) {

            var boxToSwitch = arr[id];
            var index = this._boxsDestructibleList.indexOf( boxToSwitch );

            if( index < 0 ) {
                throw new Error("cannot find the bomb");
                return false;
            }

            boxToSwitch.destroyed();

            this._boxsUnvisibleBoxsList.push(boxToSwitch);
            this._boxsDestructibleList.splice(index, 1);
        }

	}

	/**
     *  just for debug
     *
     */
	BoxsController.prototype.destroyBoxNoAnim = function( box ) {

        var index = this._boxsDestructibleList.indexOf( box );

        if( index < 0 ) {
            throw new Error("cannot find the bomb");
            return false;
        }

        box.destroyed();

        this._boxsUnvisibleBoxsList.push(box);
        this._boxsDestructibleList.splice(index, 1);
	}

    /**
     *  getBoxCollision
     *
     *
     *  return {array}
     *
     */
	BoxsController.prototype.getBoxCollision = function() {



	}

    return BoxsController;
})();
