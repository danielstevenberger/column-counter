
//var numberOfRows = 0;
//var numberOfCols = 0;

//Generate The Puzzle (Part 1)

//The maximum is inclusive and the minimum is inclusive 
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

//Generates a column equal to the total(rows * 10)
// function generateColumn(rows){
//     var temp = [];
//     for(var i = 0; i < rows; i++){
//         if(i===0){
//             var currentNum = getRandomIntInclusive(1,((rows*10)-rows))
//             temp.push(currentNum);
//         }
//         else if(i > 0 && i < (rows-1)){
//             var nextNum = getRandomIntInclusive(1,(((rows*10)- currentNum)-(rows-i)));
//             temp.push(nextNum);
//             currentNum += nextNum; 
//         }
//         else{
//             temp.push((rows*10) - currentNum); 
//         }
//     }
//     return temp;
// }

//Generates a column equal to the total(rows * 10) 2222
function generateColumn(rows){
    var temp = [];
    var ratio = [1,.675,.6,.5,.4];
    var r = ((rows/2) - 1);
    for(var i = 0; i < rows; i++){
        if(i===0){
            var currentNum = getRandomIntInclusive(1,(((rows*10)-rows)*ratio[r]))
            temp.push(currentNum);
        }
        else if(i > 0 && i < (rows-1)){
            var nextNum = getRandomIntInclusive(1,((((rows*10)- currentNum)-(rows-i))*ratio[r]));
            temp.push(nextNum);
            currentNum += nextNum; 
        }
        else{
            temp.push((rows*10) - currentNum); 
        }
    }
    console.log(temp);
    return temp;
}

// create a solved version of the puzzle
function generateMatrix(rows,cols){
    var matrix = [];
    for(var i=0; i<rows; i++) {
        matrix[i] = new Array(cols);
    }
    for(var i = 0; i < cols; i++){
        var temp = generateColumn(rows);
        for(var x = 0; x < rows; x++){
            matrix[x][i] = temp[x];
        }
    }
    return matrix;
}

// split matrix into rows
function splitRows(matrix,rows,cols){
    var tempLayerOne = [];
    var tempLayerTwo = [];
    var rowArr = [];
    for(var i = 0; i < rows; i++){
        var tempArrOne = [];
        var tempArrTwo = [];
        if(i === 0){
            tempLayerOne.push(matrix[i])
        }
        else{
            for(var x = 0; x < cols; x++){
                if(x % 2 === 0){
                    tempArrOne.push(matrix[i][x]);
                    tempArrTwo.push(0);
                }
                else{
                    tempArrTwo.push(matrix[i][x]);
                    tempArrOne.push(0);
                }
            }
            tempLayerOne.push(tempArrOne);
            tempLayerTwo.push(tempArrTwo);
            rowArr.push(tempLayerOne);
            if(i === (rows - 1)){
                rowArr.push(tempLayerTwo);
            }
            else{
                tempLayerOne = [];
                tempLayerOne.push(tempArrTwo) 
                tempArrOne = [];
                tempArrTwo = [];
                tempLayerTwo = [];
            }   
        }
    }
    return rowArr;
}

// Fill Empty Spaces
function fillRows(arr,rows,cols){
    var ratio = [1,.675,.6,.5,.4];
    var r = ((rows/2) - 1);
    for(var i = 0; i < (rows - 1); i++){
        for (var z = 0; z < arr.length; z++){
            if(z === 1){
                for(var x = 0; x < cols; x++){
                    if(arr[i][z][x] === 0){
                        arr[i][z][x] = getRandomIntInclusive(1,(rows*10 - rows)*ratio[r]);  
                    }
                }
            }   
        } 
    } 

    return arr;
}

// Generate The Puzzle
function generatePuzzle(rows,cols){
    var matrix = generateMatrix(rows,cols);
    var rowArr = splitRows(matrix,rows,cols);
    var puzzle = fillRows(rowArr,rows,cols);
    return puzzle;
}

