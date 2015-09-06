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

        if( this.destructible ) var boxMaterial = new THREE.MeshPhongMaterial( {color: this.color, transparent: true, opacity: 0.5} );
        else var boxMaterial = new THREE.MeshPhongMaterial( {color: this.color} );

        this.mesh.geometry = boxGeo
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
       *  get box object3D
       *
       *  @return {Object}  {x1, y1, x2, y2}
       *
       ******************************/
       Box.prototype.get2DPosition = function() {
           //this.obj.updateMatrixWorld();

           return {
               x1: this.obj.position.x,
               y1: this.obj.position.z,
               x2: this.obj.position.x + this.size.w,
               y2: this.obj.position.z + this.size.d
           }
       }


    return Box;

})(THREE)
