var World = (function() {

    function World( scene, setup ) {
        this.scene = scene;
        this.groundGroup = new THREE.Object3D();
        this.setup = setup;

        this.init();
    }

    /**
     *  init
     *
     *  create elements
     *
     *  @return {void}
     *
     */
    World.prototype.init = function() {

        // Plane
        var planeGeo = new THREE.PlaneBufferGeometry( 5000, 5000, 32 );
        var planeMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( planeGeo, planeMaterial );
        plane.receiveShadow = true;
        plane.rotation.x = 90*( Math.PI/180 );
        plane.position.set( 0, -20, 0 );
        this.scene.add( plane );

        //Ground

        var texture = THREE.ImageUtils.loadTexture( "img/buldwarehouseroofV02.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( Math.round(this.setup.w/256), Math.round(this.setup.w/256) );

        var groundGeo = new THREE.BoxGeometry( this.setup.w, this.setup.h, this.setup.d );
        var groundMaterial = new THREE.MeshPhongMaterial( { map: texture } );
        var ground = new THREE.Mesh( groundGeo, groundMaterial );
        ground.castShadow = true;
        ground.receiveShadow = false;
        ground.position.set( this.setup.w/2, -this.setup.h/2, this.setup.d/2 );

        this.groundGroup.add( ground );

        this.groundGroup.position.set( -this.setup.w/2, 0, -this.setup.d/2 );

    }

    /**
     *  getGround
     *
     *  get ground Object
     *
     *  @return {THREE.Object3D}
     *
     */
    World.prototype.getGround = function(){
        return this.groundGroup;
    }

    /**
     *  getGroundCoordinates
     *
     *  get ground coordiantes( normaly from 0 to size )
     *
     *  @return {Object}  { x1, y1, x2, y2 }
     *
     */
    World.prototype.getGroundCoordinates = function(){

        return {
            x1: 0,
            y1: 0,
            x2: this.setup.w,
            y2: this.setup.d
        }

    }

    /**
     *  addElem
     *
     *  add Object to the ground object3D
     *
     *  @param {THREE.Object3D}  object3D
     *
     */
    World.prototype.addElem = function( object3D ){

        this.groundGroup.add( object3D );

    }

    /**
     *  removeElem
     *
     *  add Object to the ground object3D
     *
     *  @param {THREE.Object3D}  object3D
     *
     */
    World.prototype.removeElem = function( object3D ){

        this.groundGroup.remove( object3D );

    }

    return World;
})(THREE);
