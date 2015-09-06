
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
        }

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
     *  the oob object is return with corrected Value
     *
     *  @param {int}  x  x position
     *  @param {int}  y  y position
     *  @param {int}  w  width
     *  @param {int}  d  depth
     *
     *  @return {Object}  shaped like {x1,y1,x2,y2}  
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.correctedOOB = function( x1, y1, x2, y2 ) {
        
        var objectPos = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }

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
        )

    }


    /******************************
     *
     *  canceledCollision
     *
     *  the oob object is return with corrected Value
     *
     *  @param {Object}  objectPos  object position
     *  @param {Object}  directionVector  the directionVector
     *  @param {Object}  obstacle  obstacle position
     *
     *  @return {Object}  shaped like {x1,y1,x2,y2}  
     *
     ******************************/
    TwoDBoxCollisionDetectionEngine.prototype.canceledCollision = function( objectPos, directionVector, obstacle ) {

        var objectW = Math.abs( objectPos.x1 - objectPos.x2 );
        var objectD = Math.abs( objectPos.y1 - objectPos.y2 );
        
        // more x than y ? then lets deal with x first
        if( Math.abs( directionVector.x ) >= Math.abs( directionVector.y ) ){

            directionVector.x > 0 ? xCorrectionFoward() : xCorrectionBackward();
            directionVector.y > 0 ? yCorrectionUp() : yCorrectionDown()

        } else {
            directionVector.y > 0 ? yCorrectionUp() : yCorrectionDown();
            directionVector.x > 0 ? xCorrectionFoward() : xCorrectionBackward()
        }

        function xCorrectionFoward() {
            if( objectPos.x2 < obstacle.x2 &&
                objectPos.x2 > obstacle.x1 &&
                ( (objectPos.y1 < obstacle.y2 && objectPos.y1 > obstacle.y1) || 
                  (objectPos.y2 < obstacle.y2 && objectPos.y2 > obstacle.y1) )
            ) { objectPos.x1 = obstacle.x1 - objectW; objectPos.x2 = obstacle.x1 }   
        }

        function xCorrectionBackward() {
            if( objectPos.x1 < obstacle.x2 &&
                objectPos.x1 > obstacle.x1 &&
                ( (objectPos.y1 < obstacle.y2 && objectPos.y1 > obstacle.y1) || 
                  (objectPos.y2 < obstacle.y2 && objectPos.y2 > obstacle.y1) )
            ) { objectPos.x1 = obstacle.x2; objectPos.x2 = obstacle.x2 + objectW }
        }

        function yCorrectionUp() {
            if( objectPos.y2 < obstacle.y2 &&
                objectPos.y2 > obstacle.y1 &&
                ( (objectPos.x1 < obstacle.x2 && objectPos.x1 > obstacle.x1) || 
                  (objectPos.x2 < obstacle.x2 && objectPos.x2 > obstacle.x1) )
            ) { objectPos.y1 = obstacle.y1 - objectD; objectPos.y2 = obstacle.y1 }
        }

        function yCorrectionDown() {
            if( objectPos.y1 < obstacle.y2 &&
                objectPos.y1 > obstacle.y1 &&
                ( (objectPos.x1 < obstacle.x2 && objectPos.x1 > obstacle.x1) || 
                  (objectPos.x2 < obstacle.x2 && objectPos.x2 > obstacle.x1) )
            ) { objectPos.y1 = obstacle.y2; objectPos.y2 = obstacle.y2 + objectD }
        }


        return objectPos;

    }


	return TwoDBoxCollisionDetectionEngine;

})();



























