

var GamePad = (function() {

    /******************************
     *
     *  GamePad
     *
     *  @param {HTMLElement}  elem  where to create the GamePad
     *  @param {Object.Player}  Player  the player infos
     *
     *  @return {Object} GamePad
     *
     ******************************/
    function GamePad(elem, Player) {

        this.player = Player;
        this.elem = elem;
        this.canvas;
        this.directionPadObj = {
            id: -1,
            initialPos: { x: 0, y: 0 },
            nowPos: { x: 0, y: 0 },
            r: 90,
            r2: 30,
            strokeWidth: 10,
            strokeWidth2: 3,
            color: this.player.avatar.primaryColor,
            direction: 0,
            velocity: 0
        }
        this.actionBtnObj = {
            id: -1,
            pos: { x: 0, y: 0 },
            r: 30,
            strokeWidth: 3,
            color: '#ff0000',//this.player.avatar.secondaryColor,
            actionned: false
        }
        this.ctx;
        this.pageWidth = this.elem.width;
        this.pageHeight = this.elem.height;
        this.middlePoint = {
            x : this.pageWidth/2,
            y : this.pageHeight/2
        }
        this.interval = false;
        this.fps = 60;
        this.gamePadDrawEventName = 'gamePad.draw';
        this.init();
    }

    /******************************
     *
     *  init
     *
     *  test if the device is touchable
     *  and can use canvas
     *
     *  assign the event to the
     *  approriate function
     *  and pass it to the player
     *  class
     *
     ******************************/
    GamePad.prototype.init = function() {
        var _this = this;

        // is this running in a touch capable environment?
        if(
            !isCanvasSupported()
            || !isTouchable()
        ) {
            this.notSupported();
            return false;
        }

        this.canvasInit();
        this.eventInit();

        // init the interval that call the letsDraw function
        this.letsDraw();

    }

    /******************************
     *
     *  canvasInit
     *
     *  create the canvas and
     *  assign it to the document
     *
     ******************************/
    GamePad.prototype.canvasInit = function() {
        //create the canvas element
        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext( '2d' );

        this.elem.appendChild( this.canvas );
    }

    /******************************
     *
     *  eventInit
     *
     *  assign the event to the
     *  approriate function
     *  and pass it to the player
     *  class
     *
     ******************************/
    GamePad.prototype.eventInit = function() {
        var _this = this;

        window.addEventListener('resize', function() {
            _this.assignPageSize();
        });
        window.dispatchEvent(new Event('resize'));

        this.canvas.addEventListener('touchstart', function(event){
            _this.touchStartHandeler.call(_this, event);
        });

        this.canvas.addEventListener('touchmove', function(event){
            _this.touchMouveHandeler.call(_this, event);
        });

        this.canvas.addEventListener('touchend', function(event){
            _this.touchEndHandeler.call(_this, event);
        });

    }

    /******************************
     *
     *  touchStartHandeler
     *
     *  assign new touch event
     *
     ******************************/
    GamePad.prototype.touchStartHandeler = function( eventS ) {
        var _this = this;
        var max = eventS.changedTouches.length;


        for( var i=0; i < max; i++ ) {
            var _event = eventS.changedTouches[i];
            //crossID ?
            if( _this.directionPadObj.id === -1 && _event.clientX < this.middlePoint.x ) {
                _this.addDirectionPad( _event )
            }
            //button ?
            else if( _this.actionBtnObj.id === -1 ) {
                _this.addActionBtn( _event )
            }


        }

    }

     /******************************
      *
      *  touchMouveHandeler
      *
      *  handle mouvement
      *
      *  @param {event}  eventS  the event containing the finger position
      *
      ******************************/
     GamePad.prototype.touchMouveHandeler = function( eventS ) {
         event.preventDefault();

        var _this = this;
        var max = eventS.changedTouches.length;
        var tooFar = function( obj ) {



            return this.directionPadObj.r + this.directionPadObj.r2;
        }

         for( var i=0; i < max; i++ ) {
             var _event = eventS.changedTouches[i];
             //crossID ?
             if( _this.directionPadObj.id === _event.identifier ) {
                _this.directionPadPos( _event );
            } else if( _this.actionBtnObj.id === _event.identifier ) {
                _this.actionBtnObj.pos.x = _event.clientX;
                _this.actionBtnObj.pos.y = _event.clientY;
            }
         }

     }

     /******************************
      *
      *  touchEndHandeler
      *
      *  assign new touch event
      *
      *  @param {event}  eventS  the event containing the finger position
      *
      ******************************/
     GamePad.prototype.touchEndHandeler = function( eventS ) {
         var _this = this;
         var max = eventS.changedTouches.length;

         for( var i=0; i < max; i++ ) {
             var _event = eventS.changedTouches[i];
             //crossID ?
             if( _this.directionPadObj.id === _event.identifier ) {
                 _this.removeDirectionPad(_event)
             }//button ?
             else if( _this.actionBtnObj.id === _event.identifier ) {
                 _this.removeActionBtn()
             }

         }

     }

    /******************************
     *
     *  addDirectionPad
     *
     *  create direction pad
     *
     *  @param {Object}  posObj  an object containing finger position
     *
     ******************************/
    GamePad.prototype.addDirectionPad = function( posObj ) {

        this.directionPadObj.id = posObj.identifier;
        this.directionPadObj.initialPos = this.directionPadObj.nowPos = {
            x: posObj.clientX,
            y: posObj.clientY
        };

    }

    /******************************
     *
     *  addActionBtn
     *
     *  create button
     *
     *  @param {Object}  posObj  an object containing finger position
     *
     ******************************/
    GamePad.prototype.addActionBtn = function( posObj ) {

        this.actionBtnObj.id = posObj.identifier;
        this.actionBtnObj.actionned = true;
        this.actionBtnObj.pos = {
            x: posObj.clientX,
            y: posObj.clientY
        };

    }

    /******************************
     *
     *  removeDirectionPad
     *
     *  reset direction pad
     *
     ******************************/
    GamePad.prototype.removeDirectionPad = function() {

        this.directionPadObj.id = -1;
        this.directionPadObj.initialPos = this.directionPadObj.nowPos = {
            x: 0,
            y: 0
        };

    }

    /******************************
     *
     *  removeActionBtn
     *
     *  reset direction pad
     *
     ******************************/
    GamePad.prototype.removeActionBtn = function() {

        this.actionBtnObj.id = -1;
        this.actionBtnObj.actionned = false;
        this.actionBtnObj.pos = {
            x: 0,
            y: 0
        };

    }

    /******************************
     *
     *  directionPadPos
     *
     *  set new pos for the
     *  cercle to display
     *  and set the limit
     *
     *  @param {event}  _event  the event containing the finger position
     *
     ******************************/
    GamePad.prototype.directionPadPos = function( _event ) {
        var _this = this;

        var maxFar = this.directionPadObj.r;
        var actualLength = Math.sqrt( Math.pow(_event.clientX-this.directionPadObj.initialPos.x, 2) + Math.pow(_event.clientY-this.directionPadObj.initialPos.y, 2) );

        if( actualLength > maxFar ) {

            this.directionPadObj.nowPos = {
                x: ( (_event.clientX - this.directionPadObj.initialPos.x) * ( maxFar / actualLength ) ) + this.directionPadObj.initialPos.x,
                y: ( (_event.clientY - this.directionPadObj.initialPos.y) * ( maxFar / actualLength ) ) + this.directionPadObj.initialPos.y
            }

        } else {
            this.directionPadObj.nowPos = {
                x: _event.clientX,
                y: _event.clientY
            }
        }

    }


    /******************************
     *
     *  letsDraw
     *
     *  draw the canvas
     *
     ******************************/
    GamePad.prototype.letsDraw = function() {
        var _this = this;

        this.interval = setInterval( function(){

            _this.ctx.clearRect( 0, 0, _this.canvas.width, _this.canvas.height );

            //directionPad drawing
            if( _this.directionPadObj.id !== -1 ) {
                _this.ctx.beginPath();
                _this.ctx.arc(_this.directionPadObj.initialPos.x,_this.directionPadObj.initialPos.y, _this.directionPadObj.r, 0, Math.PI*2, true);
                _this.ctx.lineWidth = _this.directionPadObj.strokeWidth;
                _this.ctx.strokeStyle = _this.directionPadObj.color;
                _this.ctx.stroke();

                //console.log(_this.directionPadObj);

                _this.ctx.beginPath();
                _this.ctx.arc(_this.directionPadObj.nowPos.x, _this.directionPadObj.nowPos.y, _this.directionPadObj.r2, 0, Math.PI*2, true);
                _this.ctx.strokeStyle = _this.directionPadObj.color;
                _this.ctx.lineWidth = _this.directionPadObj.strokeWidth2;
                _this.ctx.stroke();
            }

            //actionBtn drawing
            if( _this.actionBtnObj.id != -1 ) {
                _this.ctx.beginPath();
                _this.ctx.arc(_this.actionBtnObj.pos.x, _this.actionBtnObj.pos.y, _this.actionBtnObj.r, 0, Math.PI*2, true);
                _this.ctx.fillStyle = "red";
                _this.ctx.fill();
                /*_this.ctx.lineWidth = _this.actionBtnObj.pos.strokeWidth;
                _this.ctx.strokeStyle = "blue";
                _this.ctx.stroke();*/
            }

            //and finaly, lets pass the results and trigger the event
            var eventToDispatch = new CustomEvent( _this.gamePadDrawEventName, {'detail' : _this.wrapResults()} );
            window.dispatchEvent( eventToDispatch)

        }, this.fps );

    }

    /******************************
     *
     *  wrapResults
     *
     *  gather the speed and direction
     *
     *  @return {Object}  an object wich contain the new position data
     *
     ******************************/
    GamePad.prototype.wrapResults = function() {

        var dpo = this.directionPadObj;
        var ab = this.actionBtnObj

        dpo.velocity = this.mySpeed();
        dpo.direction = this.myDirection();

        //console.log( dpo.direction );
        //console.log( dpo.direction * 180/Math.PI );

        return {
            'gamePadData' : {
                'direction' : {
                    radian: dpo.direction,
                    velocity: dpo.velocity
                },
                'ab'  : ab.actionned
            }
        }

    }

    /******************************
     *
     *  myDirection
     *
     *
     *  @return {float} in radian
     *
     ******************************/
    GamePad.prototype.myDirection = function() {

        //direction vector
        var x = (this.directionPadObj.initialPos.x - this.directionPadObj.nowPos.x)*-1;
        var y = (this.directionPadObj.initialPos.y - this.directionPadObj.nowPos.y)*-1;

        return Math.atan2( y, x );

    }

    /******************************
     *
     *  mySpeed
     *
     *  calcul the speed given
     *  from the position of the
     *  cursor compare to the center
     *  of the directionPad
     *
     *  return {int} pourcentage 0-100
     *
     ******************************/
    GamePad.prototype.mySpeed = function() {

        var maxSpeed = this.directionPadObj.r;
        var actualSpeed = Math.sqrt(
            Math.pow(this.directionPadObj.nowPos.x - this.directionPadObj.initialPos.x, 2)
            +
            Math.pow(this.directionPadObj.nowPos.y - this.directionPadObj.initialPos.y, 2)
        );

        return Math.round( ( actualSpeed / maxSpeed ) * 100 );
    }

    /******************************
     *
     *  assignPageSize
     *
     *  triggered when the page
     *  is resize, orientation
     *  change, and reasign
     *  the widh/heigth, center
     *  point of the GamePad
     *
     ******************************/
    GamePad.prototype.assignPageSize = function() {

        this.pageWidth = this.canvas.width = window.innerWidth;
        this.pageHeight = this.canvas.height = window.innerHeight;
        this.middlePoint = {
            x : this.pageWidth/2,
            y : this.pageHeight/2
        }

    }

    /******************************
     *
     *  notSupported
     *
     *  add a visual element
     *  that inform the user that
     *  the gamepad will not work correctly
     *
     ******************************/
    GamePad.prototype.notSupported = function() {
        var elem = document.createElement('div');
        elem.style.position = 'fixed';
        elem.style.top = '0px';
        elem.style.left = '0px';
        elem.style.background = 'red';
        elem.style.color = '#FFFFFF';
        elem.style.padding = '3%';
        elem.style.width = '94%'

        elem.innerHTML = 'This device does NOT support the mandatory features to make the Gamepad work correctly';
        document.getElementsByTagName('body')[0].appendChild(elem);
    }


    return GamePad;

})();
