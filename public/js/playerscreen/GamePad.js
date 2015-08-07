

var GamePad = (function($) {

    function GamePad(elem, Player) {

        this.player = Player;
        this.elem = elem;
        this.canvas;
        this.directionObj = {
            id: -1,
            initialPos: { x: 0, y: 0 },
            nowPos: { x: 0, y: 0 }
        }
        this.actionBtnObj = {
            id: -1,
            pos: { x: 0, y: 0 }
        }
        this.ctx;
        this.init();
        this.pageWidth = this.elem.width();
        this.pageHeight = this.elem.height();
        this.middlePoint = {
            x : this.pageWidth/2,
            y : this.pageHeight/2
        }
        this.interval = false;
        this.fps = 28;
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
        this.canvas.width = screen.width;
        this.canvas.height = screen.height;
        this.ctx = this.canvas.getContext( '2d' );

        this.elem.get(0).appendChild( this.canvas );
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
            if( _this.directionObj.id === -1 ) {
                _this.addDirectionPad( _event )
            }
            //button ?
            else if( _this.actionBtnObj.id === -1 ) {
                //_this.addActionBtn( _event )
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

         for( var i=0; i < max; i++ ) {
             var _event = eventS.changedTouches[i];
             console.log(_this.directionObj)
             //crossID ?
             if( _this.directionObj.id === _event.identifier ) {
                 _this.directionObj.nowPos = {
                     x: _event.clientX,
                     y: _event.clientY
                 }
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
             if( _this.directionObj.id === _event.identifier ) {
                 _this.removeDirectionPad()
             }//button ?
             else if( _this.actionBtnObj.id === _event.identifier ) {

             }



         }

     }

    /******************************
     *
     *  mySpeed
     *  calcul the speed given
     *  from the position of the
     *  cursor compare to the center
     *  of the page
     *
     ******************************/

    GamePad.prototype.mySpeed = function(event) {
        return 0.5;
    }

    /******************************
     *
     *  addDirectionPad
     *  create direction pad
     *
     ******************************/

    GamePad.prototype.addDirectionPad = function( posObj ) {

        this.directionObj.id = posObj.identifier;
        this.directionObj.initialPos = this.directionObj.nowPos = {
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

        this.directionObj.id = -1;
        this.directionObj.initialPos = this.directionObj.nowPos = {
            x: 0,
            y: 0
        };

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

            //crossPad drawing
            if( _this.directionObj.id !== -1 ) {
                _this.ctx.beginPath();
                _this.ctx.arc(_this.directionObj.initialPos.x,_this.directionObj.initialPos.y,50,0,Math.PI*2,true);
                _this.ctx.strokeStyle = _this.player.avatar.secondaryColor;
                _this.ctx.stroke();

                _this.ctx.beginPath();
                _this.ctx.arc(_this.directionObj.nowPos.x, _this.directionObj.nowPos.y, 30, 0, Math.PI*2, true);
                _this.ctx.strokeStyle = _this.player.avatar.secondaryColor;
                _this.ctx.stroke();
            }

            //actionBtn drawing
            if( _this.actionBtnObj.id != -1 ) {

            }
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
    GamePad.prototype.wrapResults = function(obj1, obj2) {

        return {
            degree : obj1,
            speed : obj2
        }

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
        this.pageWidth = this.elem.width();
        this.pageHeight = this.elem.height();
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

}(jQuery));
