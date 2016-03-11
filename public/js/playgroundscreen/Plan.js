

var Plan = (function() {

    /**
     *  Plan
     *
     *  @param {HTMLElement}  elemParents
     *
     *  @return {Object}  Plan
     *
     */
    function Plan(elemParents, game) {

        this.scene;
		this.camera;
        this.cube;
        this.elemParents = elemParents;
        this.game = game;
        this.collisionDetection;
        this.bonusController;

        this.references = {
            world: { w: 1000, h: 20, d: 1000 },
            boxPerLine: 13
        }

        this.startPosition = {};

        this.generate();

    }

    /**
     *  generate
     *  init the scene, camera, light2
     *  and all the elements
     *
     *  @return {void}
     *
     */
    Plan.prototype.generate = function() {
        var self = this;

        this.setScene();
        this.setCamera();
        this.setLight();
        this.world = new World( this.scene, this.references.world );
        this.collisionDetection = new TwoDBoxCollisionDetectionEngine( this.world.getGroundCoordinates() );
        this.bombsController = new BombsController( this.world, this.references.world.w/this.references.boxPerLine, this.references.world.d/this.references.boxPerLine, this.references.world.w, this.references.world.d );
        this.boxsController = new BoxsController( this.world, this.references.world.w, this.references.world.d );
        this.letsPaint();
        this.bonusController = new BonusController( this.boxsController.getDestructibleBoxList(), this.world );

        //this.scene.add( this.axisPaint() );

        window.onload = function() {
            self.renderer();
            self.animate();
        }
    }

    /**
     *  setScene
     *
     *  create and set the Scene
     *
     *  @return {void}
     *
     */
    Plan.prototype.setScene = function() {

        this.scene = new THREE.Scene();

    }

    /**
     *  getScene
     *
     *  return (THREE.Scene)  this.scene
     *
     */
    Plan.prototype.getScene = function() {
        return this.scene;
    }


    /**
     *  setCamera
     *
     *  create and set the camera
     *
     *  @return {void}
     *
     */
    Plan.prototype.setCamera = function() {

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.set( 0, 1200, 500);
        this.camera.lookAt( new THREE.Vector3( 0, 0, 50 ) );

    }

    /**
     *  setLight
     *
     *  create and set the light
     *
     *  @return {void}
     *
     */
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

    /**
     *  letsPaint
     *
     *  create elements
     *
     *  @return {void}
     *
     */
    Plan.prototype.letsPaint = function() {


        this.boxsController.generateBox( this.references.boxPerLine );

        this.world.addElem( this.axisPaint() );
        this.scene.add( this.world.getGround() );

        this.setStartPosition();

    }

    /**
     *  setStartPosition
     *
     *  set the 4 corners to
     *  empty cube
     *
     */
    Plan.prototype.setStartPosition = function() {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;
        var boxWidthX4 = boxWidth*2;
        var boxDepthX4 = boxDepth*2;

        var squareTL = [
            { x: 0, y: 0},
            { x: boxWidthX4, y: 0},
            { x: boxWidthX4, y: boxDepthX4 },
            { x: 0, y: boxDepthX4 }
        ];
        var squareTR = [
            { x: this.references.world.w - (boxDepthX4 + 0.1), y: 0 },
            { x: this.references.world.w, y: 0 },
            { x: this.references.world.w, y: boxDepthX4 },
            { x: this.references.world.w - (boxDepthX4 + 0.1), y: boxDepthX4 }
        ];
        var squareBL = [
            { x: 0, y: this.references.world.d - (boxDepthX4 + 0.1) },
            { x: boxDepthX4, y: this.references.world.d - (boxDepthX4 + 0.1) },
            { x: boxDepthX4, y: this.references.world.d },
            { x: 0, y: this.references.world.d }
        ];
        var squareBR = [
            { x: this.references.world.w - (boxDepthX4 + boxDepthX4/2), y: this.references.world.d - (boxDepthX4 + 0.1) },
            { x: this.references.world.w, y: this.references.world.d - (boxDepthX4 + 0.1) },
            { x: this.references.world.w, y: this.references.world.d },
            { x: this.references.world.w - (boxDepthX4 + 0.1), y: this.references.world.d }
        ];

        var squaresStartPos = [ squareTL, squareTR, squareBL, squareBR ];
        var destroyableBox = this.boxsController.getDestructibleBoxList();
        var cubeToDestroy = [];

        for( var i in destroyableBox ) {
            var cubePosition = destroyableBox[i].get2DPosition();

            for( var j in squaresStartPos ) {
                if( this.collisionDetection.isColliding( squaresStartPos[j], cubePosition ) ) {
                    cubeToDestroy.push( destroyableBox[i] );
                }
            }
        }
        this.boxsController.destroyBoxsNoAnim( cubeToDestroy );


        this.startPosition = {
            1: { x: (boxWidth+0.1), y: (this.references.world.d- (boxWidth+0.1)) },
            2: { x: (this.references.world.w- (boxWidth+0.1)), y:  (boxWidth+0.1) },
            3: { x: (this.references.world.w- (boxWidth+0.1)), y: (this.references.world.d- (boxWidth+0.1)) },
            4: { x: (boxWidth+0.1), y: (boxWidth+0.1) }
        }

    }


    /**
     *  initPlayers
     *
     *  add player avatar to the scene
     *
     *  @return {void}
     *
     */
    Plan.prototype.initPlayers = function() {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;

        var players = this.game.getPlayerList();

        if( Object.keys(players).length < 1 ) throw new Error('the player list is empty');

        var foundPosition = false;
        for( var playerID in players ) {
            for( var posId in this.startPosition ) {
                if( !this.startPosition[posId] ) continue;
                else {
                    foundPosition = true;
                    var startPos = this.startPosition[posId];
                    players[ playerID ].initAvatar( startPos.x, startPos.y, this.world );
                    this.startPosition[posId] = false;
                    return false;
                }
            }
        }
        if( !foundPosition ) throw new Error( 'no available start position found' );

    }

    /**
     *  addPlayer
     *
     *  add player avatar to the scene
     *
     *  @return {void}
     *
     */
    Plan.prototype.addPlayer = function( playerController ) {

        var boxWidth = this.references.world.w/this.references.boxPerLine;
        var boxHeight = this.references.world.w/this.references.boxPerLine;
        var boxDepth = this.references.world.d/this.references.boxPerLine;

        playerController.initAvatar( 75, 75, this.world );

    }

    /**
     *  removePlayer
     *
     *  remove player avatar in the scene
     *
     *  @param {PlayerAvatar}  playerAvatar
     *
     *  @return {void}
     *
     */
    Plan.prototype.removePlayer = function( playerAvatar ) {
        this.world.removeElem( playerAvatar.getAvatar() );
    }


    /**
     *  axisPaint
     *
     *  paint the axis x,y,z
     *
     *  @return {THREE.Object3D}
     *
     */
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


    /**
     *  updatePlayerPos
     *
     *  update player position
     *  and check fot colision
     *
     *  @param {PlayerController}  player  player instance
     *
     *  @return {Boolean}  can return false if same position as before
     *
     */
    Plan.prototype.updatePlayerPos = function( player ) {

        var updatedPos = null;

        if( player.isActionBtnActif() ) this.putABomb( player );
        if( !player.isMoveable() ) return false;

        var tempPos = player.getPlayerTempPosition();
        var collisionCoodinates = player.getPlayerTempPosition( tempPos );

        updatedPos = this.lookForCollision( collisionCoodinates, tempPos.directionVector, player.getPlayerPosition(), player );

        player.moveTo( updatedPos, tempPos.directionVector );

    }

    /**
     *  lookForCollision
     *
     *  loop throught all the collisionable elemParents
     *
     *  @param {Object}  collidingPos  collisionable Coodinates shape like [{x:0,y:0}, {x:0,y:0}, etc...]
     *  @param {Object}  directionVector  what direction the player is going, shape like {x:0,y:0}
     *  @param {PlayerController}  player  just need this to kill it !
     *
     *  @return {Object}  {x, y}  corrected Coodinates
     *
     */
    Plan.prototype.lookForCollision = function( collidingPos, directionVector, avatarPos, player ) {

        var newPos = collidingPos;

        // OOB ?
        if( this.collisionDetection.isOOB( collidingPos ) )
            newPos = this.collisionDetection.correctedOOB( collidingPos );

        //collison with object ?
        var boxsList = this.boxsController.getAllVisibleBoxsList();
        for( var objId in boxsList ) {

            var cube = boxsList[ objId ];
            var objectCoodinates = cube.get2DPosition();

            if( !this.collisionDetection.isColliding( newPos, objectCoodinates ) ) continue;

            newPos = this.collisionDetection.canceledCollision( newPos, avatarPos, objectCoodinates );

        }

        //collision with bomb ?
        var bombsList = this.bombsController.getBombsList();
        for( var playerId in bombsList ) {

            var playerBombs = bombsList[ playerId ];

            for( var bombId in playerBombs ) {
                var bombStatus = playerBombs[ bombId ];
                var bomb = bombStatus.bomb;
                var bombCoodinates = bomb.get2DPosition();

                //not exploded ? then normal detection
                if( !bombStatus.isExploded === true ) {

                    //if the avatar just dropped the bomb and is still standing on it
                    if( this.collisionDetection.isColliding( avatarPos, bombCoodinates ) ) continue;
                    //else if the avatar does collid with a bomb
                    if( !this.collisionDetection.isColliding( newPos, bombCoodinates ) ) continue;

                    newPos = this.collisionDetection.canceledCollision( newPos, avatarPos, bombCoodinates );
                }
            }

        }

        //collision with bonus ?
        var visibleBonusList = this.bonusController.getVisibleBonusList();
        for( var i in visibleBonusList ) {
            var bonusBoxObj = visibleBonusList[i];

             if( !this.collisionDetection.isColliding( newPos, bonusBoxObj.obj.get2DPosition() ) ) continue;

            switch( bonusBoxObj.type ) {
                case "bomb":
                    player.plusOneBomb();
                break;
                case "roller":
                    player.moreSpeed();
                break;
                case "flame":
                    player.moreBombPower();
                break;
                default: console.log('no type founded !!', bonusBoxObj.type)
            }

            this.bonusController.gotABonusBox( bonusBoxObj );
        }


        //collision with exploded bomb ?
        var explodedList = this.bombsController.getExplodedList();
        for( var playerId in explodedList ) {

            for( var bombId in explodedList[playerId] ) {
                var explodedBomb = explodedList[playerId][bombId];
                var horizontalCoor = explodedBomb.horizontalCoor;
                var verticalCoor =  explodedBomb.verticalCoor;
                if(
                    this.collisionDetection.isColliding( newPos, horizontalCoor ) ||
                    this.collisionDetection.isColliding( newPos, verticalCoor )
                ) {
                    player.iAmDead();
                    this.game.youAreDead( player.id );
                }

            }
        }


        return {
            x: newPos[0].x,
            y: newPos[0].y
        };

    }

    /**
     *  putABomb
     *
     *  check if the player can use a bomb
     *
     *  @param {PlayerController}  player  player instance
     *
     */
    Plan.prototype.putABomb = function( player ) {

        //check if player didn't use all his bomb
        var playerBomb = player.getBomb();
        if( playerBomb+1 > player.getMaxBomb() ) return false;

        var playerPos = [];
        playerPos[0] = player.playerAvatar.getPointPosition();
        playerPos[1] = player.playerAvatar.getPointPosition();
        playerPos[2] = player.playerAvatar.getPointPosition();
        playerPos[3] = player.playerAvatar.getPointPosition();

        var position = null;
        var size = null;

        //need to find the cube where the player stand
        //because that is where we are gonna put the bomb
        var boxsList = this.boxsController.getUnvisibleBoxsList();

        for( var cubeId in boxsList ) {

            var cube = boxsList[cubeId];

            var cubePosition = cube.get2DPosition();

            if( this.collisionDetection.isColliding( playerPos, cubePosition ) ) {
                position = cubePosition;
                size = cube.size;
                break;
            }

        }

        if( null === position || !position ) {
            throw new Error( 'there is no place to put the bomb' );
            return false;
        }

        var succed = this.bombsController.newBomb( position, size, player.getBombPower(), player.id );
        if( succed )  player.setBomb( playerBomb+1 );

    }

    /**
     *  exoplodedBombHandeler
     *
     *  @param {Object}  bombExploded  all the info about the bomb
     *
     *  return {void}
     *
     */
    Plan.prototype.exoplodedBombHandeler = function( bombExploded ) {
        var playerId = bombExploded.userId;
        var bombId = bombExploded.id;

        var player = this.game.getaPlayerById( playerId );
        if( !player ){
            //throw new Error( 'cannot find the player in the player list' );
        }

        //check and correct OOB
        if( this.collisionDetection.isOOB( bombExploded.horizontalCoor ) )
            bombExploded.horizontalCoor = this.collisionDetection.correctedOOB(bombExploded.horizontalCoor);
        if( this.collisionDetection.isOOB( bombExploded.verticalCoor ) )
            bombExploded.verticalCoor = this.collisionDetection.correctedOOB(bombExploded.verticalCoor);

        //check for collision with block
        var allVisibleBox = this.boxsController.getAllVisibleBoxsList();
        var willExplodeBox = {
            x: new Array(),
            y: new Array(),
            id: -1
        };

        for( var boxId in allVisibleBox ) {
            var box = allVisibleBox[boxId];
            var boxCoord = box.get2DPosition();
            var axis = false;
            var side = false;


            //x collision
            if( this.collisionDetection.isColliding( boxCoord, bombExploded.horizontalCoor ) ) {
                axis = 'x';
                if( boxCoord[1].x <= bombExploded.position[0].x ) {
                    side = 0;
                    bombExploded.horizontalCoor[0].x = boxCoord[1].x-0.1;
                    bombExploded.horizontalCoor[3].x = boxCoord[1].x-0.1;
                } else {
                    side = 1;
                    bombExploded.horizontalCoor[1].x = boxCoord[1].x-0.1;
                    bombExploded.horizontalCoor[2].x = boxCoord[1].x-0.1;
                }

            //y collision
            } else if( this.collisionDetection.isColliding( boxCoord, bombExploded.verticalCoor ) ) {
                axis = 'y';
                if( boxCoord[2].y <= bombExploded.position[0].y ) {
                    side = 0;
                    bombExploded.verticalCoor[0].y = boxCoord[0].y-0.1;
                    bombExploded.verticalCoor[1].y = boxCoord[0].y-0.1;
                } else {
                    side = 1;
                    bombExploded.verticalCoor[2].y = boxCoord[2].y-0.1;
                    bombExploded.verticalCoor[3].y = boxCoord[2].y-0.1;
                }
            }

            //box need to be destroy ?
            if( false !== axis ) {
                var posIndex = side === 0 ? 2 : 0;
                if(
                    !(side in willExplodeBox[axis]) ||
                    ( (posIndex === 2 &&  willExplodeBox[axis][side].get2DPosition()[posIndex][axis] < boxCoord[posIndex][axis]) ||
                      (posIndex === 0 &&  willExplodeBox[axis][side].get2DPosition()[posIndex][axis] > boxCoord[posIndex][axis]) )
                ) {
                    if( box.isDestructible() ) {
                        willExplodeBox[axis][side] = box;
                        willExplodeBoxid = this.boxsController.getDestructibleBoxId( box );
                    }
                    else delete willExplodeBox[axis][side];
                }
            }

        }//end for( var boxId in allVisibleBox )

        for( var axis in willExplodeBox ) {
            for( var side in willExplodeBox[axis] ) {
                var boxId = this.boxsController.getDestructibleBoxId( willExplodeBox[axis][side] );
                var callBack = false;

                if( this.bonusController.isBoxABonus( boxId ) ) {
                    this.bonusController.transformToBonusBox( willExplodeBox[axis][side], boxId );
                }
                this.boxsController.destroyBoxNoAnim( willExplodeBox[axis][side] );
            }
        }

        //check for collision with bomb
        this.bombsController.checkBombCollision( bombExploded );

        //ask to display the explosion animation with the new coordinates
        this.bombsController.drawEpxlodedBomb( bombExploded );

        //check for collision with player
        var players = this.game.getPlayerList();
        for( var pId in players ) {
            var deadPlayer = players[pId];
            var playerCoord = deadPlayer.playerAvatar.get2Dposition();
            if( this.collisionDetection.isColliding( playerCoord, bombExploded.verticalCoor ) ||
                this.collisionDetection.isColliding( playerCoord, bombExploded.horizontalCoor )
            ) {
                deadPlayer.iAmDead();
                this.game.youAreDead( deadPlayer.id );
            }
        }

        //check if the player already die
        if( !this.game.getaPlayerById( playerId ) ) return false;

        //remove the bomb from the player profile
        var bombNbr = player.getBomb() -1;
        bombNbr = bombNbr < 0 ? 0 : bombNbr;
        player.setBomb( bombNbr );
    }



    /**
     *  renderer
     *
     *  set the canvas
     *
     *  return {void}
     *
     */
    Plan.prototype.renderer = function() {

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0xf0f0f0 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
		this.elemParents.appendChild( this.renderer.domElement );

        this.cameraControls = new THREE.OrbitAndPanControls( this.camera, this.renderer.domElement );
        //this.cameraControls.target.set( -(this.references.world.w/2 - (5*75) ), 25, -(this.references.world.w/2 - 75));
        this.cameraControls.target.set( 0, 0, 50);

    }

    /**
     *  animate
     *
     *  lauch the interval
     *
     *  return {void}
     *
     */
    Plan.prototype.animate = function() {
        var timeStamp = new Date().getTime();
        var self = this;
        //this.updatePlayersPos();

        //deal with playerBomb
        this.bombsController.animationHandeler( timeStamp, this.exoplodedBombHandeler.bind(this) );
        this.bonusController.animationHandeler( timeStamp );

        this.render();
        window.requestAnimationFrame( this.animate.bind(this) );
    }

    /**
     *  render
     *
     *  render the scene
     *
     *  return {void}
     *
     */
    Plan.prototype.render = function() {
        this.cameraControls.update();
        this.renderer.render( this.scene, this.camera );
    }


    return Plan;

})(THREE)
