

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
    function Plan(elemParents, game) {

        this.scene;
		this.camera;
        this.cube;
        this.elemParents = elemParents;
        this.game = game;
        this.collisionDetection;

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
        this.collisionDetection = new TwoDBoxCollisionDetectionEngine( this.world.getGroundCoordinates() );
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

        var boxXpos = 0;
        var boxZpos = 0;

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
            boxXpos += boxWidth;

            if(boxXpos >= this.references.world.w - boxWidth) {
                line++;
                boxZpos += boxDepth;
                boxXpos = 0;
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

        var squareTL = { x1 : 0, y1 : 0, x2 : boxWidthX4, y2 : boxDepthX4 };
        var squareTR = { x1 : this.references.world.w - boxWidthX4, y1 : 0, x2 : this.references.world.w, y2 : boxDepthX4 };
        var squareBL = { x1 : 0, y1 : this.references.world.d - boxDepthX4, x2 : boxDepthX4, y2 : this.references.world.d };
        var squareBR = { x1 : this.references.world.w - boxWidthX4, y1 : this.references.world.d - boxWidthX4, x2 : this.references.world.w, y2 : this.references.world.d };

        var squaresStartPos = [ squareTL, squareTR, squareBL, squareBR ];

        for( var i in this.cubesList ) {
            var cubePosition = this.cubesList[i].get2DPosition();

            //undestrutible ? then skip
            if( !this.cubesList[i].destructible ) continue;

            for( var j in squaresStartPos ) {

                if( this.collisionDetection.isColliding( squaresStartPos[j], cubePosition ) ) this.cubesList[i].destroyed();
            }

        }



    }


    /******************************
     *
     *  initPlayers
     *
     *  add player avatar to the scene
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.initPlayers = function() {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;

        var players = this.game.getPlayerList();

        if( Object.keys(players).length < 1 ) throw new Error('the player list is empty');

        for( var playerID in players ) {

            players[ playerID ].playerAvatar = new PlayerAvatar( players[ playerID ].playerOption );
            var avatarMesh = players[ playerID ].playerAvatar.initAvatar();
                avatarMesh.position.x = 75;
                avatarMesh.position.z = 75;
            this.world.addElem( avatarMesh );



        }

    }

    /******************************
     *
     *  addPlayer
     *
     *  add player avatar to the scene
     *
     *  @return {void}
     *
     ******************************/
    Plan.prototype.addPlayer = function( playerController ) {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;

        playerController.playerAvatar = new PlayerAvatar( playerController.playerOption );
        var avatarMesh = playerController.playerAvatar.initAvatar();
            avatarMesh.position.x = 75;
            avatarMesh.position.z = 75;
        this.world.addElem( avatarMesh );

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
     *  updatePlayersPos
     *
     *  update player position
     *  and check fot colision
     *
     ******************************/
    Plan.prototype.updatePlayersPos = function() {

        var players = this.game.getPlayerList();

        if( Object.keys(players).length < 1 ) return ;

        for( var playerID in players ) {
            var avatar = players[ playerID ].playerAvatar;
            var avatarPos = avatar.getPos();
            var newPosition = players[ playerID ].getPlayerTempPosition();

            //same position as before? then skip
            if(
                avatarPos.x == newPosition.x &&
                avatarPos.y == newPosition.y
            ) continue

            avatar.setPos( newPosition );

        }

    }

    /******************************
     *
     *  updatePlayerPos
     *
     *  update player position
     *  and check fot colision
     *
     *  @param {PlayerController}  player  player instance
     *
     *  @return {Boolean}  can return false if same position as before
     *
     ******************************/
    Plan.prototype.updatePlayerPos = function( player ) {
        var avatar = player.playerAvatar;
        var avatarPos = avatar.getPos();
        var avatarSize = avatar.getSize();
        var newPosition = player.getPlayerTempPosition();

            //same position as before? then skip
        if(
            avatarPos.x == newPosition.x &&
            avatarPos.y == newPosition.y
        ) return false;

        var collisionCoodinates = {};
        collisionCoodinates.x1 = newPosition.x;
        collisionCoodinates.x2 = newPosition.x + avatarSize.w;
        collisionCoodinates.y1 = newPosition.y;
        collisionCoodinates.y2 = newPosition.y + avatarSize.d;

        newPosition = this.lookForCollision( collisionCoodinates, newPosition.directionVector );

        avatar.setPos( newPosition );

    }

    /******************************
     *
     *  lookForCollision
     *
     *  loop throught all the collisionable elemParents
     *
     *  @param {Object}  {x1, y1, x2, y2}  position  collisionable Coodinates
     *
     *  @return {Object}  {x, y}  corrected Coodinates
     *
     ******************************/
    Plan.prototype.lookForCollision = function( position, directionVector ) {

        // OOB ?
        if( this.collisionDetection.isOOB( position.x1, position.y1, position.x2, position.y2 ) )
            position = this.collisionDetection.correctedOOB( position.x1, position.y1, position.x2, position.y2 );


        //collison with obeject ?
        for( var objId in this.cubesList ) {

            var cube = this.cubesList[ objId ];

            if( cube.isDestroyed() ) continue;

            var objectCoodinates = cube.get2DPosition();

            position = this.collisionDetection.canceledCollision( position, directionVector, objectCoodinates );


        }

        return {
            x: position.x1,
            y: position.y1
        };

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
        //this.updatePlayersPos();
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
