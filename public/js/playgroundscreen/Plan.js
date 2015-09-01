

var Plan = (function() {

    /******************************
     *
     *  Plan
     *
     *  @param {HTMLElement}  elemParents
     *
     *  @return {Object}  Plan
     *
     ******************************/
    function Plan(elemParents) {

        this.scene;
		this.camera;
        this.cube;
        this.elemParents = elemParents;

        this.references = {
            world: { w: 1000, h: 20, d: 1000 },
            boxPerLine: 13
        }
        this.cubesList = [];

        this.generate();

    }

    /******************************
     *
     *  generate
     *  init the scene, camera, light2
     *  and all the elements
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.generate = function() {
        var _this = this;

        this.setScene();
        this.setCamera();
        this.setLight();
        this.world = new World( this.scene, this.references.world );
        this.letsPaint();

        //this.scene.add( this.axisPaint() );

        this.renderer();
        this.animate();
    }

    /******************************
     *
     *  setScene
     *
     *  create and set the Scene
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.setScene = function() {

        this.scene = new THREE.Scene();

    }

    /******************************
     *
     *  getScene
     *
     *  return (THREE.Scene)  this.scene
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
     *  @return {void}
     *
     ******************************/
    Plan.prototype.setCamera = function() {

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.set( 0, 1200, 500);
        this.camera.lookAt( new THREE.Vector3( 0, 0, 100 ) );

    }

    /******************************
     *
     *  setLight
     *
     *  create and set the light
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.setLight = function() {

        var ambientLight = new THREE.AmbientLight( 0x222222 );
        var light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
    	light.position.set( -250, 400, -500 );
        light.castShadow = true;
        light.target.position.set( 0, 0, 0 );

    	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
        light2.castShadow = true;
    	light2.position.set( 250, 400, 500 );
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
     *  @return {void}
     *
     ******************************/
    Plan.prototype.letsPaint = function() {

        //Boxes
        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;
        var occurences = this.references.boxPerLine*this.references.boxPerLine;

        var boxXpos = this.references.world.d;
        var boxZpos = this.references.world.w;

        var line = 0;

        for( var i=0; i<occurences; i++ ) {
            // not destructible
            if( !(i%2) && !(line%2) ) {
                var box = new Box( boxWidth, boxHeight, boxDepth, 0x000FFF, false );
                box.getObj().position.set(
                    boxXpos,
                    0,
                    boxZpos
                );
                //box.getObj().add( this.axisPaint() )
                //push the cube in the list to remember it
                this.cubesList.push( box );

            } else {
            // destructible
                var box = new Box( boxWidth, boxHeight, boxDepth, 0x8A2BE2, true );
                box.getObj().position.set(
                    boxXpos,
                    0,
                    boxZpos
                );
                this.cubesList.push( box );
            }

            this.world.addElem( box.getObj() );
            boxXpos -= boxWidth;

            if(boxXpos < boxWidth) {
                line++;
                boxZpos -= boxDepth;
                boxXpos = this.references.world.w;
            }
        }

        this.world.addElem( this.axisPaint() );
        this.scene.add( this.world.getGround() );

        this.setStartPosition();

    }

    /******************************
     *
     *  setStartPosition
     *
     *  set the 4 corners to
     *  empty cube
     *
     *
     ******************************/
    Plan.prototype.setStartPosition = function() {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;
        var boxWidthX4 = boxWidth*4;
        var boxDepthX4 = boxDepth*4;

        var squareGeo = new THREE.BoxGeometry( boxWidth*4-20, boxDepth*4-20, 1 );
        var squareMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var squareMesh = new THREE.Mesh( squareGeo, squareMaterial );
        squareMesh.rotation.x = 90*(Math.PI/180);
        squareMesh.position.set( boxWidthX4/2, 0, boxDepthX4/2 );

        var squareTL = new THREE.Object3D().add( squareMesh );
        squareTL.position.set( 0, 2, 0 );
        this.world.addElem( squareTL );

        var squareTR = new THREE.Object3D().add( squareMesh.clone() );
        squareTR.position.set( this.references.world.w - boxWidthX4, 2, 0 );
        this.world.addElem( squareTR );

        var squareBL = new THREE.Object3D().add( squareMesh.clone() );
        //var squareBL = squareMesh.clone();
        squareBL.position.set( 0, 50, this.references.world.d - boxDepthX4 );
        this.world.addElem( squareBL );

        var squareBR = new THREE.Object3D().add( squareMesh.clone() );
        squareBR.position.set( this.references.world.w - boxWidthX4, 2, this.references.world.d - boxDepthX4 );
        this.world.addElem( squareBR );


        //colision detection
        var caster = new THREE.Raycaster();
        var collisions = [];

        var rays = [
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(1, 0, 1),
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(1, 0, -1),
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(-1, 0, -1),
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(-1, 0, 1)
        ];

        var ln = squareBL.children[0].geometry.vertices.length;



        for(var i = 0; i < ln; i++){
            var pr_vertex = squareBL.children[0].geometry.vertices[i].clone();
            var gl_vertex = pr_vertex.applyMatrix4(squareBL.matrix);
            var dr_vector = gl_vertex.sub(squareBL.position);

            var ray = new THREE.Raycaster(squareBL.position, dr_vector.clone().normalize());

            for( var boxId in this.cubesList ) {
                var boxObj = this.cubesList[boxId];

                boxObj.getObj().updateMatrixWorld();

                /*var vector = new THREE.Vector3();
                vector.setFromMatrixPosition( boxObj.getObj().children[0].matrixWorld );*/
                var intersects = ray.intersectObject(boxObj.getObj(), true);


                //if there is intersection
                if( intersects.length > 0 ){
                    boxObj.getObj().children[0].material.opacity = 0;
                    console.log( boxObj.getObj().position, ray );
                } else console.log( 'no collisions???' )

            }

        }

        /*for ( var i = 0; i < rays.length; i += 1 ) {
            caster.set( squareTL.position, rays[i] );

            for( var boxId in this.cubesList ) {
                var boxObj = this.cubesList[boxId];

                boxObj.getObj().children[0].geometry.computeFaceNormals();
                var ln = boxObj.getObj().children[0].geometry.vertices.length;

                collisions = caster.intersectObject( boxObj.getObj(), true );

                if ( collisions.length ) {
                    console.log(collisions);
                } else console.log("no colision");
            }

        }*/


    }


    /******************************
     *
     *  lookForCollision
     *
     *  loop throught all the collisionable elemParents
     *
     *  @param {THREE.Object3D}  playerAvatar
     *
     ******************************/
    Plan.prototype.lookForCollision = function( playerAvatar ) {

        //colision detection
        var ln = playerAvatar.children[0].geometry.vertices.length;

        for(var i = 0; i < ln; i++){
            var pr_vertex = playerAvatar.children[0].geometry.vertices[i].clone();
            var gl_vertex = pr_vertex.applyMatrix4(playerAvatar.matrix);
            var dr_vector = gl_vertex.sub(playerAvatar.position);

            var ray = new THREE.Raycaster(playerAvatar.position, dr_vector.clone().normalize());

            for( var boxId in this.cubesList ) {
                var boxObj = this.cubesList[boxId];

                boxObj.getObj().updateMatrixWorld();

                /*var vector = new THREE.Vector3();
                vector.setFromMatrixPosition( boxObj.getObj().children[0].matrixWorld );*/
                var intersects = ray.intersectObject(boxObj.getObj(), true);


                //if there is intersection
                if( intersects.length > 0 ){
                    boxObj.getObj().children[0].material.opacity = 0;
                    console.log( boxObj.getObj().position, ray );
                    break;
                } else console.log( 'no collisions???' )

            }

        }

    }

    /******************************
     *
     *  initPlayer
     *
     *  add player avatar to the scene
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.initPlayer = function( playerAvatar ) {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;

        playerAvatar.position.set( boxWidth, 0, boxDepth );

        this.world.addElem( playerAvatar );

    }

    /******************************
     *
     *  axisPaint
     *
     *  paint the axis x,y,z
     *
     *  @return {THREE.Object3D}
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
     *  return {void}
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

        this.cameraControls = new THREE.OrbitAndPanControls( this.camera, this.renderer.domElement );
        this.cameraControls.target.set( 0, 0, 50);

    }

    /******************************
     *
     *  animate
     *
     *  lauch the interval
     *
     *  return {void}
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
     *  return {void}
     *
     ******************************/
    Plan.prototype.render = function() {
        this.cameraControls.update();
        this.renderer.render( this.scene, this.camera );
    }


    return Plan;

})(THREE)