// Generate the divs
function generateDivs(puzzle){
    $(".puzzle").append(`<h2>Solve to ${numberOfRows*10}</h2>`)
    for(var i = 0; i < puzzle.length;i++){
        if(i === 0){
            $(".puzzle").append(`<div class="layer" id="layer${i+1}"></div>`)
        }
        else{
            $(".puzzle").append(`<div class="otherLayer" id="layer${i+1}"></div>`)
        }
        for(var x = 0; x < puzzle[i].length;x++){
            if(x === 0){
                $(`#layer${i+1}`).append(`<div class="outer" id ="outer${i+1}"></div>`)
                $(`#outer${i+1}`).append(`<button class="previous" id="previous${i+1}">&larr;</button>`)
                for(var z = 0; z < puzzle[i][x].length;z++){
                    if (puzzle[i][x][z] === 0){
                        $(`#outer${i+1}`).append(`<div class="hiddenBox"></div>`);
                    }
                    else{
                        $(`#outer${i+1}`).append(`<div class="box smallBox" id="box${i+1}">${puzzle[i][x][z]}</div>`);
                    }
                }
                $(`#outer${i+1}`).append(`<button class="next" id ="next${i+1}">&rarr;</button>`); 
            }
            else{
                $(`#layer${i+1}`).append(`<div class="inner" id = "inner${i+1}"></div>`)
                for(var z = 0; z < puzzle[i][x].length;z++){
                        $(`#inner${i+1}`).append(`<div class="box" id="box${i+1}">${puzzle[i][x][z]}</div>`)
                }  
            }
            
        }  
        $(`[id=box${i+1}]`).css("background-color", `${colors[i]}`)
        $(`[id=previous${i+1}]`).css("background-color", `${colors[i]}`);
        $(`[id=next${i+1}]`).css("background-color", `${colors[i]}`);
    }
    $(".puzzle").append(`<p id="equalSign">=</p>`);
    $(".puzzle").append(`<div class="sums"></div>`);
    var sumBoxes = totalSum(puzzle);
    for(var i = 0; i < puzzle[0][0].length; i++){
    $(".sums").append(`<div class="box" id="sum">${sumBoxes[i]}</div>`);
    }
    //$(`[id=sum]`).css("background-color", `lightgreen`);
}

// Rotate a given layer right
function rotateRight(puzzle,layer){
    for(var i = 0; i < puzzle[(layer-1)].length; i++){
        var temp = puzzle[(layer-1)][i].pop();   
        puzzle[(layer-1)][i].unshift(temp);
    }
    return puzzle;
}

// Rotate a given layer left
function rotateLeft(puzzle,layer){
    for(var i = 0; i < puzzle[(layer-1)].length; i++){
        var temp = puzzle[(layer-1)][i].shift();  
        puzzle[(layer-1)][i].push(temp);
    }
    return puzzle;
}


// //Combines layer to help get sum
// function combineLayers(puzzle){
//     var temp = [];
//     var combinedArr = [];
//     combinedArr.push(puzzle[0][0]);
//     combinedArr.push(puzzle[0][1]);
//     for(var i = 1; i < puzzle.length; i++){
//         for(var x = 0; x < puzzle[i].length; x++){
//             if(x === 0){
//                 for(var z = 0; z < puzzle[i][x].length; z++){
//                     if(puzzle[i][x][z] !== 0){
//                         combinedArr[i][z] = puzzle[i][x][z];
//                     }
//                 }
//             }
//             else{
//                  combinedArr.push(puzzle[i][x]); 
//             }  
//         }
//     } 
//     return combinedArr;
// }

//Combines layer to help get sum
function combineLayers(puzzle){
    var combinedArr = [];
    combinedArr.push(puzzle[0][0]);
    combinedArr.push(puzzle[0][1]);
    for(var i = 1; i < puzzle.length; i++){
        var temp = [];
        for(var x = 0; x < puzzle[i].length; x++){
            if(x === 0){
                for(var z = 0; z < puzzle[i][x].length; z++){
                    if(puzzle[i][x][z] !== 0){
                        temp.push(puzzle[i][x][z]);
                    }
                    else{
                        temp.push(combinedArr[i][z]);
                    }
                }
                combinedArr[i] = temp;
            }
            else{
                 combinedArr.push(puzzle[i][x]); 
            }  
        }
    } 
    return combinedArr;
}

