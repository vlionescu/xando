var tiles = $('td');
var xAndOGame;
var xAndOAi;
var xAndORenderer;
var startButton = $('#xo-start-button');
var xAndOBoard = $('table');
var isComputerMoveOver = true;
var isGameOver = true;


//obiectul care se ocupa de afisare in dom
function constructRenderer() {
	return{
		//afiseaza x si o in dom
		//Input: tabla(matrice / array de arrayuri)
		//Output: none
		drawBoard: function(board){
			
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 3; j++){
					if(board[i][j] === 'x' && !tiles[i*3+j].classList.contains('x')){
						tiles[i*3+j].className += ' x'
					}else if(board[i][j] === 'o' && !tiles[i*3+j].classList.contains('o')){
						tiles[i*3+j].className += ' o'
					}else if(board[i][j] === '-'){
						tiles[i*3+j].classList.remove('x');
						tiles[i*3+j].classList.remove('o');
						tiles[i*3+j].classList.remove('winning-path');
					}
				}
			}
		},
		//face modificarile initiale ale jocului
		//Input & Output: none
		renderNewGame: function(){
			xAndOBoard.toggleClass('invisible');// face sa apara tabla
			startButton.css({'color': 'white', 'background': 'black'});// modifica butonul de start
			startButton.html('Game in progress');
		},
		
		//face modificarile vizuale de sfarsit de jocului
		//Input & Output: none
		renderEndGame: function(){
			setTimeout(function(){
				xAndOBoard.toggleClass('invisible');
				startButton.css({'color': 'black', 'background': 'white'});
				startButton.html('Start');
				$('.xo-message').html('');
			},2000);
		},
		
		//Afiseaza numarul de victori in dom
		//Input & Output: none
		updateWins: function(){
			var playerWinsString = '';
			var aiWinsString = '';
			var wins = xAndOGame.returnWins();
			var pWins = wins[0];
			var aiWins = wins[1];
 			for(var i = 0; i < pWins; i++){ playerWinsString += 'I ';}
			for(var i = 0; i < aiWins; i++){ aiWinsString += 'I ';}
			$('.xo-player-wins').html(playerWinsString);
			$('.xo-ai-wins').html(aiWinsString);
		},
		//Coloreaza segmentul castigator
		//Input: linia castigatoare(un array de 3 elemente)
		//Output: none
		drawWinningPath: function(winningLine){
			
			for(var i = 0; i < winningLine.length; i++){
				tiles[winningLine[i][0]*3+winningLine[i][1]].className += ' winning-path';
			}
		}	
	}
}

