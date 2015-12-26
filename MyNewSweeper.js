var SAFE = 0;
var MINE = 1;
var FLAG = 2;
var REVELADO = 4;

var campoMatrix = [];
var gOpts;
var cellsToWin;

var minasVizinhasAttr = 'nm';

var defaults = {
  gameElement: '#game',
  cellsToWin: '#toWin',

  numRows: 12,
  numColumns: 12,
  numMines: 20,

  tooManyMinesMsg: "The number of mines can't exceed #percent# of the blocks. Using #numberOfMines# mines this round.",
  cellsToWinMsg: '#cellsToWin# remaining hidden cells.',

  test : false,
  classes : {
    rows: 'row',
    flag: 'btn-success',
    hidden: 'btn-info',
    mine: 'btn-danger',
    revealed: 'btn-default',
    allCells: 'cell btn'
  },
  numberColors: [
    '#421ecc',
    '#c30f19',
    '#42b60b',
    '#d7a3c2',
    '#cc38ba',
    '#76471f',
    '#1ddffb',
    '#177a70'
  ],
  mineLimit : 0.75,
  init : function(){
    this.row = "<div class='"+this.classes.rows+"'></div>";
    this.cell = "<div class='"+this.classes.allCells+" "+this.classes.hidden+"'><strong></strong></div>";
  },
  onGameOver: function(){
    alert('Game Over!');
  },
  onClick: function(){},
  onWin: function(){
    alert('You won!');
  },
  onExceedNumerOfMines: function(msg){
    alert(msg);
  }
};

function MyNewSweeper(opts){
  //Inner objects merge with defaults
  opts.classes = $.extend({}, defaults.classes, opts.classes);
  //Global object merge
  gOpts = $.extend({}, defaults, opts);
  //
  gOpts.init();

  geraCampo();
  $('body').on('mousedown', '.'+gOpts.classes.allCells.split(' ').join('.'), function(evt){
    var _this = $(this);
    var clickedX = _this.attr('x');
    var clickedY = _this.attr('y');
    gOpts.onClick();
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
  geraMinas();
  geraVizinhanca();
  updateCellsToWin();
}

function teste(f){
  if (gOpts.test) {
    f();
  }
}

function clickRight(x, y){
  if(campoMatrix[x][y] == SAFE || campoMatrix[x][y] == MINE){
    teste(function(){
      console.log('Adding FLAG');
    });
    campoMatrix[x][y] += FLAG;
    selectCell(x, y).removeClass(gOpts.classes.hidden).addClass(gOpts.classes.flag);
  } else if(campoMatrix[x][y] != REVELADO){
    teste(function(){
      console.log('Removing FLAG');
    });
    campoMatrix[x][y] -= FLAG;
    selectCell(x, y).removeClass(gOpts.classes.flag).addClass(gOpts.classes.hidden);
  }
}

function clickLeft(x, y){
  if(campoMatrix[x][y] == MINE){
    revealMines();
    gOpts.onGameOver();
    return;
  }
  if(campoMatrix[x][y] != FLAG && campoMatrix[x][y] != REVELADO){
    revelarClicado(x, y)
  }
}

function revealMines(){
  for (var x = 0; x < gOpts.numRows; x++) {
    for (var y = 0; y < gOpts.numColumns; y++) {
      if(campoMatrix[x][y] == MINE){
        selectCell(x,y).removeClass(gOpts.classes.hidden).addClass(gOpts.classes.mine);
      }
    }
  }
}

function updateCellsToWin(){
  $(gOpts.cellsToWin).text(gOpts.cellsToWinMsg.replace('#cellsToWin#', cellsToWin))
  if(cellsToWin == 0){
    gOpts.onWin();
  }
}

function revelarClicado(x, y){
  cellsToWin--;
  campoMatrix[x][y] = REVELADO;
  var clickedCell = selectCell(x, y);
  var nearMines = clickedCell.attr(minasVizinhasAttr);
  clickedCell = clickedCell.removeClass(gOpts.classes.hidden).addClass(gOpts.classes.revealed);
  if(nearMines != 0){
    clickedCell.find('strong').text(nearMines).css('color', gOpts.numberColors[nearMines-1]);
  }
  updateCellsToWin();
  if(nearMines == 0){
    abreVizinhos(x, y);
  }
}

function abreVizinhos(x, y){
  for (var i = x-1; i <= x+1; i++) {
    if(i >= 0 && i < gOpts.numRows){
      for (var j = y-1; j <= y+1; j++) {
        if(j >= 0 && j < gOpts.numColumns){
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
    console.log('Gerando Campo: ',gOpts.numRows,'x',gOpts.numColumns);
  });
  var campo = $(gOpts.gameElement);
  campo.empty();
  campoMatrix = [];
  for (var x = 0; x < gOpts.numRows; x++) {
    var lastAddedRow = $(gOpts.row).appendTo(campo);
    campoMatrix[x] = [];
    for (var y = 0; y < gOpts.numColumns; y++) {
      campoMatrix[x][y] = SAFE;
      $(gOpts.cell).appendTo(lastAddedRow).attr('x', x).attr('y', y);
    }
  }
}

function geraMinas(){
  if(gOpts.numMines/(gOpts.numRows * gOpts.numColumns) > gOpts.mineLimit){
    gOpts.numMines = Math.floor(gOpts.numRows * gOpts.numColumns * gOpts.mineLimit);

    var msg = gOpts.tooManyMinesMsg.replace('#percent#', gOpts.mineLimit*100 + '%');
    msg = msg.replace('#numberOfMines#', gOpts.numMines);
    gOpts.onExceedNumerOfMines(msg);
  }
  cellsToWin = gOpts.numRows * gOpts.numColumns - gOpts.numMines;
  teste(function(){
    console.log('Gerando '+gOpts.numMines+' minas');
  });
  for (var i = 0; i < gOpts.numMines; i++) {
    var x, y;
    do {
      x = randomIntFromInterval(0, gOpts.numRows-1);
      y = randomIntFromInterval(0, gOpts.numColumns-1);
    } while (campoMatrix[x][y] != SAFE);
    campoMatrix[x][y] = MINE;
    teste(function(){
      selectCell(x,y).removeClass(gOpts.classes.hidden).addClass(gOpts.classes.mine);
    });
  }
}

function geraVizinhanca(){
  for (var x = 0; x < gOpts.numRows; x++) {
    for (var y = 0; y < gOpts.numColumns; y++) {
      if(campoMatrix[x][y] == SAFE){
        selectCell(x,y).attr(minasVizinhasAttr, contaMinasVizinhas(x,y));
      }
    }
  }
}

function contaMinasVizinhas(x, y){
  var n = 0;
  for (var i = x-1; i <= x+1; i++) {
    if(i >= 0 && i < gOpts.numRows){
      for (var j = y-1; j <= y+1; j++) {
        if(j >= 0 && j < gOpts.numColumns){
          if(campoMatrix[i][j] == MINE){
            n++;
          }
        }
      }
    }
  }
  return n;
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function selectCell(x, y){
  return $('.cell[x="'+x+'"][y="'+y+'"]');
}
