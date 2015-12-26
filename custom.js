var TESTE;
var SAFE = 0;
var MINA = 1;
var FLAG = 2;
var REVELADO = 3;

var row = "<div class='row'></div>";
var cell = "<div class='"+classes.all+" "+classes.hidden+"'></div>";

var campoMatrix = [];

var nX, nY, minas, cellsToWin;

$(function(){
  $('#gerar').on('click', function(){
    TESTE = $('#debug').is(':checked');
    nX = $('#nX').val();
    nY = $('#nY').val();
    minas = $('#minas').val();
    geraCampo();
    geraMinas();
    geraVizinhanca();
  });

  $('body').on('mousedown', '.cell', function(evt){
    var _this = $(this);
    var clickedX = _this.attr('x');
    var clickedY = _this.attr('y');
    switch (event.which) {
        case 1://LEFT
            teste(function(){
              console.log('Left Click on ',clickedX,clickedY);
            });
            clickLeft(clickedX, clickedY);
            break;
        case 2://MIDDLE
            break;
        case 3://RIGHT
            teste(function(){
              console.log('Right Click on: ',clickedX,clickedY);
            });
            clickRight(clickedX, clickedY);
            break;
        default://ANY OTHER BUTTON
    }
  });
});

function teste(f){
  if (TESTE) {
    f();
  }
}

function clickRight(x, y){
  if(campoMatrix[x][y] < FLAG){
    teste(function(){
      console.log('Adding FLAG');
    });
    campoMatrix[x][y] += FLAG;
    selectCell(x, y).removeClass(classes.hidden).addClass(classes.flag);
  } else{
    teste(function(){
      console.log('Removing FLAG');
    });
    campoMatrix[x][y] -= FLAG;
    selectCell(x, y).removeClass(classes.flag).addClass(classes.hidden);
  }
}

function clickLeft(x, y){
  if(campoMatrix[x][y] == MINA){
    alert('GAME OVER');
    $('#gerar').click();
    return;
  }
  if(campoMatrix[x][y] != FLAG){
    revelarClicado(x, y)
  }
}

function updateCellsToWin(){
  cellsToWin--;
  if(cellsToWin == 0){
    alert('Você venceu!');
    // $('#gerar').click();
  }
}

function revelarClicado(x, y){
  campoMatrix[x][y] = REVELADO;
  var clickedCell = selectCell(x, y);
  var nearMines = clickedCell.attr('minasVizinhas');
  clickedCell.removeClass(classes.hidden).addClass(classes.revealed).text(nearMines);
  updateCellsToWin();
  if(nearMines == 0){
    teste(function(){
      console.log('Sem minas perto de ', x, y, 'Explorando vizinhos');
    });
    abreVizinhos(x, y);
  }
}

function abreVizinhos(x, y){
  for (var i = x-1; i <= x+1; i++) {
    if(i >= 0 && i < nX){
      for (var j = y-1; j <= y+1; j++) {
        if(j >= 0 && j < nY){
          if(campoMatrix[i][j] == SAFE){
            revelarClicado(i, j);
          }
        }
      }
    }
  }
}

function geraCampo(){
  teste(function(){
    console.log('Gerando Campo: ',nX,'x',nY);
  });
  var campo = $('#game');
  campo.empty();
  campoMatrix = [];
  for (var x = 0; x < nX; x++) {
    var lastAddedRow = $(row).appendTo(campo);
    campoMatrix[x] = [];
    for (var y = 0; y < nY; y++) {
      campoMatrix[x][y] = SAFE;
      $(cell).appendTo(lastAddedRow).attr('x', x).attr('y', y);
    }
  }
}

function geraMinas(){
  if(minas/(nX * nY) > maxMinas){
    // $('#game').empty();
    minas = Math.floor(nX * nY * maxMinas);
    alert('Número de minas maior ou igual ao número de posições. Utilizando '+maxMinas*100+'% ('+minas+') das posições como minas.');
  }
  cellsToWin = nX * nY - minas;
  teste(function(){
    console.log('Gerando '+minas+' minas');
  });
  for (var i = 0; i < minas; i++) {
    var x, y;
    do {
      x = randomIntFromInterval(0, nX-1);
      y = randomIntFromInterval(0, nY-1);
    } while (campoMatrix[x][y] != SAFE);
    campoMatrix[x][y] = MINA;
    teste(function(){
      selectCell(x,y).removeClass(classes.hidden).addClass(classes.mine);
    });
  }
}

function geraVizinhanca(){
  for (var x = 0; x < nX; x++) {
    for (var y = 0; y < nY; y++) {
      if(campoMatrix[x][y] == SAFE){
        selectCell(x,y).attr('minasVizinhas', contaMinasVizinhas(x,y));
      }
    }
  }
}

function contaMinasVizinhas(x, y){
  var n = 0;
  for (var i = x-1; i <= x+1; i++) {
    if(i >= 0 && i < nX){
      for (var j = y-1; j <= y+1; j++) {
        if(j >= 0 && j < nY){
          if(campoMatrix[i][j] == MINA){
            n++;
          }
        }
      }
    }
  }
  return n;
}
