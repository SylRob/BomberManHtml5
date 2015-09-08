
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
			new THREE.Vector2( obj.x1, obj.y1 ),//A
			new THREE.Vector2(),//B
			new THREE.Vector2( obj.x2, obj.y2 ),//C
			new THREE.Vector2()//D
		];

        var X = 0;
        var Y = 1;


		//AC = racine( (xb-xa)carre + (yb-ya)carre )
		var AClength = Math.sqrt( Math.pow((points[2].getComponent(X) - points[0].getComponent(X)), 2) + Math.pow((points[2].getComponent(Y) - points[0].getComponent(Y)), 2)  );

		//because its a square AB = BC = CD = CA
		var ABlength = AClength / Math.sqrt(2);
		var ADlength = ABlength;



		/*
		* equation cercle ( X et Y sont le centre du cercle )
		* ( x-X )square + ( y-Y )square = (r)square
		*/
		var a, h;
		var rayon = ABlength;
		var distance = AClength;
		var vector = new THREE.Vector2();
        var dummyVect = points[2].clone();

		a = Math.pow(distance, 2) / ( 2*distance);
		h = Math.sqrt( Math.pow(rayon, 2) - Math.pow(a, 2) );

        //P2 = P1.sub(P0).scale(a/d).add(P0);
        dummyVect.sub( points[0] ).multiplyScalar(a/distance).add(points[0])
        console.log( dummyVect, vector );
        vector.copy( dummyVect );
		//vector.position.x = points[0].x + ( a*( points[2].x - points[0].x ) / distance );
		//vector.position.y = points[0].y + ( a*( points[2].y - points[0].y ) / distance );

		points[1].setX( vector.getComponent(X) + ( h*( points[2].getComponent(Y) - points[0].getComponent(Y) ) / distance ) );
		points[1].setY( vector.getComponent(X) - ( h*( points[2].getComponent(X) - points[0].getComponent(X) ) / distance ) );

		points[3].setX( vector.getComponent(X) - ( h*( points[2].getComponent(Y) - points[0].getComponent(Y) ) / distance ) );
		points[3].setY( vector.getComponent(X) + ( h*( points[2].getComponent(X) - points[0].getComponent(X) ) / distance ) );

		if( points[0].getComponent(X) == 0 ) {
			console.log( '-------------------------------' );
			console.log( points[1].getComponent(X), points[1].getComponent(Y) );
			console.log( '-------------------------------' );
		}

		return points;

	}



	return TwoDBoxCollisionDetectionEngine;

})();
