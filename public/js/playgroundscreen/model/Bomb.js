var Bomb = (function() {

    function Bomb() {
        this.position = null;
        this.size = {
            w: 0,
            h: 0,
            d: 0
        }
        this._radius = 25;
        this.hsbStart = {
            h: 0,
            s: 0,
            l: 0
        }
        this.hsbEnd = {
            h: 0,
            s: 1,
            l: 0.5
        }

        this.obj = new THREE.Object3D();
        this._topPart = new THREE.Object3D();
        this._corp = new THREE.Mesh();

        this.explodedTexture = null;
        this.explodedPart = {
            h: new THREE.Object3D(),
            v: new THREE.Object3D()
        }
        this.explodedTextureH = THREE.ImageUtils.loadTexture( "img/lava.png");
        this.explodedTextureV = THREE.ImageUtils.loadTexture( "img/lava.png");
    }

    /**
     *   init
     *
     *   init the mesh and position
     *
     *   @param {Object}  position  bombPosition like [ {x:0,y0}, {x:0,y:0}, etc... ]
     *   @param {Object}  size  {w: 0, h: 0, d: 0}
     *
     */
    Bomb.prototype.init = function( position, size ) {

        this.position = position;
        this.size = size;
        this.size.w -= 0.01;
        this.size.d -= 0.01;

        this.buildMesh();

    }

    /**
     *   buildMesh
     *
     *   Draw the mesh
     *
     */
    Bomb.prototype.buildMesh = function() {


        var sphereGeo = new THREE.SphereGeometry( this._radius, 32, 16 );
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        sphereMaterial.color.setHSL( this.hsbStart.h, this.hsbStart.s, this.hsbStart.l );
        this._corp.geometry = sphereGeo;
        this._corp.material = sphereMaterial;
        this._corp.position.set( this.size.w/2, this._radius, this.size.d/2 );

        var headSize = this._radius/3;
        var headGroup = new THREE.Object3D();
        var cilinder1 = new THREE.CylinderGeometry( headSize, headSize, headSize/2 );
        var material1 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh1 = new THREE.Mesh( cilinder1, material1 );
        this._topPart.add( mesh1 );

        //etincelle spritesheet
        var etincelleTexture = THREE.ImageUtils.loadTexture('../img/etincelle-w185.png');
        etincelleTexture.minFilter = THREE.LinearFilter;
        etincelleTexture.offset.x = 0;
        etincelleTexture.offset.y = 0;
        var etincelleMaterial = new THREE.MeshBasicMaterial( { map: etincelleTexture, side: THREE.DoubleSide, transparent: true } );
        var etincelleGeometry = new THREE.PlaneGeometry( headSize, headSize);
        var etincellMesh = new THREE.Mesh( etincelleGeometry, etincelleMaterial );
        etincellMesh.position.set( 0, (headSize + headSize/2)/2, 0 );
        this._topPart.add( etincellMesh );

        this._topPart.position.set( this.size.w/2, this._radius*2, this.size.d/2 );

        this.obj.add( this._corp );
        this.obj.add( this._topPart );
        //this._topPart.add( this.axisPaint() );
        this.obj.position.set( this.position[0].x, 0, this.position[0].y );

    }

    /**
     *  destroyAnimation
     *
     *  set the destroyed material
     *
     *  @return {void}
     *
     */
     Bomb.prototype.destroyAnimation = function( horizontalCoor, verticalCoor ) {
         var self = this;
         var sizeH = {
             w: horizontalCoor[0].x - horizontalCoor[1].x,
             d: horizontalCoor[0].y - horizontalCoor[3].y
         }
         var sizeV = {
             w: verticalCoor[0].x - verticalCoor[1].x,
             d: verticalCoor[0].y - verticalCoor[3].y
         }

         var objXGeo =  new THREE.BoxGeometry(
             sizeH.w,
             Math.round( this.size.h*30/100 ),
             sizeH.d
         );
         //texture.minFilter = THREE.LinearFilter;
         //texture.wrapS = THREE.RepeatWrapping;
         //texture.wrapT = THREE.RepeatWrapping;

         var txt01 = this.explodedTextureV;
         txt01.needUpdate = true;
         txt01.minFilter = THREE.LinearFilter;
         txt01.wrapS = THREE.RepeatWrapping;
         txt01.wrapT = THREE.RepeatWrapping;
         txt01.repeat.set( Math.round(Math.abs(sizeH.w)/this.size.d), 1 );

         //var objXMat = new THREE.MeshPhongMaterial(  {color: 0xFFFF00}  );
         var objXMat = new THREE.MeshPhongMaterial( { map: txt01 } );
         objX = new THREE.Mesh(　objXGeo, objXMat　);
         objX.position.set( horizontalCoor[0].x - sizeH.w/2, Math.round( this.size.h*55/100 ), horizontalCoor[0].y - sizeH.d/2 )

         var objYGeo =  new THREE.BoxGeometry(
             sizeV.w,
             Math.round( this.size.h*30/100 ),
             sizeV.d
         );

         console.log( this.size );

         var texture2 = this.explodedTextureH;
         texture2.needUpdate = true;
         texture2.minFilter = THREE.LinearFilter;
         texture2.wrapS = THREE.RepeatWrapping;
         texture2.wrapT = THREE.RepeatWrapping;
         texture2.repeat.set(1, Math.round(Math.abs(sizeH.w)/this.size.d) );

         //var objYMat = new THREE.MeshPhongMaterial( {color: 0xFFFF00} );
         var objYMat = new THREE.MeshPhongMaterial( { map: texture2 } );
         objY = new THREE.Mesh(　objYGeo, objYMat　);
         objY.position.set( verticalCoor[0].x - sizeV.w/2, Math.round( this.size.h*55/100 ), verticalCoor[0].y - sizeV.d/2 );

         this.explodedPart.v = objY;
         this.explodedPart.h = objX;

         return this.explodedPart;

     }

    /**
     *  animationStep
     *
     *  animate the bomb
     *
     *  @param {int}  animPercentage  the percentage of the animation (0.33)
     *
     */
     Bomb.prototype.animationStep = function( animPercentage ) {

         var loop = 6;

         var maxGrow = this.size.w/2;
         var maxGrowScale = (maxGrow / this._radius) - 1;

         var bigStep = Math.round( 117 / loop );//117 and not 100 because I want to skip 1/6 of the loop animation to finish with the big bomb

         var stepPercentage = ( ( ((animPercentage*100) % bigStep )+1) * 100 ) / bigStep;//from 1 to 100
         var smallStep = 50;//%

         if( stepPercentage < smallStep ) {
             var actualScale = 1 + (maxGrowScale * stepPercentage/100);
             this._topPart.position.y =  this._topPart.position.y + (maxGrowScale * stepPercentage/100);
             this._corp.material.color.setHSL(
                 this.hsbEnd.h*(stepPercentage*2)/100,
                 this.hsbEnd.s*(stepPercentage*2)/100,
                 this.hsbEnd.l*(stepPercentage*2)/100
             );

         } else {
             var actualScale = 1 + (maxGrowScale * (100-stepPercentage)/100);
             this._topPart.position.y =  this._topPart.position.y - (maxGrowScale * (100-stepPercentage)/100);
             this._corp.material.color.setHSL(
                 this.hsbEnd.h + this.hsbEnd.h*(100-(stepPercentage*2))/100,
                 this.hsbEnd.s + this.hsbEnd.s*(100-(stepPercentage*2))/100,
                 this.hsbEnd.l + this.hsbEnd.l*(100-(stepPercentage*2))/100
             );
         }

         this._corp.scale.set( actualScale, actualScale, actualScale );

     }

    /**
     *  getExplosionCoordinates
     *
     *  @param {int}  power  the bomb power
     *
     */
     Bomb.prototype.getExplosionCoordinates = function( power, step ) {


     }

    /**
     *  getObj
     *
     *  get box object3D
     *
     *  @return {THREE.Object3D}
     *
     */
     Bomb.prototype.getObj = function() {
         return this.obj;
     }

     /**
      *  get2DPosition
      *
      *  get point A and C coordinates of the ABCD cube
      *
      *  @return {Object}  {x1, y1, x2, y2}
      *
      */
      Bomb.prototype.get2DPosition = function() {
          return [
              { x: this.obj.position.x, y: this.obj.position.z },
              { x: this.obj.position.x + this.size.w, y: this.obj.position.z },
              { x: this.obj.position.x + this.size.w, y: this.obj.position.z + this.size.d },
              { x: this.obj.position.x, y: this.obj.position.z + this.size.d }
          ]
      }

      /**
       *  axisPaint
       *
       *  paint the axis x,y,z
       *
       *  @return {THREE.Object3D}
       *
       */
      Bomb.prototype.axisPaint = function() {

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

    return Bomb;

})();
