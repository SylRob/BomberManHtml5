var BonusController = (function() {

    function BonusController( boxsList, world ) {

        this._world = world;
        this.animationTime = 2000;//1seconds
        this.variationPix = 2;
        this._bonusBoxList = [
            { id:-1, type: '', visible: false, obj: [], startTime: 0 }
        ];

        this._bonusElem = {
            flame: {
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

        this.generateBonusBox( boxsList );

    }

    /**
     *   generateBonusBox
     *
     *   init set randomly the bonus box (3D box but not in the world yet)
     *
     *   @param {Object}  boxsList  the visible box list
     *
     */
    BonusController.prototype.generateBonusBox = function( boxsList ) {

        this._bonusBoxList.splice(0,1);//to clean it

        //setFlame
        for( var bonusName in this._bonusElem ) {

            var occurence = this._bonusElem[bonusName].total;

            for( var i=0; i < occurence; i++ ) {

                var randBlockInt = this.getRandomBoxId(boxsList);
                var previousBoxSize = boxsList[randBlockInt].size;
                var bonusBox = new BonusBox( (previousBoxSize.w*70/100), (previousBoxSize.h*70/100), (previousBoxSize.d*70/100), true, randBlockInt, bonusName );

                var bonusBlock = {
                    id: randBlockInt,
                    type: bonusName,
                    visible: false,
                    obj: bonusBox,
                    startTime: 0
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
     *   @param {int}  id  the box id
     *
     *  @return {boolean}  true/false
     *
     */
    BonusController.prototype.isBoxABonus = function( id ) {

        /*for( var bonusId in this._bonusBoxList ) {

            if( this._bonusBoxList[bonusId].id == id ) {
                console.log( 'is a bonus box', this._bonusBoxList[bonusId] );
                break;
            }

        }*/

        var result = this._bonusBoxList.filter(function(o){ return o.id == id; } );
        return result[0] ? true : false;

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
     *   @param {Object}  box  original box to replace with
     *   @param {int}  int
     *
     */
    BonusController.prototype.transformToBonusBox = function( box, id ) {
        var bonusBox = false;

        var bonusBox = this._bonusBoxList.filter(function(o){ return o.id == id; } );
        if( !bonusBox[0] ) return false;

        bonusBoxObj = bonusBox[0].obj;

        var boxPos = box.getCenterPosition();

        bonusBoxObj.getObj().position.set(
            boxPos.x - bonusBoxObj.size.w/2,
            0,
            boxPos.y - bonusBoxObj.size.d/2
        );

        this._world.addElem( bonusBoxObj.getObj() );

        bonusBox[0].visible = true;
    }

    /**
     *   getVisibleBonusList
     *
     *   @return {Array}  the list of the visible bonus box
     *
     */
    BonusController.prototype.getVisibleBonusList = function() {

        var res = [];

        for( var i in this._bonusBoxList ) {
            var bonus = this._bonusBoxList[i];

            if( bonus.visible ) res.push( bonus );
        }

        return res;
    }

    /**
     *   removeBonusBox
     *
     *   @return {Array}  the list of the visible bonus box
     *
     */
    BonusController.prototype.removeBonusBox = function( bb ) {

        for( var i in this._bonusBoxList ) {
            var bonus = this._bonusBoxList[i];

            if( bonus.id === bb.id ) delete this._bonusBoxList[i];
        }

        this._world.removeElem( bb.obj.obj );
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
	BonusController.prototype.animationHandeler = function( timeStamp ) {

        /*var bonusVisibleBox = this._bonusBoxList.filter(function(o){ return o.visible == true; } );

        for( var id in bonusVisibleBox ) {
            if( bonusVisibleBox[id].startTime == 0 ) bonusVisibleBox[id].startTime = new Date().getTime();
            var box = bonusVisibleBox[id].obj.getObj();

            var timeSpent = timeStamp - bonusVisibleBox[id].startTime;
            var animPercentage = Math.round( timeSpent / this.animationTime * 100 )/100;

            if( animPercentage <= 0.5 ) {
                console.log( 'avant', animPercentage, animPercentage*this.variationPix, this.variationPix  )
                box.translateY( animPercentage*this.variationPix )
            } else {
                console.log( 'apres', animPercentage, this.variationPix - (animPercentage*this.variationPix), this.variationPix )
                box.translateY( (animPercentage*this.variationPix) - this.variationPix )
            }

            if( animPercentage >= 1 ) bonusVisibleBox[id].startTime = 0;

        }*/

    }


    return BonusController;

})();
