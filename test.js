$(function(){
  $('#start').on('click', function(){
    var mns = new MyNewSweeper({
      numRows: $('#numRows').val(),
      numColumns: $('#numColumns').val(),
      numMines: $('#numMines').val()
    });
  });
});
