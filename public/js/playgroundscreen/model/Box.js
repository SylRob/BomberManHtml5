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

        if( this.destructible ) var boxMaterial = new THREE.MeshPhongMaterial( {color: this.color, transparent: true, opacity: 1} );
        else var boxMaterial = new THREE.MeshPhongMaterial( {color: this.color} );

        this.mesh.geometry = boxGeo
        this.mesh.material = boxMaterial;
        this.mesh.position.set( -this.size.w/2, this.size.h/2, -this.size.d/2 );

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

         if( this.destructible ) this.material.mesh.opacity = 0;

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


    return Box;

})(THREE)
