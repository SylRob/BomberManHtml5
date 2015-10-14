var Box = (function() {

    function Box( w, h, d, color, destructible ) {
        this.color = color;
        this.size = {
            w: w,
            h: h,
            d: d
        }
        this.destructible = destructible;
        this.mesh = new THREE.Mesh();
        this.obj = new THREE.Object3D();
        this.init();

    }

    /******************************
     *
     *  init
     *
     *  create elements
     *
     *  @return {void}
     *
     ******************************/
    Box.prototype.init = function() {

        var boxGeo = new THREE.BoxGeometry(
            this.size.w,
            this.size.h,
            this.size.d
        );

        if( this.destructible ) var boxMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/grass-verydark.jpg'), transparent: true, opacity: 1 } );
        else var boxMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/castle_walls_short.jpg') } );

        this.mesh.geometry = boxGeo;
        this.mesh.material = boxMaterial;
        this.mesh.position.set( this.size.w/2, this.size.h/2, this.size.d/2 );

        this.obj.add( this.mesh );

    }

    /******************************
     *
     *  destroyed
     *
     *  set the destroyed material
     *
     *  @return {void}
     *
     ******************************/
     Box.prototype.destroyed = function() {

         if( this.destructible ) this.mesh.material.opacity = 0;

     }

    /******************************
     *
     *  paint
     *
     *  set the destroyed material
     *
     *  @return {void}
     *
     ******************************/
     Box.prototype.paint = function() {

         this.mesh.material.color = 0x00FF00;
         this.mesh.material.opacity = 1;

     }

     /******************************
     *
     *  isDestroyed
     *
     *  set the destroyed material
     *
     *  @return {Boolean}  true or false
     *
     ******************************/
     Box.prototype.isDestroyed = function() {

         if( this.mesh.material.opacity == 0 ) return true;
         return false;

     }

     /******************************
      *
      *  isDestructible
      *
      *  @return {Boolean}
      *
      ******************************/
      Box.prototype.isDestructible = function() {
          return this.destructible;
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
      Box.prototype.getObj = function() {
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
       Box.prototype.get2DPosition = function() {
           return [
               { x: this.obj.position.x, y: this.obj.position.z },
               { x: this.obj.position.x + this.size.w, y: this.obj.position.z },
               { x: this.obj.position.x + this.size.w, y: this.obj.position.z + this.size.d },
               { x: this.obj.position.x, y: this.obj.position.z + this.size.d }
           ]
       }

       /******************************
       *
       *  getCenterPosition
       *
       *  get center point
       *
       *  @return {Object}  {x:0, y:0}
       *
       ******************************/
       Box.prototype.getCenterPosition = function() {
           return {
            x: this.obj.position.x + this.size.w/2,
            y: this.obj.position.z + this.size.d/2
          }
       }

    return Box;

})(THREE)
