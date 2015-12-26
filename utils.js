function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function selectCell(x, y){
  return $('.cell[x="'+x+'"][y="'+y+'"]');
}
