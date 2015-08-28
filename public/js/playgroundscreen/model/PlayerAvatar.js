
var PlayerAvatar = (function() {

    /******************************
     *
     *  PlayerAvatar
     *
     *  @param {Oject}  palyerOption  various player option (name, color, etc...)
     *
     *  @return {Object}  PlayerAvatar
     *
     ******************************/
    function PlayerAvatar( playerOption ) {

        this.playerOption = playerOption;

        this.avatar;

        this.init();

    }

    /******************************
     *
     *  init
     *
     *  create and return a new avatar
     *
     *  @return {void}
     *
     ******************************/
    PlayerAvatar.prototype.init = function() {

        if( undefined === this.playerOption.pseudo || this.playerOption.pseudo != '' ) {
            this.pseudo = this.playerOption.pseudo;
        } else this.pseudo = 'Player'+playerOption.id;

    }

    /******************************
     *
     *  initAvatar
     *
     *  create a new avatar
     *
     *  @return {THREE.Mesh}
     *
     ******************************/
    PlayerAvatar.prototype.initAvatar = function() {

        var sphereGeo = new THREE.SphereGeometry( 5, 32, 32 );
        var sphereMaterial = new THREE.MeshPhongMaterial( {color: transformHexa(this.playerOption.avatar.primaryColor) } );
        var sphere = new THREE.Mesh( sphereGeo, sphereMaterial );
        return sphere;
    }

    return PlayerAvatar;

}(THREE));
