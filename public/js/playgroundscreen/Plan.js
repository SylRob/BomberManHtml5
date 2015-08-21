

var Plan = (function() {


    function Plan(elemParents) {

        this.scene;
		this.camera;
        this.cube;
        this.elemParents = elemParents;

        this.generate();

    }

    /******************************
     *
     *  generate
     *  init the scene, camera, light2
     *  and all the elements
     *
     *  return void
     *
     ******************************/
    Plan.prototype.generate = function() {
        var _this = this;


        this.setScene();
        this.setCamera();
        this.setLight();
        this.letsPaint();
        this.renderer();
        this.render();
    }

    /******************************
     *
     *  setScene
     *
     *  create and set the Scene
     *
     *  return void
     *
     ******************************/
    Plan.prototype.setScene = function() {

        this.scene = new THREE.Scene();

    }

    /******************************
     *
     *  getScene
     *
     *  return (THREE.Scene()) this.scene
     *
     ******************************/
    Plan.prototype.getScene = function() {
        return this.scene;
    }


    /******************************
     *
     *  setCamera
     *
     *  create and set the camera
     *
     *  return void
     *
     ******************************/
    Plan.prototype.setCamera = function() {

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.set(250, 400, 650);
        this.camera.lookAt( new THREE.Vector3(0 ,0, 0) );

    }

    /******************************
     *
     *  setLight
     *
     *  create and set the light
     *
     *  return void
     *
     ******************************/
    Plan.prototype.setLight = function() {

        var ambientLight = new THREE.AmbientLight( 0x222222 );
        var light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
    	light.position.set( 200, 400, 500 );
    	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
    	light2.position.set( 0, 1, 0 );

    	this.scene.add(ambientLight);
    	this.scene.add(light);
    	this.scene.add(light2);

    }

    /******************************
     *
     *  letsPaint
     *
     *  create elements
     *
     *  return void
     *
     ******************************/
    Plan.prototype.letsPaint = function() {

        var groundGeo = new THREE.BoxGeometry( 500, 20, 500 );
        var groundMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

        var ground = new THREE.Mesh( groundGeo, groundMaterial );
        ground.position = new THREE.Vector3( 0, 0, 0 );

        this.scene.add( ground );

    }


    /******************************
     *
     *  renderer
     *
     *  set the canvas
     *
     *  return void
     *
     ******************************/
    Plan.prototype.renderer = function() {

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0xf0f0f0 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.elemParents.appendChild( this.renderer.domElement );

    }

    /******************************
     *
     *  render
     *
     *  render the scene
     *
     *  return void
     *
     ******************************/
    Plan.prototype.render = function() {

        this.renderer.render( this.scene, this.camera );

    }


    return Plan;

})(THREE)
