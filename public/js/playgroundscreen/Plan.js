

var Plan = (function() {


    function Plan(scene) {

        this.scene = scene;
		this.plane;
        this.cube;

        this.generate();

    }

    /******************************
     *
     *  generate
     *
     *
     ******************************/
    Plan.prototype.generate = function() {
        var _this = this;

        var cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
        var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		this.cubes = new THREE.Mesh( cubeGeo, cubeMaterial );

        this.scene.add(vec);

    }


    return Plan;

})(THREE)
