
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
    function PlayerAvatar( playerOption ) {

        this._playerOption = playerOption;

        this._avatar = new THREE.Object3D();

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

        //transform the color in hex
        this._playerOption.avatar.primaryColor = new THREE.Color( this._playerOption.avatar.primaryColor );
        this._playerOption.avatar.secondaryColor = new THREE.Color( this._playerOption.avatar.secondaryColor );


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

        var sphereGeo = new THREE.SphereGeometry( 25, 32, 16 );
        var sphereMaterial = new THREE.MeshPhongMaterial( {color: this._playerOption.avatar.primaryColor } );
        var sphere = new THREE.Mesh( sphereGeo, sphereMaterial );
        sphere.position.set( 25, 25, 25 );

        this._avatar.add( sphere );
        this._avatar.add( this.axisPaint() );

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

        var axisYGeo = new THREE.CylinderGeometry( 2, 2, 150, 32 );
        var axisYMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
        var axisY = new THREE.Mesh( axisYGeo, axisYMaterial );
        axisY.position.set( 0, 75, 0 );
        //this.scene.add( axisY );


        var axisXGeo = new THREE.CylinderGeometry( 2, 2, 150, 32 );
        var axisXMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
        var axisX = new THREE.Mesh( axisXGeo, axisXMaterial );
        axisX.rotation.z = 90*( Math.PI/180 );
        axisX.position.set( 75, 0, 0 );
        //this.scene.add( axisX );

        var axisZGeo = new THREE.CylinderGeometry( 2, 2, 150, 32 );
        var axisZMaterial = new THREE.MeshBasicMaterial( {color: 0x0000FF} );
        var axisZ = new THREE.Mesh( axisZGeo, axisZMaterial );
        axisZ.rotation.x = 90*( Math.PI/180 );
        axisZ.position.set( 0, 0, 75 );
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
     *
     ******************************/
    PlayerAvatar.prototype.setPos = function( pos ) {

        this._avatar.position.set( pos.x, 0, pos.y );

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
            w: 50,
            d: 50,
            h: 50
        };

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

    return PlayerAvatar;

}(THREE));
