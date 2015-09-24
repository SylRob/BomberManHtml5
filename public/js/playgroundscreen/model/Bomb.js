var Bomb = (function() {

    function Bomb() {
        this.mesh = new THREE.Mesh();
        this.position = null;
        this.obj = new THREE.Object3D();
        this.size = {
            w: 0,
            h: 0,
            d: 0
        }
        this._radius = 25;
    }

    /**********************************
     *
     *   init
     *
     *   init the mesh and position
     *
     *   @param {Object}  position  bombPosition like [ {x:0,y0}, {x:0,y:0}, etc... ]
     *   @param {Object}  size  {w: 0, h: 0, d: 0}
     *
     **********************************/
    Bomb.prototype.init = function( position, size ) {

        this.position = position;
        this.size = size;
        this.buildMesh();
    }

    /**********************************
     *
     *   buildMesh
     *
     *   Draw the mesh
     *
     **********************************/
    Bomb.prototype.buildMesh = function() {

        var sphereGeo = new THREE.SphereGeometry( this._radius, 32, 16 );
        var sphereMaterial = new THREE.MeshPhongMaterial( {color: '0x000000', opacity: 1 } );
        this.mesh.geometry = sphereGeo;
        this.mesh.material = sphereMaterial;
        this.mesh.position.set( this.size.w/2, this._radius, this.size.d/2 );

        this.obj.add( this.mesh );

        this.obj.add( this.axisPaint() );

        this.obj.position.set( this.position[0].x, 0, this.position[0].y );

    }

    /******************************
     *
     *  destroy
     *
     *  set the destroyed material
     *
     *  @return {void}
     *
     ******************************/
     Bomb.prototype.destroy = function() {

         this.mesh.material.opacity = 0;

     }

    /******************************
     *
     *  animationStep
     *
     *  animate the bomb
     *
     *  @param {int}  animPercentage  the percentage of the animation (0.33)
     *
     ******************************/
     Bomb.prototype.animationStep = function( animPercentage ) {

         var loop = 3;

         var maxGrow = this.size.w/2;
         var maxGrowScale = (maxGrow / this._radius) - 1;

         var bigStep = Math.round( 117 / loop );//117 and not 100 because I want to skip 1/6 of the loop animation to finish with the big bomb

         var stepPercentage = ( ( ((animPercentage*100) % bigStep )+1) * 100 ) / bigStep;//from 1 to 100
         var smallStep = 50;//%

         if( stepPercentage < smallStep ) var actualScale = 1 + (maxGrowScale * stepPercentage/100);
         else var actualScale = 1 + (maxGrowScale * (100-stepPercentage)/100);

         this.mesh.scale.set( actualScale, actualScale, actualScale );

     }

    /******************************
     *
     *  getObj
     *
     *  get box object3D
     *
     *  @return {THREE.Object3D}
     *
     ******************************/
     Bomb.prototype.getObj = function() {
         return this.obj;
     }

     /******************************
      *
      *  get2DPosition
      *
      *  get point A and C coordinates of the ABCD cube
      *
      *  @return {Object}  {x1, y1, x2, y2}
      *
      ******************************/
      Bomb.prototype.get2DPosition = function() {
          return [
              { x: this.obj.position.x, y: this.obj.position.z },
              { x: this.obj.position.x + this.size.w, y: this.obj.position.z },
              { x: this.obj.position.x + this.size.w, y: this.obj.position.z + this.size.d },
              { x: this.obj.position.x, y: this.obj.position.z + this.size.d }
          ]
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
