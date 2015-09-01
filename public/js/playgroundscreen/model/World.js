var World = (function() {

    function World( scene, setup ) {
        this.scene = scene;
        this.groundGroup = new THREE.Object3D();
        this.setup = setup;

        this.init();
    }

    /******************************
     *
     *  init
     *
     *  create elements
     *
     *  @return {void}
     *
     ******************************/
    World.prototype.init = function() {

        // Plane
        var planeGeo = new THREE.PlaneGeometry( 5000, 5000, 32 );
        var planeMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( planeGeo, planeMaterial );
        plane.receiveShadow = true;
        plane.rotation.x = 90*( Math.PI/180 );
        plane.position.set( 0, -20, 0 );
        this.scene.add( plane );

        //Ground
        var groundGeo = new THREE.BoxGeometry( this.setup.w, this.setup.h, this.setup.d );
        var groundMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        var ground = new THREE.Mesh( groundGeo, groundMaterial );
        ground.castShadow = true;
        ground.receiveShadow = false;
        ground.position.set( this.setup.w/2, -this.setup.h/2, this.setup.d/2 );

        this.groundGroup.add( ground );

        this.groundGroup.position.set( -this.setup.w/2, 0, -this.setup.d/2 );

    }

    /******************************
     *
     *  getGround
     *
     *  get ground Object
     *
     *  @return {THREE.Object3D}
     *
     ******************************/
    World.prototype.getGround = function(){
        return this.groundGroup;
    }

    /******************************
     *
     *  addElem
     *
     *  add Object to the ground object3D
     *
     *  @param {THREE.Object3D}  object3D
     *
     ******************************/
    World.prototype.addElem = function( object3D ){

        this.groundGroup.add( object3D );

    }

    /******************************
     *
     *  removeElem
     *
     *  add Object to the ground object3D
     *
     *  @param {THREE.Object3D}  object3D
     *
     ******************************/
    World.prototype.removeElem = function( object3D ){

        this.groundGroup.remove( object3D );

    }

    return World;
})(THREE);