//construieste obiectul care se ocupa de mecanica jocului
function constructXandOGame(){
	var gameBoard = [
		['-', '-', '-'],
		['-', '-', '-'],
		['-', '-', '-']						
	];
  var crtPiece = 'x';
	var playerWins = 0;
	var aiWins = 0;

	return {

		//functie care apeleaza functia care returneaza segmentul castigator si in functie de existenta/inexistenta acestuia returneaza true/false
		//Input: none
		//Output: boolean
		isThereAWinner: function(){
      if(this.returnWinningPath().length){
				isGameOver = true;
				if(crtPiece === 'x'){
					playerWins++;
					return true;
				}else{
					aiWins++;
					return true;
				}
      }else{
        return false;
      }
		},
		
		//returneaza numarul de victorii a juctaorului si a AI-jocului pentru a le afisare
		//Input: none
		//Output: un array de 2 cu nr de victorii a fiecarui jucator
		returnWins: function(){
			return [playerWins, aiWins];			
		},

		//goleste tabla pentru un joc nou
		//Input & Output: none
		clearGameBoard: function(){
			gameBoard = [
				['-', '-', '-'],
				['-', '-', '-'],
				['-', '-', '-']						
			];
		},
		
		//imi verifica care ar fi linia/coloana/diagonala castigatoare
		//Input: none
		//Output: un array gol daca nu a castigat nimeni si cu pozitiile daca este un castigator
    returnWinningPath: function(){
			if(gameBoard[0][0] === crtPiece && gameBoard[0][1] === crtPiece && gameBoard[0][2] === crtPiece){ return [[0, 0], [0, 1], [0, 2]]; }
      if(gameBoard[0][0] === crtPiece && gameBoard[1][0] === crtPiece && gameBoard[2][0] === crtPiece){ return [[0, 0], [1, 0], [2, 0]]; }
      if(gameBoard[0][0] === crtPiece && gameBoard[1][1] === crtPiece && gameBoard[2][2] === crtPiece){ return [[0, 0], [1, 1], [2, 2]]; }
      if(gameBoard[0][1] === crtPiece && gameBoard[1][1] === crtPiece && gameBoard[2][1] === crtPiece){ return [[0, 1], [1, 1], [2, 1]]; }
      if(gameBoard[0][2] === crtPiece && gameBoard[1][2] === crtPiece && gameBoard[2][2] === crtPiece){ return [[0, 2], [1, 2], [2, 2]]; }
      if(gameBoard[0][2] === crtPiece && gameBoard[1][1] === crtPiece && gameBoard[2][0] === crtPiece){ return [[0, 2], [1, 1], [2, 0]]; }
      if(gameBoard[1][0] === crtPiece && gameBoard[1][1] === crtPiece && gameBoard[1][2] === crtPiece){ return [[1, 0], [1, 1], [1, 2]]; }
      if(gameBoard[2][0] === crtPiece && gameBoard[2][1] === crtPiece && gameBoard[2][2] === crtPiece){ return [[2, 0], [2, 1], [2, 2]]; }
      else{
        return [];
      }
		},
		
		//verifca remiza in functie de existenta/inexistenta elementului '-' care semnifica pozitie goala
		//Input: none
		//Output: boolean
    isThereARemach: function(){
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 3; j++){
					if(gameBoard[i][j] === '-'){
						return false;
					}
				}
			}
			return true;
    },
		
		//schimba jucatorul
		//Input & Output: none
    switchPlayer: function(){
			
      if(crtPiece === 'x'){
        crtPiece = 'o';
				return;
      }else{
        crtPiece = 'x';
				return;
      }
    },
		
		//modifica tabla cu noua miscare executata
		//Input: i, j parametrii
		//Outpu: none
    makeMove: function(i, j){
      if(gameBoard[i][j] === '-'){
        gameBoard[i][j] = crtPiece;
      }
    },

		//returneaza tabla
		//Input & Output: none
    getBoard: function(){
      return gameBoard;
    }
	}
}
//
function constructAI(){
  return {
    makeMove: function(i,j){
      var gameBoard = xAndOGame.getBoard();
			//nu merge da asta ii algoritumul http://neverstopbuilding.com/minimax
      if(gameBoard[0][0] === 'o' && gameBoard[0][1] === 'o' && gameBoard[0][2] === '-'){ xAndOGame.makeMove(0,2); return;}
			if(gameBoard[0][0] === 'o' && gameBoard[0][1] === '-' && gameBoard[0][2] === 'o'){ xAndOGame.makeMove(0,1); return;}
			if(gameBoard[0][0] === '-' && gameBoard[0][1] === 'o' && gameBoard[0][2] === 'o'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][0] === 'o' && gameBoard[1][0] === 'o' && gameBoard[2][0] === '-'){ xAndOGame.makeMove(2,0); return;}
			if(gameBoard[0][0] === 'o' && gameBoard[1][0] === '-' && gameBoard[2][0] === 'o'){ xAndOGame.makeMove(1,0); return;}
			if(gameBoard[0][0] === '-' && gameBoard[1][0] === 'o' && gameBoard[2][0] === 'o'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][0] === 'o' && gameBoard[1][1] === 'o' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[0][0] === 'o' && gameBoard[1][1] === '-' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][0] === '-' && gameBoard[1][1] === 'o' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][1] === 'o' && gameBoard[1][1] === 'o' && gameBoard[2][1] === '-'){ xAndOGame.makeMove(2,1); return;}
			if(gameBoard[0][1] === 'o' && gameBoard[1][1] === '-' && gameBoard[2][1] === 'o'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][1] === '-' && gameBoard[1][1] === 'o' && gameBoard[2][1] === 'o'){ xAndOGame.makeMove(0,1); return;}
			if(gameBoard[0][2] === 'o' && gameBoard[1][2] === 'o' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[0][2] === 'o' && gameBoard[1][2] === '-' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(1,2); return;}
			if(gameBoard[0][2] === '-' && gameBoard[1][2] === 'o' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(0,2); return;}
      if(gameBoard[0][2] === 'o' && gameBoard[1][1] === 'o' && gameBoard[2][0] === '-'){ xAndOGame.makeMove(2,0); return;}
			if(gameBoard[0][2] === 'o' && gameBoard[1][1] === '-' && gameBoard[2][0] === 'o'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][2] === '-' && gameBoard[1][1] === 'o' && gameBoard[2][0] === 'o'){ xAndOGame.makeMove(0,2); return;}
      if(gameBoard[1][0] === 'o' && gameBoard[1][1] === 'o' && gameBoard[1][2] === '-'){ xAndOGame.makeMove(1,2); return;}
			if(gameBoard[1][0] === 'o' && gameBoard[1][1] === '-' && gameBoard[1][2] === 'o'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[1][0] === '-' && gameBoard[1][1] === 'o' && gameBoard[1][2] === 'o'){ xAndOGame.makeMove(1,0); return;}
      if(gameBoard[2][0] === 'o' && gameBoard[2][1] === 'o' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[2][0] === 'o' && gameBoard[2][1] === '-' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(2,1); return;}
			if(gameBoard[2][0] === '-' && gameBoard[2][1] === 'o' && gameBoard[2][2] === 'o'){ xAndOGame.makeMove(2,0); return;}

			if(gameBoard[0][0] === 'x' && gameBoard[0][1] === 'x' && gameBoard[0][2] === '-'){ xAndOGame.makeMove(0,2); return;}
			if(gameBoard[0][0] === 'x' && gameBoard[0][1] === '-' && gameBoard[0][2] === 'x'){ xAndOGame.makeMove(0,1); return;}
			if(gameBoard[0][0] === '-' && gameBoard[0][1] === 'x' && gameBoard[0][2] === 'x'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][0] === 'x' && gameBoard[1][0] === 'x' && gameBoard[2][0] === '-'){ xAndOGame.makeMove(2,0); return;}
			if(gameBoard[0][0] === 'x' && gameBoard[1][0] === '-' && gameBoard[2][0] === 'x'){ xAndOGame.makeMove(1,0); return;}
			if(gameBoard[0][0] === '-' && gameBoard[1][0] === 'x' && gameBoard[2][0] === 'x'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][0] === 'x' && gameBoard[1][1] === 'x' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[0][0] === 'x' && gameBoard[1][1] === '-' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][0] === '-' && gameBoard[1][1] === 'x' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(0,0); return;}
			if(gameBoard[0][1] === 'x' && gameBoard[1][1] === 'x' && gameBoard[2][1] === '-'){ xAndOGame.makeMove(2,1); return;}
			if(gameBoard[0][1] === 'x' && gameBoard[1][1] === '-' && gameBoard[2][1] === 'x'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][1] === '-' && gameBoard[1][1] === 'x' && gameBoard[2][1] === 'x'){ xAndOGame.makeMove(0,1); return;}
			if(gameBoard[0][2] === 'x' && gameBoard[1][2] === 'x' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[0][2] === 'x' && gameBoard[1][2] === '-' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(1,2); return;}
			if(gameBoard[0][2] === '-' && gameBoard[1][2] === 'x' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(0,2); return;}
      if(gameBoard[0][2] === 'x' && gameBoard[1][1] === 'x' && gameBoard[2][0] === '-'){ xAndOGame.makeMove(2,0); return;}
			if(gameBoard[0][2] === 'x' && gameBoard[1][1] === '-' && gameBoard[2][0] === 'x'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[0][2] === '-' && gameBoard[1][1] === 'x' && gameBoard[2][0] === 'x'){ xAndOGame.makeMove(0,2); return;}
      if(gameBoard[1][0] === 'x' && gameBoard[1][1] === 'x' && gameBoard[1][2] === '-'){ xAndOGame.makeMove(1,2); return;}
			if(gameBoard[1][0] === 'x' && gameBoard[1][1] === '-' && gameBoard[1][2] === 'x'){ xAndOGame.makeMove(1,1); return;}
			if(gameBoard[1][0] === '-' && gameBoard[1][1] === 'x' && gameBoard[1][2] === 'x'){ xAndOGame.makeMove(1,0); return;}
      if(gameBoard[2][0] === 'x' && gameBoard[2][1] === 'x' && gameBoard[2][2] === '-'){ xAndOGame.makeMove(2,2); return;}
			if(gameBoard[2][0] === 'x' && gameBoard[2][1] === '-' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(2,1); return;}
			if(gameBoard[2][0] === '-' && gameBoard[2][1] === 'x' && gameBoard[2][2] === 'x'){ xAndOGame.makeMove(2,0); return;}
			
			else{ this.makeRandomMove();}
		},
		
		makeRandomMove: function(){
			var gameBoard = xAndOGame.getBoard();
			var isPositionEmpty = false;
			while(!isPositionEmpty){
				var randomI = Math.floor(Math.random()*3);
				var randomJ = Math.floor(Math.random()*3);
				if(gameBoard[randomI][randomJ] === '-'){
					xAndOGame.makeMove(randomI, randomJ)
					isPositionEmpty = true;
				}
			}
		}
  }
}

