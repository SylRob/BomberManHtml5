

var GamePad = (function() {

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
            deg: 0,
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
        this.fps = 28;
        this.gamePadDrawEventName = 'gamePad.draw';
        this.init();
    }

    /******************************
     *
     *  init
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
      *  handle mouvement
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
      *  assign new touch event
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
     *  create direction pad
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
     *  create button
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
     *  set new pos for the
     *  cercle to display
     *  and set the limite
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
     *  myDirection
     *  take the user position
     *  draw a triangle with the center
     *  of the screen and give the
     *  angle in degree
     *
     *  return float
     *
     ******************************/
    GamePad.prototype.myDirection = function(event) {

        var pointerEventToXY = function(e){
            var out = {x:0, y:0};
            if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
              out.x = touch.pageX;
              out.y = touch.pageY;
            } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
              out.x = e.pageX;
              out.y = e.pageY;
            }
            return out;
        };

        var posUser = {
            x   : pointerEventToXY(event).x,
            y   : pointerEventToXY(event).y
        }

        // lets make the 3 point of the triangle
        var thirdPoint = {
            x   : posUser.x,
            y   : this.middlePoint.y
        }

        //triangle part length
        var AB = ( this.middlePoint.x - posUser.x > 0 ? this.middlePoint.x - posUser.x : posUser.x - this.middlePoint.x );
        var AC = ( this.middlePoint.y - posUser.y > 0 ? this.middlePoint.y - posUser.y : posUser.y - this.middlePoint.y );
        //Hypotenuse
        var BC = Math.round( Math.sqrt( Math.pow(AC, 2) + Math.pow(AB, 2) ) );

        var Bangle = Math.acos( AB/BC )* (180 / Math.PI);

        //on the x axe
        if(this.middlePoint.x - posUser.x == 0 && this.middlePoint.y - posUser.y > 0) Bangle = 90;
        else if(this.middlePoint.x - posUser.x == 0 && this.middlePoint.y - posUser.y < 0) Bangle = 270;

        //on the y axe
        else if(this.middlePoint.y - posUser.y == 0 && this.middlePoint.x - posUser.x > 0) Bangle = 180;
        else if(this.middlePoint.y - posUser.y == 0 && this.middlePoint.x - posUser.x < 0) Bangle = 0;

        //other cases
        else if(this.middlePoint.x - posUser.x > 0 && this.middlePoint.y - posUser.y > 0) Bangle = 180-Bangle;
        else if(this.middlePoint.x - posUser.x < 0 && this.middlePoint.y - posUser.y > 0) Bangle = Bangle;
        else if(this.middlePoint.x - posUser.x > 0 && this.middlePoint.y - posUser.y < 0) Bangle = Bangle+180;
        else if(this.middlePoint.x - posUser.x < 0 && this.middlePoint.y - posUser.y < 0) Bangle = 360-Bangle;

        //round to the first decimal
        return Math.round(Bangle * 10) / 10;
    }

    /******************************
     *
     *  wrapResults
     *  gather the speed and direction
     *
     ******************************/
    GamePad.prototype.wrapResults = function() {

        var dpo = this.directionPadObj;
        var ab = this.actionBtnObj

        dpo.velocity = this.mySpeed();

        return {
            'gamePadData' : {
                'dpo' : dpo,
                'ab'  : ab
            }
        }

    }


    /******************************
     *
     *  mySpeed
     *  calcul the speed given
     *  from the position of the
     *  cursor compare to the center
     *  of the directionPad
     *
     *  return int (pourcentage 0-100)
     *
     ******************************/

    GamePad.prototype.mySpeed = function() {

        var maxSpeed = this.directionPadObj.r;
        var actualSpeed = Math.sqrt( Math.pow(this.directionPadObj.nowPos.x - this.directionPadObj.initialPos.x, 2) + Math.pow(this.directionPadObj.nowPos.y - this.directionPadObj.initialPos.y, 2) );

        return (maxSpeed / actualSpeed) * 100;
    }

    /******************************
     *
     *  assignPageSize
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