//Creates array of sums 
function getSums(puzzle){
var sumArr = [];
var sum = 0;
for(var x = 0; x < puzzle[0].length; x++){
    sum = 0;
    for(var i = 0; i < puzzle.length; i++){
        sum += puzzle[i][x];
    } 
    sumArr.push(sum);
}
return sumArr;
}

//uses getSums and combineLayers
function totalSum(puzzle){
    var comArr = combineLayers(puzzle);
    var sums = getSums(comArr);
    return sums;
}

// function fillSums(puzzle){
//     var sumBoxes = $(`[id=sum]`);
//     var sumArr = totalSum(puzzle);
//     for(var i = 0; i < sumArr.length; i++){
//         sumBoxes[i].innerHTML = `${sumArr[i]}`;
//     }
// }

function winner(puzzle,rows,cols){
    var sums = totalSum(puzzle);
    var counter = 0;
    var total = (rows * 10)
    for(var i = 0; i < cols; i++){
        if(sums[i] === total){
            counter++;
        }
    }
    if((counter - cols) === 0){
        //console.log("true");
        return true;
    }
    else{
        return false;
        
    }
}

function randomRotate(puzzle,rows){
    for(var i = 0; i < rows;i++){
        var rotations = getRandomIntInclusive(5,10);
        for(var x = 0; x<rotations;x++){
            rotateLeft(puzzle,(i+1));
        }
    }
    return puzzle;
}

function rotateAtStart(puzzle,rows,cols){
    var i = 0;
    while(i < 1){
        temp = randomRotate(puzzle,rows);
        if(winner(temp,rows,cols) === false){
            i++;
        }
    }
    return puzzle;
}

function changeColor(element){
    temp = getRandomIntInclusive(1,6)
    $(element).css("color", `${colors[temp]}`);
}

function changeBgColor(element){
    temp = getRandomIntInclusive(1,6)
    $(element).css("background-color", `${colors[temp]}`);
}

function boxGrow(element){
    $(element).addClass("boxGrow");
}

// function boxShrink(element){
//     $(element).addClass("boxShrink");
// }

function boxSpin(element){
    $(element).addClass("boxRotate");
}

// function boxAnimate(element){
//     boxGrow(element);
//     setTimeout(boxShrink(element),1000);
// }

// function solution(puzzle,rows,cols){

// }

var test = generatePuzzle(2,4)

var items;
var solution;
var colors = ["slateblue","crimson","purple","orange","palevioletred","brown"];
var numberOfRows;
var numberOfCols;


$(".playButton").click(function(){
    $(".playButton").text("New Puzzle");
    $(".puzzle").empty();
    //$(".setup").hide();
    numberOfRows = $("#rows option:selected").text()
    numberOfCols = $("#cols option:selected").text()
    items = generatePuzzle(numberOfRows,numberOfCols);
    rotateAtStart(items,numberOfRows,numberOfCols);
    generateDivs(items);    
})

$(document).on('click', '.next', function(){ 
    $(".puzzle").empty();
    var btn = event.target.id
    var layer = btn.slice(-1)
    rotateRight(items,layer);
    generateDivs(items);
    if(winner(items,numberOfRows,numberOfCols)){
        $("h2").text("Winner");
        $("h2").css("color","palevioletred");
        $(".previous").attr("disabled", true);
        $(".next").attr("disabled", true);
        boxSpin(".box");
        boxGrow("h2");
    }
});

$(document).on('click', '.previous', function(){ 
    $(".puzzle").empty();
    var btn = event.target.id
    var layer = btn.slice(-1)
    rotateLeft(items,layer);
    generateDivs(items);
    if(winner(items,numberOfRows,numberOfCols)){
        $("h2").text("Winner");
        $("h2").css("color","palevioletred");
        $(".previous").attr("disabled", true);
        $(".next").attr("disabled", true);
        boxSpin(".box");
        boxGrow("h2");
    }
});



