$(function(){
  $('#start').on('click', function(){
    var mns = new MyNewSweeper({
      numRows: $('#numRows').val(),
      numColumns: $('#numColumns').val(),
      numMines: $('#numMines').val(),

      classes: {
        flag: 'btn-success glyphicon glyphicon-flag',
        mine: 'btn-danger glyphicon glyphicon-screenshot',
        clickedMine: 'btn-primary glyphicon glyphicon-fire'
      }
    });
  });
});
