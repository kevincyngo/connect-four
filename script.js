var lastClicked;
var count = 0;
var grid = clickableGrid(6,7,function(el,row,col,i){
    if ( count % 2 == 0 && el.id === "") {
        el.id = 'yellow';
        count++;
    }else if (el.id === "") {
        el.id = 'red';
        count++;
    }
});

document.getElementById("master").appendChild(grid);
     
function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}