
var PlayerAvatar = (function() {

    /******************************
     *
     *  PlayerAvatar
     *
     *  @param {Oject}  palyerOption  various player option (name, color, etc...)
     *
     *  @return {Object}  PlayerAvatar
     *
     ******************************/
    function PlayerAvatar( playerOption, yPos ) {

        this._playerOption = playerOption;

        this._avatar = new THREE.Object3D();

        this.yPos = yPos;

        this._body = {
            all: new THREE.Object3D(),
            head: new THREE.Mesh(),
            corps: new THREE.Mesh(),
            foot: {
                left: new THREE.Mesh(),
                right: new THREE.Mesh()
            },
            hands: {
                left: new THREE.Mesh(),
                right: new THREE.Mesh()
            }
        }

        this.init();

    }

    /******************************
     *
     *  init
     *
     *  create and return a new avatar
     *
     *  @return {void}
     *
     ******************************/
    PlayerAvatar.prototype.init = function() {
        var self = this;
        //transform the color in hex
        this._playerOption.avatar.primaryColor = new THREE.Color( this._playerOption.avatar.primaryColor );
        this._playerOption.avatar.secondaryColor = new THREE.Color( this._playerOption.avatar.secondaryColor );

        this.step = 0;

    }

    /******************************
     *
     *  initAvatar
     *
     *  create a new avatar
     *
     *  @return {THREE.Mesh}
     *
     ******************************/
    PlayerAvatar.prototype.initAvatar = function() {

        var troncGeo = new THREE.SphereGeometry( 20, 32, 16 );
        var troncMaterial = new THREE.MeshPhongMaterial( {color: this._playerOption.avatar.primaryColor } );
        this._body.corps.geometry = troncGeo;
        this._body.corps.material = troncMaterial;
        this._body.corps.position.set( 0, 10, 0 );
        this._body.all.add( this._body.corps );


        var headGeo = new THREE.SphereGeometry( 25, 32, 16 );
        var headMaterial = new THREE.MeshPhongMaterial( {color: this._playerOption.avatar.primaryColor } );
        this._body.head.geometry = headGeo;
        this._body.head.material = headMaterial;
        this._body.head.position.set( 0, 50, 0 );
        this._body.all.add( this._body.head );

        var handsGeo = new THREE.SphereGeometry( 7, 32, 16 );
        var handsMaterial = new THREE.MeshPhongMaterial( {color: this._playerOption.avatar.primaryColor } );
        this._body.hands.right.geometry = handsGeo;
        this._body.hands.right.material = headMaterial;
        this._body.hands.right.position.set( 0, 10, 25 );
        this._body.all.add( this._body.hands.right );

        this._body.hands.left.geometry = handsGeo;
        this._body.hands.left.material = headMaterial;
        this._body.hands.left.position.set( 0, 10, -25 );
        this._body.all.add( this._body.hands.left );

        var footGeo = new THREE.SphereGeometry(7, 4, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        var footMaterial = new THREE.MeshPhongMaterial( {color: this._playerOption.avatar.primaryColor } );
        this._body.foot.left.geometry = footGeo;
        this._body.foot.left.material = footMaterial;
        this._body.foot.left.position.set( 0, -20, -10 );
        this._body.all.add( this._body.foot.left );

        this._body.foot.right.geometry = footGeo;
        this._body.foot.right.material = footMaterial;
        this._body.foot.right.position.set( 0, -20, 10 );
        this._body.all.add( this._body.foot.right );

        this._body.all.position.set( 35, 0, 35 );
        this._avatar.add(this._body.all);

        this._body.all.add( this.axisPaint() );

        //this._avatar.add( this.axisPaint() );
        return this._avatar;

    }

    /******************************
     *
     *  axisPaint
     *
     *  paint the axis x,y,z
     *
     *  @return {Object3D}
     *
     ******************************/
    PlayerAvatar.prototype.axisPaint = function() {

        var axisYGeo = new THREE.CylinderGeometry( 2, 2, 50, 32 );
        var axisYMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
        var axisY = new THREE.Mesh( axisYGeo, axisYMaterial );
        axisY.position.set( 0, 25, 0 );
        //this.scene.add( axisY );


        var axisXGeo = new THREE.CylinderGeometry( 2, 2, 50, 32 );
        var axisXMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
        var axisX = new THREE.Mesh( axisXGeo, axisXMaterial );
        axisX.rotation.z = 90*( Math.PI/180 );
        axisX.position.set( 25, 0, 0 );
        //this.scene.add( axisX );

        var axisZGeo = new THREE.CylinderGeometry( 2, 2, 50, 32 );
        var axisZMaterial = new THREE.MeshBasicMaterial( {color: 0x0000FF} );
        var axisZ = new THREE.Mesh( axisZGeo, axisZMaterial );
        axisZ.rotation.x = 90*( Math.PI/180 );
        axisZ.position.set( 0, 0, 25 );
        //this.scene.add( axisZ );

        var axisGroup = new THREE.Object3D();
        axisGroup.add( axisY );
        axisGroup.add( axisX );
        axisGroup.add( axisZ );

        return axisGroup;

    }

    /******************************
     *
     *  getPos
     *
     *  @return {Object}  with x and y
     *
     ******************************/
    PlayerAvatar.prototype.getPos = function() {

        return {
            x: this._avatar.position.x,
            y: this._avatar.position.z
        };

    }

    /******************************
     *
     *  setPos
     *
     *  @param {Object}  pos  with x and y
     *  @param {Object}  directionVector  with x and y
     *
     ******************************/
    PlayerAvatar.prototype.setPos = function( pos, directionVector ) {

        this._avatar.position.set( pos.x, this.yPos, pos.y );

        this.animateAvatar( pos.x, pos.y, directionVector );

    }

    /******************************
     *
     *  animateAvatar
     *
     *  @param {int}  posX
     *  @param {int}  posY
     *
     ******************************/
    PlayerAvatar.prototype.animateAvatar = function( x, y, directionVector ) {

        this.step += 1 / 1.25;
        this._body.foot.left.position.setX( (Math.sin(this.step) * 16));
        this._body.foot.right.position.setX( (Math.cos(this.step + (Math.PI / 2)) * 16));
        this._body.hands.left.position.setX( (Math.cos(this.step + (Math.PI / 2)) * 16));
        this._body.hands.right.position.setX( (Math.sin(this.step) * 16));

        this._body.all.rotation.y = Math.atan2( directionVector.y, directionVector.x ) * -1;
        this._body.all.rotation.z = -20 * Math.PI / 180;

    }

    /******************************
     *
     *  resetPos
     *
     ******************************/
    PlayerAvatar.prototype.resetPos = function() {

        if( this._body.all.rotation.z === 0 ) return false;

        this._body.foot.left.position.setX( 0 );
        this._body.foot.right.position.setX( 0 );
        this._body.hands.left.position.setX( 0 );
        this._body.hands.right.position.setX( 0 );

        this._body.all.rotation.z = 0;

    }

    /******************************
     *
     *  get2Dposition
     *
     *  @return {Object}  with the 4 square corner coordinates
     *
     ******************************/
    PlayerAvatar.prototype.get2Dposition = function() {
        var size = this.getSize();

        return [
            { x: this._avatar.position.x, y: this._avatar.position.z },
            { x: this._avatar.position.x + size.w, y: this._avatar.position.z },
            { x: this._avatar.position.x + size.w, y: this._avatar.position.z + size.d },
            { x: this._avatar.position.x, y: this._avatar.position.z + size.d }
        ];

    }

    /******************************
     *
     *  getPointPosition
     *
     *  return the center of the avatar
     *
     *  @return {Object}  x and y
     *
     ******************************/
    PlayerAvatar.prototype.getPointPosition = function() {
        var size = this.getSize();

        return {
            x: ( this._avatar.position.x < 0 ? this._avatar.position.x - size.w/2 : this._avatar.position.x + size.w/2 ),
            y: ( this._avatar.position.z < 0 ? this._avatar.position.z - size.d/2 : this._avatar.position.z + size.d/2 )
        }

    }

    /******************************
     *
     *  getSize
     *
     *  @return {Object}  with w and h and d
     *
     ******************************/
    PlayerAvatar.prototype.getSize = function() {

        return {
            w: 60,
            d: 60,
            h: 60
        };

    }


    /******************************
     *
     *  get2DpositionFromTemp
     *
     *  @param {Object}  tempPos  pos with x and y
     *
     *  @return {Object}  with the 4 square corner coordinates
     *
     ******************************/
    PlayerAvatar.prototype.get2DpositionFromTemp = function( tempPos ) {

        var size = this.getSize();

        return [
            { x: tempPos.x, y: tempPos.y },
            { x: tempPos.x + size.w, y: tempPos.y },
            { x: tempPos.x + size.w, y: tempPos.y + size.d },
            { x: tempPos.x, y: tempPos.y + size.d }
        ];

    }

    /******************************
     *
     *  getAvatar
     *
     *  @return {THREE.Object3D}
     *
     ******************************/
    PlayerAvatar.prototype.getAvatar = function() {

        return this._avatar;

    }

    /******************************
     *
     *  dyingAvatarAnimation
     *
     *  @param {function}  callBack  callBack animation
     *
     ******************************/
    PlayerAvatar.prototype.dyingAvatarAnimation = function(callBack) {
        this.resetPos();

        callBack();
    }

    return PlayerAvatar;

}(THREE));
