var socket = io.connect('192.168.11.3:8890');
//var socket = io.connect('http://169.254.69.173:8090');

var myGame = new Game( document.getElementById('playground') );

socket.emit('thePlayGroundHasArrive');

socket.on( 'newPlayerEnterTheGame', function(Player) {
    myGame.addNewPlayer(Player);
});

socket.on( 'playerLeft', function(id) {
    myGame.removePlayer(id);
});

socket.on( 'updatePlayerPos', function(playerPos) {
    myGame.updatePlayerPos(playerPos);
});
