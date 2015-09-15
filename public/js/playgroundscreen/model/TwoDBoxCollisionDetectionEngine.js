
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
     *  @param {Object}  position  shape like [ {x,y}, {x,y}, etc... ]
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

		var correctedPos = Object.create(position);

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
     *  isCollidingSegements
     *
     *  check if 2 segements are colliding
     *
     *  @param {Array}  obj1  shape like [{x,y}, {x,y}]
     *  @param {Object}  obj2  shape like [{x,y}, {x,y}]
     *
     *  @return {Boolean}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.isCollidingSegements = function( obj1, obj2 ) {

        return !( obj1[1].x < obj2[0].x ||
            obj1[0].x > obj2[1].x ||
            obj1[1].y < obj2[0].y ||
            obj1[0].y > obj2[1].y
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
     *  @return {Object}  shape like position
     *
     ******************************/
	 TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, oldPos, obstacle ) {

		 var dontMove = Object.create(oldPos);
		 var testYpos = Object.create(oldPos);
		 var testXpos = Object.create(oldPos);
		 var obstaclePointL = Object.keys( obstacle ).length;
 		 var objectPointL = Object.keys( objectPos ).length;

		 console.log( 'wich axis ?' )

 	 	//can we move on y ?
 		for( var i = 0; i < objectPointL; i++ ) {

			testYpos[i].y = objectPos[i].y;

		}

		if( !this.isColliding( testYpos, obstacle ) ) {
			console.log( 'y axis' )
			return testYpos;
		}

		//can we move on x ?
 		for( var i = 0; i < objectPointL; i++ ) {

			testXpos[i].x = objectPos[i].x;

		}

		if( !this.isColliding( testXpos, obstacle ) ) {
			console.log( 'x axis' )
			return testXpos;
		}

		console.log( 'didnt caught ANYTHING' );

		return dontMove;

	 }

    /*TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, directionVector, obstacle ) {

        var intersectPoint = {
			x : null,
			y : null
		};

		var newObjectPos = null;

		var obstaclePointL = Object.keys( obstacle ).length;
		var objectPointL = Object.keys( objectPos ).length;

		for( var i = 0; i < obstaclePointL; i++ ) {

			var collision = false;

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

				//are these segements cross ? no ? then jump to the next
				if( !this.doLinesIntersect( objSegment, obsSegment ) && !this.isCollidingSegements( obsSegment, objSegment ) ) continue;

				console.log( 'Found collison', i, j )

				 collision = true;

				 //the intersection [(x1,y1), (x2, y2)]
			    //it might be a line or a single point. If it is a line,
			    //then x1 = x2 and y1 = y2.
			     var x1, y1, x2, y2;

			    if (obsSegment[0].x == obsSegment[1].x) {
			         // Case (A)
			         // As a is a perfect vertical line, it cannot be represented
			         // nicely in a mathematical way. But we directly know that
			         //
			         x1 = obsSegment[0].x;
			         x2 = x1;
			         if (objSegment[0].x == objSegment[1].x) {
			             // Case (AA): all x are the same!
			             // Normalize
			             if(obsSegment[0].y > obsSegment[1].y) {
			                 a = [ obsSegment[1], obsSegment[0] ];
			             }
			             if(objSegment[0].y > objSegment[1].y) {
			                 b = [ objSegment[1], objSegment[0] ];
			             }
			             if(obsSegment[0].y > objSegment[0].y) {
			                 var tmp = obsSegment;
			                 obsSegment = objSegment;
			                 objSegment = tmp;
			             }

			             // Now we know that the y-value of obsSegment[0] is the
			             // lowest of all 4 y values
			             // this means, we are either in case (AAA):
			             //   a: x--------------x
			             //   b:    x---------------x
			             // or in case (AAB)
			             //   a: x--------------x
			             //   b:    x-------x
			             // in both cases:
			             // get the relavant y intervall
			             y1 = objSegment[0].y;
			             y2 = Math.min(obsSegment[1].y, objSegment[1].y);
			         } else {
			             // Case (AB)
			             // we can mathematically represent line b as
			             //     y = m*x + t <=> t = y - m*x
			             // m = (y1-y2)/(x1-x2)
			             var m, t;
			             m = (objSegment[0].y - objSegment[1].y)/
			                 (objSegment[0].x - objSegment[1].x);
			             t = objSegment[0].y - m*objSegment[0].x;
			             y1 = m*x1 + t;
			             y2 = y1
			         }
			     } else if (objSegment[0].x == objSegment[1].x) {
			         // Case (B)
			         // essentially the same as Case (AB), but with
			         // a and b switched
			         x1 = objSegment[0].x;
			         x2 = x1;

			         var tmp = obsSegment;
			         obsSegment = objSegment;
			         objSegment = tmp;

			         var m, t;
			         m = (objSegment[0].y - objSegment[1].y)/
			             (objSegment[0].x - objSegment[1].x);
			         t = objSegment[0].y - m*objSegment[0].x;
			         y1 = m*x1 + t;
			         y2 = y1
			     } else {
			         // Case (C)
			         // Both lines can be represented mathematically
			         var ma, mb, ta, tb;
			         ma = (obsSegment[0].y - obsSegment[1].y)/
			              (obsSegment[0].x - obsSegment[1].x);
			         mb = (objSegment[0].y - objSegment[1].y)/
			              (objSegment[0].x - objSegment[1].x);
			         ta = obsSegment[0].y - ma*obsSegment[0].x;
			         tb = objSegment[0].y - mb*objSegment[0].x;
			         if (ma == mb) {
			             // Case (CA)
			             // both lines are in parallel. As we know that they
			             // intersect, the intersection could be a line
			             // when we rotated this, it would be the same situation
			             // as in case (AA)

			             // Normalize
			             if(obsSegment[0].x > obsSegment[1].x) {
			                 obsSegment = [ obsSegment[1], obsSegment[0] ];
			             }
			             if(objSegment[0].x > objSegment[1].x) {
			                 objSegment =[ objSegment[1], objSegment[0] ];
			             }
			             if(obsSegment[0].x > objSegment[0].x) {
			                 var tmp = obsSegment;
			                 obsSegment = objSegment;
			                 objSegment = tmp;
			             }

			             // get the relavant x intervall
			             x1 = objSegment[0].x;
			             x2 = Math.min(obsSegment[1].x, objSegment[1].x);
			             y1 = ma*x1+ta;
			             y2 = ma*x2+ta;
			         } else {
			             // Case (CB): only a point as intersection:
			             // y = ma*x+ta
			             // y = mb*x+tb
			             // ma*x + ta = mb*x + tb
			             // (ma-mb)*x = tb - ta
			             // x = (tb - ta)/(ma-mb)
			             x1 = (tb-ta)/(ma-mb);
			             y1 = ma*x1+ta;
			             x2 = x1;
			             y2 = y1;
			         }
			     }

				 intersectPoint.x = x1;
				 intersectPoint.y = y1;
				 newObjectPos = this.buildNew2Dcoordinates( intersectPoint, objSegment, objectPos, j  );

				break;

			}//end for( var j = 0; j < objectPointL; j++ )

			if( collision ) break;

		}

		if( newObjectPos === null ) throw new Error('no intersection where found !');

		return newObjectPos;

    }*/

	/******************************
     *
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
     ******************************/
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

		console.log( 'buildNew2Dcoordinates', dist, newObjectPos );

		return newObjectPos;
    }

	/******************************
     *
     *  crossProduct
     *
     *  calculate cross product
     *
     *  @param {Object}  a  shape like {x:0,y:0}
     *  @param {Object}  b  shape like {x:0,y:0}
     *
     *  @return {Object}  float
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.crossProduct = function(a, b) {
	    return a.x * b.y - b.x * a.y;
	}

	/******************************
	*
	 *  Check if line segments intersect
	 *  @param a first line segment
	 *  @param b second line segment
	 *  @return <code>true</code> if lines do intersect,
	 *         <code>false</code> otherwise
	 *
	 ******************************/
	TwoDBoxCollisionDetectionEngine.prototype.doLinesIntersect = function(a, b) {
	    return this.lineSegmentTouchesOrCrossesLine(a, b)
	            && this.lineSegmentTouchesOrCrossesLine(b, a);
	}

	/******************************
	*
	 *  Check if line segment first touches or crosses the line that is
	 *  defined by line segment second.
	 *
	 *  @param first line segment interpreted as line
	 *  @param second line segment
	 *  @return <code>true</code> if line segment first touches or
	 *                           crosses line second,
	 *         <code>false</code> otherwise.
	 *
	 ******************************/
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
