# MyNewSweeper 
---
MyNewSweeper is a customizable minesweeper game. 
### [Online Demo](http://matheusvellone.github.io/MyNewSweeper) [Installation](https://github.com/MatheusVellone/MyNewSweeper#installation) [Configuration](https://github.com/MatheusVellone/MyNewSweeper#configuration)
---
# Installation
Just create a new MyNewSweeper object passing to the constructor the desired configuration
```
<script>
    new MyNewSweeper({options});
</script>
```
**MyNewSweeper is [jQuery](https://jquery.com/) dependant. Make sure jQuery is loaded before initializing MNS**

# Configuration
**The default configuration requires [Bootstrap](htpp://getbootstrap.com/) to work correctly**

``option``-``type``-``default``=>Explanation

``gameSelector``-``string``-``#game``=>Selector to the parent element of the game

``cellsToWinSelector``-``string/false``-``#toWin``=>Selector to the display the ``cellsToWinMsg``. ``false`` to disable

(TODO) ``timeSelector``-``string/false``-``#elapsedTime``=>Selector to the the ``timeMessage``. ``false`` to disable

(TODO) ``timeMessage``-``string``-``#seconds# seconds elapsed``=>Message of the time elapsed

``restartOnGameOver``-``boolean``-``true``=>Auto restart on game over

``numRows``-``int``-``12``=>Number of rows of the game

``numColumns``-``int``-``12``=>Number of columns of the game

``numMines``-``int``-``20``=>Number of mines on the game

``tooManyMinesMsg``-``string``-``The number of mines can't exceed #percent# of the number of cells. Using #numberOfMines# mines this round.``=>String parameter that will be passed to the ``onExceedNumberOfMines`` function.

``cellsToWinMsg``-``string``-``#cellsToWin# remaining hidden cells.``=>Message to display on ``cellsToWinSelector`` (if enabled)

``classes``-``object``=>The classes to be added on the game elements. **Separate classes with a whitespace**. Defaults:
```js
classes : {
    rows: 'row', //parent class for each grid row
    flag: 'btn-success', //class for flagged cells
    clickedMine: 'btn-primary', //class for the clicked mine (when player click on a mine cell)
    hidden: 'btn-info', //class for all hidden/undiscovered cells
    mine: 'btn-danger', //class for all mines (displayed when user click on a mine and the game show all mines positions)
    revealed: 'btn-default', //class for all revealed cells (number cells)
    wrongFlag: 'btn-warning', //class for wrong positioned flags
    allCells: 'btn cell' //classes added on all cells
  },
```

``numberColors``-``array/list``-``['#421ecc','#c30f19','#42b60b','#d7a3c2','#cc38ba','#76471f','#1ddffb','#177a70']``=>List of colors of the number of mines aroubd the cell. **The position of the color on the array matches the number of mines around the clicked cell minus 1. Like this: [0] = 1 mine around, [1] = 2 mines around, [2] = 3 mines around...**

``mineLimit``-``float``-``0.75``=>Maximum ratio of mines on the grid. If ``numMines`` exceed this percentage, then the ``numMines`` is calculated based on ``mineLimit``

``onGameOver``-``function``=>Function to be called when game is over. Default: 
```js
onGameOver: function(){
    alert('Game Over!');
}
```

``onClick``-``function``=>Function to be called when a cell is clicked (**any mouse click on the grid will trigger this function**). Parameter ``which`` = **event.which**. Default: 
```js
onClick: function(which){}
```

``onWin``-``function``=>Function to be called when the player win the game. Default: 
```js
onWin: function(){
    alert('You won!');
}
```

``onExceedNumberOfMines``-``function``=>Function to be called when the ``numMines`` exceed ``mineLimit``. It receives ``tooManyMinesMsg`` as parameter. Default: 
```js
onExceedNumberOfMines: function(msg){
    alert(msg);
}
```
