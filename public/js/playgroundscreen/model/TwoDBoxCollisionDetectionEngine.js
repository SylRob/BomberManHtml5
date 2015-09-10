
var TwoDBoxCollisionDetectionEngine = (function() {

	function TwoDBoxCollisionDetectionEngine( worldCoordinates ) {

		this._oobCoordinates = worldCoordinates;

	}

	/******************************
     *
     *  isOOB
     *
     *  check if the object is beyond ground coordinate
     *
     *  @param {int}  x  x position
     *  @param {int}  y  y position
     *  @param {int}  w  width
     *  @param {int}  d  depth
     *
     *  @return {Boolean}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.isOOB = function( position ) {

        var objectPos = {
            x1: position[0].x,
            y1: position[0].y,
            x2: position[2].x,
            y2: position[2].y
        };

        return ( objectPos.x1 < this._oobCoordinates.x1 ||
            objectPos.x2 > this._oobCoordinates.x2 ||
            objectPos.y1 < this._oobCoordinates.y1 ||
            objectPos.y2 > this._oobCoordinates.y2
        )

    }

    /******************************
     *
     *  correctedOOB
     *
     *  the oob object is return with rectified Values
     *
     *  @param {Array}  position  shape like [ {x,y}, {x,y}, etc... ]
     *
     *  @return {Object}  position  (corrected)
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.correctedOOB = function( position ) {

        var objectPos = {
            x1: position[0].x,
            y1: position[0].y,
            x2: position[2].x,
            y2: position[2].y
        };

        var objectW = Math.abs( objectPos.x1 - objectPos.x2 );
        var objectD = Math.abs( objectPos.y1 - objectPos.y2 );

        // OOB ?
        if( objectPos.x2 > this._oobCoordinates.x2 ) {
            objectPos.x1 = this._oobCoordinates.x2 - objectW;
            objectPos.x2 = this._oobCoordinates.x2;
        } else if( objectPos.x1 < this._oobCoordinates.x1 ) {
            objectPos.x1 = this._oobCoordinates.x1;
            objectPos.x2 = objectW;
        }


        if( objectPos.y2 > this._oobCoordinates.y2 ) {
            objectPos.y1 = this._oobCoordinates.y2 - objectD;
            objectPos.y2 = this._oobCoordinates.y2;
        } else if( objectPos.y1 < this._oobCoordinates.y1 ) {
            objectPos.y1 = this._oobCoordinates.y1;
            objectPos.y2 = objectD;
        }

		position[0] = { x: objectPos.x1, y: objectPos.y1 };
		position[2] = { x: objectPos.x2, y: objectPos.y2 };

        return position;

    }


    /******************************
     *
     *  isColliding
     *
     *  check if 2 objects are colliding
     *
     *  @param {Array}  obj1  shape like [{x,y}, {x,y}, etc...]
     *  @param {Object}  obj2  shape like [{x,y}, {x,y}, etc...]
     *
     *  @return {Boolean}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.isColliding = function( obj1, obj2 ) {

        return !( obj1[2].x < obj2[0].x ||
            obj1[0].x > obj2[2].x ||
            obj1[2].y < obj2[0].y ||
            obj1[0].y > obj2[2].y
        );

    }


    /******************************
     *
     *  canceledCollision
     *
     *  important! : check there is collision before (this.isColliding())
	 *
	 *	find the collision point coordinate and
	 *	return it
     *
     *  @param {Object}  objectPos  object position {x1,y1,x2,y2}
     *  @param {Object}  directionVector  the directionVector{x,y}
     *  @param {Object}  obstacle  obstacle position
     *
     *  @return {Object}  shape like {x: 0, y: 0}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, directionVector, obstacle ) {

        var intersectPoint = {
			x : null,
			y : null
		}

		var obstaclePointL = Object.keys( obstacle ).length;
		var objectPointL = Object.keys( objectPos ).length;

		for( var i = 0; i < obstaclePointL; i++ ) {
			var obsSegment = [
				obstacle[i],
				obstaclePointL - 1 ? obstacle[0] : obstacle[i+1]
			];

			//segment equation
			var obs_M = (obsSegment[1].y - obsSegment[0].y) / (obsSegment[1].x - obsSegment[0].x);
			var obs_T = obsSegment[0].y - ( obs_M*obsSegment[0].x ) ;

			for( var j = 0; j < objectPointL; j++ ) {
				var objSegment = [
					objectPos[j],
					j == objectPointL - 1 ? objectPos[0] : objectPos[j+1]
				];

				//segment equation
				var obj_M = (objSegment[1].y - objSegment[0].y) / (objSegment[1].x - objSegment[1].x);
				var obj_T = objSegment[0].y - ( obj_M*objSegment[0].x );

				//Same x for everyone
				if( objSegment[0].x === objSegment[1].x && obsSegment[0].x === objSegment[0].x ) {

					intersectPoint.x = objSegment[0].x;
					//normalize points
					if( obsSegment[0].y > obsSegment[1].y ) { obsSegment = [ obsSegment[1], obsSegment[0] ] }
					if( objSegment[0].y > objSegment[1].y ) { objSegment = [ objSegment[1], objSegment[0] ] }
					if( obsSegment[0].y > objSegment[0].y ) { var tmp = objSegment; objSegment = obsSegment; obsSegment = objSegment; }
					// ** //
					intersectPoint.y = objSegment[0].y;

				} else if( obsSegment[0].x === obsSegment[0].x ) {
					//horizontal line for obstacle
					intersectPoint.x = obsSegment[0].x;
					intersectPoint.y = obj_M *intersectPoint.x + obj_T;

				} else if( objSegment[0].x === objSegment[1].x ) {
					//horizontal line for obstacle for object
					intersectPoint.x = objSegment[0].x;
					intersectPoint.y = obs_M*intersectPoint.x + obs_T;

				} else {
					//normal line !
					intersectPoint.x = ( obj_T - obs_T ) / ( obj_M - obs_M );
					intersectPoint.y = obs_M * intersectPoint.x + obs_T;
				}

			}//end for( var j = 0; j < objectPointL; j++ )

		}

		console.log( intersectPoint, obs_M, obs_T, obj_M, obj_T );

		return intersectPoint;

    }



	return TwoDBoxCollisionDetectionEngine;

})();