xAndOGame = constructXandOGame();
startButton.click(startGame);

function startGame(){
	if(isGameOver){
		isGameOver = false;
		createTilesPositions();
		
		xAndOAi = constructAI();
		xAndORenderer = constructRenderer();
		xAndORenderer.renderNewGame();
		xAndOGame.clearGameBoard();
		xAndORenderer.drawBoard(xAndOGame.getBoard());
	}	
}


function createTilesPositions(){
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
        tiles[i*3+j].dataset.i = i;
        tiles[i*3+j].dataset.j = j;
    }
  }
}

xAndOBoard.click(function(){
 
 
	playTurn(xAndOGame, event.target.dataset.i, event.target.dataset.j);
	
	setTimeout(function(){
		isComputerMoveOver = true;
		playTurn(xAndOAi, 0, 0);
		xAndOGame.switchPlayer();
		isComputerMoveOver = true;
	},1000);
	xAndOGame.switchPlayer();
});

function playTurn(player, i, j){
	if(isComputerMoveOver  && !isGameOver){
		isComputerMoveOver = false;
		player.makeMove(i,j);
		if(xAndOGame.isThereARemach()){
			$('.xo-message').html('rematch');
			xAndORenderer.renderEndGame();
			isGameOver = true;
		}
		if(xAndOGame.isThereAWinner()){
			$('.xo-message').html('winner');
			xAndORenderer.drawWinningPath(xAndOGame.returnWinningPath());
			xAndORenderer.updateWins();
			xAndORenderer.renderEndGame();
			isGameOver = true;
		}
		
		
		xAndORenderer.drawBoard(xAndOGame.getBoard());
	
  }
}


