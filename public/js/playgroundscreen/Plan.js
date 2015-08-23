

var Plan = (function() {


    function Plan(elemParents) {

        this.scene;
		this.camera;
        this.cube;
        this.elemParents = elemParents;

        this.references = {
            plane: { w: 1000, h: 20, d: 1000 },
            boxPerLine: 13
        }

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

        this.scene.add( this.axisPaint() );

        this.renderer();
        this.animate();
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
        this.camera.position.set( 0, 1400, 600);
        this.camera.lookAt( new THREE.Vector3( 0, -800, 0 ) );

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
    	light.position.set( 250, 400, -500 );
        light.castShadow = true;
        light.target.position.set( 0, 0, 0 );

    	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
        light2.castShadow = true;
    	light2.position.set( -250, 400, -500 );
        light2.target.position.set( 0, 0, 0 );

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

        // Plane
        var planeGeo = new THREE.PlaneGeometry( 5000, 5000, 32 );
        var planeMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( planeGeo, planeMaterial );
        plane.receiveShadow = true;
        plane.rotation.x = 90*( Math.PI/180 );
        plane.position.set( 0, -20, 0 );
        this.scene.add( plane );

        //Ground
        var groundGroup = new THREE.Object3D();

        var groundGeo = new THREE.BoxGeometry( this.references.plane.w, this.references.plane.h, this.references.plane.d );
        var groundMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        var ground = new THREE.Mesh( groundGeo, groundMaterial );
        ground.castShadow = true;
        ground.receiveShadow = false;
        ground.position.set( this.references.plane.w/2, -this.references.plane.h/2, this.references.plane.d/2 );

        groundGroup.add( ground );
        //this.scene.add( ground );
        
        //Boxes
        var boxWidth = this.references.plane.w/this.references.boxPerLine;
        var boxHeight = this.references.plane.w/this.references.boxPerLine;
        var boxDepth = this.references.plane.d/this.references.boxPerLine;
        var occurences = this.references.boxPerLine*this.references.boxPerLine;
        var boxGeo = new THREE.BoxGeometry( 
            boxWidth
            ,boxHeight
            ,boxDepth
        );
        
        var boxXpos = this.references.plane.d;
        var boxZpos = this.references.plane.w;
        var boxMaterial = new THREE.MeshPhongMaterial( {color: 0x000FFF} );
        var box = new THREE.Mesh( boxGeo, boxMaterial );
        var line = 0;

        for( var i=0; i<occurences; i++ ) {
            
            if( !(i%2) && !(line%2) ) {

                var boxClone = box.clone();
                var boxGroup = new THREE.Object3D().add( boxClone );
                boxClone.position.set( 
                    -(this.references.plane.w/this.references.boxPerLine)/2
                    , (this.references.plane.w/this.references.boxPerLine)/2
                    , -(this.references.plane.d/this.references.boxPerLine)/2  );
                boxGroup.position.set(
                    boxXpos,
                    0,
                    boxZpos
                );

                boxGroup.add( this.axisPaint() );

                groundGroup.add( boxGroup );
            }


            boxXpos -= boxWidth;

            if(boxXpos < boxWidth) {
                line++;
                boxZpos -= boxDepth;
                boxXpos = this.references.plane.w;
            }


        }

        groundGroup.position.set( -this.references.plane.w/2, 0, -this.references.plane.d/2 );

        this.scene.add( groundGroup );
        


    }

    /******************************
     *
     *  axisPaint
     *
     *  paint the axis x,y,z
     *
     *  return Object3D
     *
     ******************************/
    Plan.prototype.axisPaint = function() {

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
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
		this.elemParents.appendChild( this.renderer.domElement );

        this.cameraControls = new THREE.OrbitAndPanControls(this.camera, this.renderer.domElement);
        this.cameraControls.target.set(0,200,0);

    }

    /******************************
     *
     *  animate
     *
     *  lauch the interval
     *
     *  return void
     *
     ******************************/
    Plan.prototype.animate = function() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
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
        this.cameraControls.update();
        this.renderer.render( this.scene, this.camera );

    }


    return Plan;

})(THREE)
