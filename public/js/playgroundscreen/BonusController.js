var BonusController = (function() {

    function BonusController( boxsList, world ) {

        this._world = world;
        this._bonusBoxList = [
            { id:-1, type: '', visible: false, position: [] }
        ];

        this._bonusElem = {
            flamme: {
                total: 10,
                texture : ''
            },
            roller: {
                total: 8,
                texture: ''
            },
            bomb: {
                total: 10,
                texture: ''
            }
        }

        this.init( boxsList );

    }

    /**
     *   init
     *
     *   init set randomly the bonus box
     *
     *   @param {Object}  boxsList  the visible box list
     *
     */
    BonusController.prototype.init = function( boxsList ) {

        this._bonusBoxList.splice(0,1);//to clean it

        //setFlame
        for( var bonusName in this._bonusElem ) {

            var occurence = this._bonusElem[bonusName].total;

            for( var i=0; i < occurence; i++ ) {

                var randBlockInt = this.getRandomBoxId(boxsList);


                var bonusBlock = {
                    id: randBlockInt,
                    type: bonusName,
                    visible: false,
                    position: boxsList[randBlockInt].get2DPosition()
                }

                this._bonusBoxList.push( bonusBlock );
            }

        }

    }

    /**
     *   isBoxABonus
     *
     *   check if the destroyed box need to be transform
     *   in a bonus box
     *
     *   @param {Object}  box the box to check
     *   @param {Object}  id the registered id
     *
     *  @return {boolean}  true/false
     *
     */
    BonusController.prototype.isBoxABonus = function( id ) {

        for( var bonusId in this._bonusBoxList ) {

            if( this._bonusBoxList[bonusId].id == id ) {
                return true;
            }

        }
        return false;

    }

    /**
     *   getRandomBoxId
     *
     *   check if the destroyed box need to be transform
     *   in a bonus box
     *
     *   @param {array}  arr  the box list array
     *
     *  @return {int}
     */
    BonusController.prototype.getRandomBoxId = function( arr ) {
        var self = this;
        if( arr.length ==  this._bonusBoxList) {
            throw new Error( 'to many bonus, too few blocks to hide them' );
            return -1;
        }

        var r;
        function rand( arr ) {
            r = Math.floor(Math.random()*(arr.length -1));
            for( var i = 0; i<self._bonusBoxList.length; i++ ) {
                if( self._bonusBoxList[i].id == r ) {
                    rand( arr );
                    return false;
                }
            }
        }
        rand( arr );

        return r;

    }

    /**
     *   transformToBonusBox
     *
     *   @param {Object}  box
     *
     */
    BonusController.prototype.transformToBonusBox = function( box ) {
        
    }


    return BonusController;

})();
