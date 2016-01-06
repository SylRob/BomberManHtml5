var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};



var BonusBox = (function(_super) {
    /**
     *  __extends
     *
     *  inherit from Box object
     *
     */
    __extends(BonusBox, _super);

    /**
     *  BonusBox
     *
     *  BonusBox take a type arguments
     *
     */
    function BonusBox() {
        //check that we got correct/existing type
        var bonusType = arguments[arguments.length-1];
        if( typeof bonusType != "string" ) throw new Error("Bonus box type must be a string");

        this.boxTypeImage = {
            'bomb' : 'img/ico_bomb01.svg',
            'roller' : 'img/ico_roller01.svg',
            'flamme' : 'img/ico_flamme01.svg'
        }

        if( !this.boxTypeImage[bonusType] ) throw new Error("Bonus box type does not exist");

        this.image = this.boxTypeImage[bonusType];

        _super.apply(this, arguments);
    }

    /**
     *  init
     *
     *  create elements
     *
     *  @return {void}
     *
     */
    BonusBox.prototype.init = function() {

        var boxGeo = new THREE.BoxGeometry(
            this.size.w,
            this.size.h,
            this.size.d
        );

        var myTexture = THREE.ImageUtils.loadTexture(this.image);
        myTexture.minFilter = THREE.LinearFilter;

        var boxMaterial = new THREE.MeshPhongMaterial( { map: myTexture, transparent: true, opacity: 1 } );
        this.mesh.geometry = boxGeo;
        this.mesh.material = boxMaterial;
        this.mesh.position.set( this.size.w/2, this.size.h/2, this.size.d/2 );

        this.obj.add( this.mesh );

    }


    return BonusBox;
}(Box));
