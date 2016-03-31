var SAFE = 0;
var MINE = 1;
var FLAG = 2;
var REVELADO = 4;
var TEST = false;

var dificulties = {
  easy : 0.07,
  medium : 0.20,
  hard : 0.33,
  luckiest : 0.40
}

var campoMatrix = [];
var gOpts;
var cellsToWin;
var cellSelector;

var minasVizinhasAttr = 'nm';

var defaults = {
  gameSelector: '#game',
  cellsToWinSelector: '#toWin',
  timeSelector: '#elapsedTime',

  restartOnGameOver: true,

  numRows: 12,
  numColumns: 12,
  numMines: 20,

  tooManyMinesMsg: "The number of mines can't exceed #percent# of the number of cells. Using #numberOfMines# mines this round.",
  cellsToWinMsg: '#cellsToWin# remaining hidden cells.',

  classes : {
    rows: 'row',
    flag: 'btn-success',
    clickedMine: 'btn-primary',
    hidden: 'btn-info',
    mine: 'btn-danger',
    revealed: 'btn-default',
    wrongFlag: 'btn-warning',
    allCells: 'btn cell'
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
  onGameOver: function(){
    alert('Game Over!');
  },
  onClick: function(which){},
  onWin: function(){
    alert('You won!');
  },
  onExceedNumberOfMines: function(msg){
    alert(msg);
  }
};

function MyNewSweeper(opts){
  //Inner objects merge with defaults
  opts.classes = $.extend({}, defaults.classes, opts.classes);
  //Global object merge
  gOpts = $.extend({}, defaults, opts);
  //Mount elements (rows, cells...) base on classes
  MNS_init();

  start();
}

function MNS_init(){
	gOpts.row = "<div class='"+gOpts.classes.rows+"'></div>";
    gOpts.cell = "<div class='"+gOpts.classes.allCells+" "+gOpts.classes.hidden+"'><strong></strong></div>";
}

function start(){
  cellSelector = '.'+gOpts.classes.allCells.split(' ').join('.');
  geraCampo();
  geraMinas();
  geraVizinhanca();
  updateCellsToWin();
  $(cellSelector).on('mousedown', function(evt){
    var _this = $(this);
    var clickedX = _this.attr('x');
    var clickedY = _this.attr('y');
    gOpts.onClick(event.which);
    switch (event.which) {
        case 1://LEFT
            teste(function(){
              console.log('Left Click on ',clickedX,clickedY);
            });
            clickLeft(clickedX, clickedY);
            break;
        case 3://RIGHT
            teste(function(){
              console.log('Right Click on: ',clickedX,clickedY);
            });
            clickRight(clickedX, clickedY);
            break;
    }
  });
  $(gOpts.gameSelector).attr('oncontextmenu',"return false;");
}

function teste(f){
  if (TEST) {
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

function gameOver(callback){
  callback();
  if(gOpts.restartOnGameOver){
    start();
  }
}

function clickLeft(x, y){
  if(campoMatrix[x][y] == MINE){
    revealMines();
    selectCell(x,y).removeClass(gOpts.classes.mine).addClass(gOpts.classes.clickedMine);
    gameOver(gOpts.onGameOver);
    return;
  }
  if(campoMatrix[x][y] == SAFE || campoMatrix[x][y] == MINE){
    revelar(x, y);
    updateCellsToWin();
  }
}

function revealMines(){
  for (var x = 0; x < gOpts.numRows; x++) {
    for (var y = 0; y < gOpts.numColumns; y++) {
      if(campoMatrix[x][y] == MINE){
        selectCell(x,y).removeClass(gOpts.classes.hidden).addClass(gOpts.classes.mine);
      } else if(campoMatrix[x][y] == (SAFE + FLAG)){
        selectCell(x,y).removeClass(gOpts.classes.hidden).addClass(gOpts.classes.wrongFlag);
      }
    }
  }
}

function updateCellsToWin(){
  if(gOpts.cellsToWinMsg !== false){
    var replaceMap = {
      '#cellsToWin#': cellsToWin
    };
    $(gOpts.cellsToWinSelector).text(replaceAll(gOpts.cellsToWinMsg, replaceMap));
  }
  if(cellsToWin == 0){
    gameOver(gOpts.onWin);
  }
}

function revelar(x, y){
  cellsToWin--;
  campoMatrix[x][y] = REVELADO;
  var cell = selectCell(x, y);
  var nearMines = cell.attr(minasVizinhasAttr);
  cell = cell.removeClass(gOpts.classes.hidden).addClass(gOpts.classes.revealed);
  if(nearMines == 0){
    abreVizinhos(parseInt(x), parseInt(y));
  } else{
    cell.find('strong').text(nearMines).css('color', gOpts.numberColors[nearMines-1]);
  }
}

function abreVizinhos(x, y){
  for (var i = x-1; i <= x+1; i++) {
    if(i >= 0 && i < gOpts.numRows){
      for (var j = y-1; j <= y+1; j++) {
        if(j >= 0 && j < gOpts.numColumns){
          if(campoMatrix[i][j] == SAFE){
            revelar(i, j);
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
  var campo = $(gOpts.gameSelector);
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
  if(isNaN(gOpts.numMines)) {
    if (!dificulties.hasOwnProperty(gOpts.numMines)){
      throw new Error('Incorrect numMines parameter. Use some number or some of the available dificulties: '+Object.keys(dificulties).join(','));
      return;
    }
    gOpts.numMines = Math.floor(gOpts.numRows * gOpts.numColumns * dificulties[gOpts.numMines]);
  } else if(gOpts.numMines/(gOpts.numRows * gOpts.numColumns) > gOpts.mineLimit){
    gOpts.numMines = Math.floor(gOpts.numRows * gOpts.numColumns * gOpts.mineLimit);

    if(tooManyMinesMsg !== false){
      var replaceMap = {
        '#percent#': gOpts.mineLimit*100 + '%',
        '#numberOfMines#': gOpts.numMines
      };
      gOpts.onExceedNumberOfMines(replaceAll(gOpts.tooManyMinesMsg, replaceMap));
    }
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

function replaceAll(msg, map){
  for(var rplc in map){
    msg = msg.replace(rplc, map[rplc]);
  }
  return msg;
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
  return $(cellSelector+'[x="'+x+'"][y="'+y+'"]');
}
