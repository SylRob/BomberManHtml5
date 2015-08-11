var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

var playerListServerSide = {};
var playGroundId = null;
var scores = {};
var maxPlayer = 5;

console.log('connected');
app.use(express.static(__dirname + '/public'))
.get('/playground', function(req, res) {
    res.sendfile(__dirname + '/public/playgroundscreen.html');
}).get('/', function(req, res) {
    res.sendfile(__dirname + '/public/playerscreen.html');
})


//to not display useless info in the terminal
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

    //the playground reset the players(from client side) after it loaded
    socket.on('thePlayGroundHasArrive', function() {

        playGroundId = socket.id;
        socket.join('playground');
        socket.broadcast.to('playerSide').emit('timeToStart');
    });

    socket.on('newPlayer', function(Player) {
        //redirect if no id
        if( undefined === Player.id || null == Player.id ) {
            console.log('rejected player');
            app.redirect('/');
            return false;
        }

        //secure the pseudo and the id
        Player.pseudo = (ent.encode(Player.pseudo)).substr(0, 12);
        Player.id = (ent.encode(Player.id)).substr(0, 50);

        //Add the player to the list on the server side
        var oldPlayer = true;
        if(playerListServerSide[socket.id] != Player.id) {
            oldPlayer = false;
            playerListServerSide[socket.id] = Player.id;
        }

        socket.join('playerSide');

        if( playGroundId == null || Object.keys(playerListServerSide).length > maxPlayer ) {
            socket.emit('youCannotPlay');
            delete playerListServerSide[socket.id];
            return false;
        }

        //tell the new player that he can play
        if( !oldPlayer ) socket.emit('readyToPlay');

        //pass the new player to the game
        socket.broadcast.to('playground').emit('newPlayerEnterTheGame', Player);

    });

    //a player just lost
    socket.on('youAreDead', function(playerId) {
        //console.log('suis-je mort ?');
        for(socketId in playerListServerSide) {

            if( playerListServerSide[socketId] == playerId ) {
                delete playerListServerSide[socketId];
                break;
            }

        }
        socket.broadcast.to('playerSide').emit('iAmDead', playerId);
    });

    socket.on('youNeedABeer', function(playerId) {

        for(socketId in playerListServerSide) {

            if( playerListServerSide[socketId] == playerId ) {
                delete playerListServerSide[socketId];
                break;
            }

        }

        socket.broadcast.to('playerSide').emit('youNeedABeer', playerId);
    });

    socket.on('hereIsMyScore', function(pseudo, score) {

    });

    //player movements
    socket.on('playerTouched', function(playerPos) {
        socket.broadcast.to('playground').emit('updatePlayerPos', playerPos);
    });


    socket.on('disconnect', function () {

        if( socket.id != playGroundId ) {
            socket.broadcast.to('playground').emit('playerLeft', playerListServerSide[socket.id]);
            delete playerListServerSide[socket.id];
        }

    });

});


//doit etre place en dernier !
server.listen(8890);
