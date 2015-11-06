var BonusController = (function() {

    function BonusController( boxsList, world ) {

        this._world = world;
        this._bonusBoxList = new Array();

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

        var duplicateArray = JSON.parse(JSON.stringify(boxsList));//unrelated copy

        //setFlame
        for( var bonusName in this._bonusElem ) {

            var occurence = this._bonusElem[bonusName].total;

            for( var i=0; i < occurence; i++ ) {

                var randBlock = duplicateArray[Math.floor(Math.random()*(duplicateArray.length -1))];
                duplicateArray.splice( duplicateArray.indexOf( randBlock ) , 1 );

                /*console.log( randBlock );

                var bonusBlock = {
                    name: bonusName,
                    visible: false,
                    position: randBlock.get2DPosition()
                }

                this._bonusBoxList.push( bonusBlock );*/

            }

        }

        //console.log( this._bonusBoxList );

    }

    /**
     *   isBoxABonus
     *
     *   check if the destroyed box need to be transform
     *   in a bonus box
     *
     *   @param {Object}  box
     *
     */
    BonusController.prototype.isBoxABonus = function( box ) {

        console.log( 'check if its a bonus box and then transform' );

    }

    /**
     *   transformToBonusBox
     *
     *   @param {Object}  box
     *
     */
    BonusController.prototype.transformToBonusBox = function( box ) {

        console.log( 'check if its a bonus box and then transform' );

    }


    return BonusController;

})();
