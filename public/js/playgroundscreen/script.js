var socket = io.connect(window.location.host);
//var socket = io.connect('http://169.254.69.173:8090');

var myGame = new Game( document.getElementById('playground') );

socket.emit('thePlayGroundHasArrive');

socket.on( 'newPlayerEnterTheGame', function(Player) {
    myGame.addNewPlayer(Player);
});

socket.on( 'playerDisconnect', function(id) {
    myGame.removePlayer(id);
});

socket.on( 'updatePlayerData', function(playerPos) {
    myGame.updatePlayerData(playerPos);
});
