
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
    TwoDBoxCollisionDetectionEngine.prototype.isOOB = function( x, y, x2, y2 ) {

        var objectPos = {
            x1: x,
            y1: y,
            x2: x2,
            y2: y2
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
     *  @param {int}  x  x position
     *  @param {int}  y  y position
     *  @param {int}  w  width
     *  @param {int}  d  depth
     *
     *  @return {Object}  shape like {x1,y1,x2,y2}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.correctedOOB = function( x1, y1, x2, y2 ) {

        var objectPos = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
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

        return objectPos;

    }


    /******************************
     *
     *  isColliding
     *
     *  check if 2 objects are colliding
     *
     *  @param {Object}  obj1  shape like {x,y,w,d}
     *  @param {Object}  obj2  shape like {x,y,w,d}
     *
     *  @return {Boolean}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.isColliding = function( obj1, obj2 ) {

        return !( obj1.x2 < obj2.x1 ||
            obj1.x1 > obj2.x2 ||
            obj1.y2 < obj2.y1 ||
            obj1.y1 > obj2.y2
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
     *  @return {Object}  shape like {x1,y1,x2,y2}
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, directionVector, obstacle ) {

		var objectPoints = this._boxPoints( objectPos );
		var obstaclePoints = this._boxPoints( obstacle );
        var intersectPoint = {
			x : null,
			y : null
		}

		//make loop through the 4 points of the obstacle
			//Caclulate segements equations
			//...

			//make loop through the 4 points of the object
				//Caclulate segements equations
				//...

				//check for intersection
				//...

				//if there is then calculate the intersection point coordinates and return them
				return objectPos;

    }


	/******************************
     *
     *  boxPoints
     *
     *  from 2 point return the 4 points positions of the box
     *
     *  @param {Object}  obj  object position {x1,y1,x2,y2}
     *
     *  @return {Array}  shape like [{x,y}, {x,y}, ....]
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype._boxPoints = function( obj ) {

		var points = [
			{x: obj.x1, y: obj.y1},//A
			{x: null, y: null},//B
			{x: obj.x2, y: obj.y2},//C
			{x: null, y: null}//D
		];

		//AC line equations
		var a = (points[2].y - points[0].y) / (points[2].x - points[0].x);
		var b =  points[2].y - (a*points[0].x);
		var coefAC;
		//AC = racine( (xb-xa)carre + (yb-ya)carre )
		var AClength = Math.sqrt( Math.pow((points[2].x - points[0].x), 2) + Math.pow((points[2].y - points[0].y), 2)  );

		//because its a square AB = BC = CD = CA
		var ABlength = AClength / Math.sqrt(2);



		/*
		* equation cercle
		* ( x-a )square + ( y-b )square = (r)square
		*/

		return points;

	}



	return TwoDBoxCollisionDetectionEngine;

})();
