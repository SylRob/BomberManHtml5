
var TwoDBoxCollisionDetectionEngine = (function() {

	function TwoDBoxCollisionDetectionEngine( worldCoordinates ) {

		this._oobCoordinates = worldCoordinates;

	}

	/**
     *  isOOB
     *
     *  check if the object is beyond ground coordinate
     *
     *  @param {Object}  position  shape like [ {x,y}, {x,y}, etc... ]
     *
     *  @return {Boolean}
     *
     */
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

    /**
     *  correctedOOB
     *
     *  the oob object is return with rectified Values
     *
     *  @param {Array}  position  shape like [ {x,y}, {x,y}, etc... ]
     *
     *  @return {Object}  position  (corrected)
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.correctedOOB = function( position ) {

		var correctedPos = position;

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

		correctedPos[0] = { x: objectPos.x1, y: objectPos.y1 };
		correctedPos[2] = { x: objectPos.x2, y: objectPos.y2 };

        return correctedPos;

    }


    /**
     *  isColliding
     *
     *  check if 2 objects are colliding
     *
     *  @param {Array}  obj1  shape like [{x,y}, {x,y}, etc...]
     *  @param {Object}  obj2  shape like [{x,y}, {x,y}, etc...]
     *
     *  @return {Boolean}
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.isColliding = function( obj1, obj2 ) {

        return !( obj1[2].x < obj2[0].x ||
            obj1[0].x > obj2[2].x ||
            obj1[2].y < obj2[0].y ||
            obj1[0].y > obj2[2].y
        );

    }

	/**
     *  isCollidingSegements
     *
     *  check if 2 segements are colliding
     *
     *  @param {Array}  obj1  shape like [{x,y}, {x,y}]
     *  @param {Array}  obj2  shape like [{x,y}, {x,y}]
     *
     *  @return {Boolean}
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.isCollidingSegements = function( obj1, obj2 ) {

        return !( obj1[1].x < obj2[0].x ||
            obj1[0].x > obj2[1].x ||
            obj1[1].y < obj2[0].y ||
            obj1[0].y > obj2[1].y
        );

    }

	/**
     *  isCollidingPoint
     *
     *  check if 2 segements are colliding
     *
     *  @param {Object}  obj1  shape like {x,y}
     *  @param {Array}  obj2  shape like [{x,y}, {x,y}, etc...]
     *
     *  @return {Boolean}
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.isCollidingPoint = function( obj1, obj2 ) {

        return !( obj1.x < obj2[0].x ||
            obj1.x > obj2[1].x ||
            obj1.y < obj2[0].y ||
            obj1.y > obj2[1].y
        );

    }

	/**
     *  sameCoordinates
     *
     *  check if 2 objects have the same coordinates
     *
     *  @param {Array}  obj1  shape like [{x,y}, {x,y}, etc...]
     *  @param {Object}  obj2  shape like [{x,y}, {x,y}, etc...]
     *
     *  @return {Boolean}
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.sameCoordinates = function( obj1, obj2 ) {

        return (obj1[0].x == obj2[0].x && obj1[2].x == obj2[2].x && obj1[0].y == obj2[0].y && obj1[2].y == obj2[2].y);

    }



    /**
     *  canceledCollision
     *
     *  important! : check there is collision before (this.isColliding())
	 *
	 *	we know that there is a collision and we just check if there is at
	 *  least 1 axis on witch we can move
     *
     *  @param {Object}  objectPos  object position [{x:0,y:0}, {x:0,y:0}, etc...]
     *  @param {Object}  directionVector  the directionVector{x,y}
     *  @param {Object}  obstacle  obstacle position [{x:0,y:0}, {x:0,y:0}, etc...]
     *
     *  @return {Object}  shape like [{x:0,y:0}, {x:0,y:0}, etc...]
     *
     */
	 TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, oldPos, obstacle ) {

		 var tempObjX = JSON.parse(JSON.stringify(oldPos));//unrelated copy
		 var tempObjY = JSON.parse(JSON.stringify(oldPos));//unrelated copy
		 var obstaclePointL = Object.keys( obstacle ).length;
 		 var objectPointL = Object.keys( objectPos ).length;

		 //can we move on x ?
  		for( var i = 0; i < objectPointL; i++ ) {
 			tempObjX[i].x = objectPos[i].x;
 		}

 		if( !this.isColliding( tempObjX, obstacle ) ) {
 			return tempObjX;
 		}

 	 	//can we move on y ?
 		for( var j = 0; j < objectPointL; j++ ) {
			tempObjY[j].y = objectPos[j].y;
		}

		if( !this.isColliding( tempObjY, obstacle ) ) {
			return tempObjY;
		}

		return oldPos;

	 }

	/**
     *  buildNew2Dcoordinates
     *
     *  make new coodinates for a square
     *
     *  @param {Object}  intersectPoint  shape like {x:0,y:0}
     *  @param {Array}  obj  shape like [{x,y}, {x,y}]
     *  @param {int}  i  where is the intersection in the obj array
     *
     *  @return {Object}  shape like [{x,y}, {x,y}, etc...]
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.buildNew2Dcoordinates = function( intersectPoint, objSegement, obj,  i) {

		var newObjectPos = obj;

		var pA = objSegement[0];
		var pB = objSegement[1];

		var dist = {
			x: ( Math.abs( pA.x - intersectPoint.x ) < Math.abs( pB.x - intersectPoint.x ) ? pA.x - intersectPoint.x : pB.x - intersectPoint.x ),
			y: ( Math.abs( pA.y - intersectPoint.y ) < Math.abs( pB.y - intersectPoint.y ) ?  pA.y - intersectPoint.y : pB.y - intersectPoint.y )
		}

		for( var j in obj ) {
			newObjectPos[j].x = newObjectPos[j].x - dist.x;
			newObjectPos[j].y = newObjectPos[j].y - dist.y;
		}

		return newObjectPos;
    }

	/**
     *  crossProduct
     *
     *  calculate cross product
     *
     *  @param {Object}  a  shape like {x:0,y:0}
     *  @param {Object}  b  shape like {x:0,y:0}
     *
     *  @return {Object}  float
     *
     */
    TwoDBoxCollisionDetectionEngine.prototype.crossProduct = function(a, b) {
	    return a.x * b.y - b.x * a.y;
	}

	/**
	 *  Check if line segments intersect
	 *  @param a first line segment
	 *  @param b second line segment
	 *  @return <code>true</code> if lines do intersect,
	 *         <code>false</code> otherwise
	 *
	 */
	TwoDBoxCollisionDetectionEngine.prototype.doLinesIntersect = function(a, b) {
	    return this.lineSegmentTouchesOrCrossesLine(a, b)
	            && this.lineSegmentTouchesOrCrossesLine(b, a);
	}

	/**
	 *  Check if line segment first touches or crosses the line that is
	 *  defined by line segment second.
	 *
	 *  @param first line segment interpreted as line
	 *  @param second line segment
	 *  @return <code>true</code> if line segment first touches or
	 *                           crosses line second,
	 *         <code>false</code> otherwise.
	 *
	 */
	 TwoDBoxCollisionDetectionEngine.prototype.lineSegmentTouchesOrCrossesLine = function(a, b) {
	    return this.isPointOnLine(a, b[0])
	            || this.isPointOnLine(a, b[1])
	            || (this.isPointRightOfLine(a, b[0]) ^ this.isPointRightOfLine(a,
	                    b[1]));
	}

	/**
	 * Checks if a Point is on a line
	 * @param a line (interpreted as line, although given as line
	 *                segment)
	 * @param b point
	 * @return <code>true</code> if point is on line, otherwise
	 *         <code>false</code>
	 */
	TwoDBoxCollisionDetectionEngine.prototype.isPointOnLine = function(a, b) {
	    // Move the image, so that a.first is on (0|0)
	    var aTmp = [ {"x":0, "y":0}, {"x":a[1].x - a[0].x, "y":a[1].y - a[0].y} ];
	    var bTmp = {"x":b.x - a[0].x, "y":b.y - a[0].y};
	    var r = this.crossProduct(aTmp[1], bTmp);
	    return Math.abs(r) < 0.0000001;
	}

	/**
	 * Checks if a point is right of a line. If the point is on the
	 * line, it is not right of the line.
	 * @param a line segment interpreted as a line
	 * @param b the point
	 * @return <code>true</code> if the point is right of the line,
	 *         <code>false</code> otherwise
	 */
	TwoDBoxCollisionDetectionEngine.prototype.isPointRightOfLine = function(a, b) {
	    // Move the image, so that a.first is on (0|0)
	    var aTmp = [ {"x":0, "y":0}, {"x":a[1].x - a[0].x, "y":a[1].y - a[0].y} ];
	    var bTmp = {"x":b.x - a[0].x, "y": b.y - a[0].y};
	    return this.crossProduct(aTmp[1], bTmp) < 0;
	}



	return TwoDBoxCollisionDetectionEngine;

})();
