var Bomb = (function() {

    function Bomb() {
        this.mesh = new THREE.Mesh();
        this.position = null;
        this.obj = new THREE.Object3D();
        this._exploded = false;
        this.size = {
            w: 0,
            h: 0,
            d: 0
        }

        this.timerStart = 0;
        this.animTotalTime = 3000;
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

        var sphereGeo = new THREE.SphereGeometry( 25, 32, 16 );
        var sphereMaterial = new THREE.MeshPhongMaterial( {color: '0x000000' } );
        this.mesh.geometry = sphereGeo;
        this.mesh.material = sphereMaterial;
        this.mesh.position.set( this.size.w/2, 25, this.size.d/2 );

        this.obj.add( this.mesh );

        this.obj.position.set( this.position[0].x, 0, this.position[0].y );

    }

    /******************************
     *
     *  boom
     *
     *  @return {void}
     *
     ******************************/
     Bomb.prototype.boom = function() {

      this._exploded = true; 

     }

     /******************************
     *
     *  isExploded
     *
     *  make it disepear
     *
     *  @return {Boolean}  true or false
     *
     ******************************/
     Bomb.prototype.isExploded = function() {

         if( this._exploded ) return true;
         return false;

     }

     /******************************
      *
      *  initAnimation
      *
      *  set the animation timer
      *
      ******************************/
      Bomb.prototype.initAnimation = function() {
          this.timerStart = new Date().getTime();
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

    return Bomb;

})();
