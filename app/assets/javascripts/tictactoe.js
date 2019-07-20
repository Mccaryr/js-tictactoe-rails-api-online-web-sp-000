$(document).ready(function(){
    attachListeners();
});
   const WINNING_COMBOS = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8]]
   var turn = 0;
   var gameId = 0;

   function player(){
       if (turn % 2 === 0) {
       return "X";
       }
       else {
       return "O";
       }
   }

   function updateState(square){
       let token = player();
       $(square).text(token)
   }

   function setMessage(message){
    $('#message').text(message);
   }

   function checkWinner() {
    var win = false;
  
     for (const arr of WINNING_COMBOS) {
      if ($('td')[arr[0]].innerHTML !== '' && $('td')[arr[0]].innerHTML === $('td')[arr[1]].innerHTML && $('td')[arr[1]].innerHTML === $('td')[arr[2]].innerHTML) {
        setMessage(`Player ${$('td')[arr[0]].innerHTML} Won!`)
        win = true;
      }
    }
    return win;
  }
   
  function doTurn(el) {
    updateState(el);
    turn += 1;
    if(checkWinner()){
        turn = 0;
        saveGame();
        clearGame();
    }
    else if(turn === 9) {
        setMessage("Tie game.");
        saveGame();
        clearGame();
    }
  }

  function saveGame(){
    var state = [];
    $('td').text((index, el) => {state.push(el)});
    if(gameId) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: {state: state}
      });
    } else {
      $.post('/games', {state: state}, function(game) {
        gameId = game['data']['id'];
      });
    }
  }

  function clearGame(){
      $('td').empty();
      turn = 0;
      gameId = 0;
  }

  function attachListeners(){
      $('td').on("click", function(){
          if (!$.text(this) && !checkWinner()) {
              doTurn(this);
          }
      })
      $('button#save').on('click', saveGame);
      $('button#previous').on('click', previousGames);
      $('button#clear').on('click', clearGame);
  }

  function loadGame(gameId) {
    $.get(`/games/${gameId}`, function(game) {
      var state = game['data']['attributes']['state'];
      $('td').empty();
      $('td').text(function(index) {
        return state[index];
      });
      turn = state.join("").length
      gameId = game['data']['id'];
    });
  }

  function previousGames() {
    $.get('/games', function(response) {
      $('#games').html(response);
      let myGames = '';
      for (var i=0; i < response.data.length; i++) {
        let game = response.data[i];
        myGames += `<button onclick="loadGame(${game.id})">${game.id}</button>`;
      }
      $("#games").html(myGames);
    });
  }
  

