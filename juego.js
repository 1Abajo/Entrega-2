// Intentaremos construir un juego de Blackjack
// El objetivo de este juego es sumar 21 puntos o no pasarse de esta cifra, 
// pero siempre sobrepasando el valor que tiene el crupier para ganar la apuesta. 
// Las cartas del 2 al 10 valen su valor natural; las cartas J, Q y K también valen 10 
// y el as vale 1 o 11 según la conveniencia del jugador
   
// Como primera cosa se construye una baraja como array, un objeto con 52 cartas.

var suits = ["Pica", "Corazon", "Diamante", "Trebol"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();

function createDeck()
{
    deck = new Array();
    for (var i = 0 ; i < values.length; i++)
    {
        for(var x = 0; x < suits.length; x++)
        {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}
// En este array se uso el metodo pop(), que elimina el último elemento del array y devuelve ese mismo elemento.



// Para 1000 rondas se intercambiaran dos cartas en ubicaciones aleatorias del mazo.

function shuffle()
{
    // El ciclo es para mil rondas y cambia los valores para dos cartas aleatorias.
    for (var i = 0; i < 1000; i++)
    {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}


// Creacion del jugador
// este es la funcion para crear al jugador y a la mesa (crupier)

var players = new Array();
function createPlayers(num)
{
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        var hand = new Array();
        var player = { Name: 'Player' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

// Ahora crearemos la interfaz para el usuario

function createPlayersUI()
{
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

// En este punto se puede comenzar el juego. 
// Utilizamos la siguiente función para comenzar el juego y crear todos los objetos necesarios.

function startblackjack()
{
    document.getElementById('btnStart').value = 'Otra Vez';
    document.getElementById("status").style.display="none";
    // reparte dos cartas al jugador
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

// El juego cominza con una "revolvida" de cartas (en Chile le decimos a eso revolver las cartas)

function dealHands()
{
    // se le entregan dos cartas a cada jugador
    for(var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }

    updateDeck();
}

// La siguiente funcion realiza el reparto de cartas. 
// Una vez que se reparte una carta al jugador, es necesario agregarla a su mano. 

function renderCard(card, player)
{
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

function getCardUI(card)
{
    var el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = card.Suit + ' ' + card.Value;
    return el;
}

// La siguiente funcion sacara una carta de nuestra pila y sumará el valor de la carta 
// a la puntuación total del jugador.

var currentPlayer = 0;

// saca una carta para el jugador 
function hitMe()
{
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    check();
}
// comprueba si el jugador supera los 21 puntos
function check()
{
    if (players[currentPlayer].Points > 21)
    {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + 'Perdiste';
    }
}

// Si un jugador elige mantener su mano, entonces se verificará si hay más jugadores (para este juego hay dos), 
// de ser así, les transferirá el control actualizando la variable currentPlayer. Si no quedan jugadores, 
// se llama al metodo final y se suman los puntos.

function stay()
{
    // aca podemos pasar al siguiente jugador.
    
    if (currentPlayer != players.length-1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    }

    else {
        end();
    }
}

function end()
{
    var winner = -1;
    var score = 0;

    for(var i = 0; i < players.length; i++)
    {
        if (players[i].Points > score && players[i].Points < 22)
        {
            winner = i;
        }

        score = players[i].Points;
    }

    document.getElementById('status').innerHTML = 'Ganador: Player ' + players[winner].ID;
}
