<?php
// required headers for api
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$num = array();   //array to store the values

//PUT VALUES TO ARRAY FROM STRING
$data = file_get_contents("php://input");
for($i=1; $i<strlen($data); $i+=2){
  $num[(int)($i/18)][(int)(($i%18)/2)] = (int)$data[$i];
}

//ARRAY TO GET THE RANDOM NATURE OF RESULTS
$randomiser = range(1, 9);
shuffle($randomiser);

//ACTUAL FUNCTION CALL
sudokuSolve($num, $randomiser);

//SOLVE SUDOKU IN NUM ARRAY WITH RANDOMISER
function sudokuSolve($num, $randomiser){
  $i=$j=0;
  $flag = false;

  $possibilities = array();

  //BOARD IS SOLVED
  if(isFull($num)){

    success($num);
    return;
  }

  //FIND FIRST EMPTY SPOT (i, j)
  for($x=0; $x<9; $x++){
    for($y=0; $y<9; $y++){
      if($num[$x][$y] === 0){
        $i = $x;
        $j = $y;
        $flag = true;
        break;
      }
    }
    if($flag === true){
      break;
    }
  }

  //GET ALL THE POSSIBLE ENTRIES FOR (i, j)
  $possibilities = possible($num, $i, $j, $randomiser);

    //INPUT EACH POSSIBLE VALUES UNIT WE GET THE VALUE
    for($x=0; $x<count($possibilities); $x++){
        $num[$i][$j] = $possibilities[$x];
        //IF A SOLUTION IS FOUND SHOW IT AND STOP
        if(isFull($num)){
          success($num);
          exit;
        }
        sudokuSolve($num, $randomiser);
    }
    //BACKTRACK IF ANSWER CANNOT BE FOUND
    $num[$i][$j] = 0;
}

//CHECKS IF BOARD IF FILLED (SOLUTION FOUND)
function isFull($num){
  for($i=0; $i<9; $i++){
    for($j=0; $j<9; $j++){
      if($num[$i][$j] == 0)
        return false;
    }
  }
  return true;
}

//GET ALL POSSIBLE VALUES AT POSITION (i, j) WITH RANDOM NATURE
function possible($num, $i, $j, $randomiser){
  $possibleElements = $randomiser;

  //COLUMNS CHECK
  for($y=0; $y<9; $y++){
    if($num[$i][$y] !== 0){  //number already exists
      $index = array_search($num[$i][$y], $possibleElements);
      if($index !== FALSE){
        array_splice($possibleElements, $index, 1);
      }
    }
  }

  //ROW CHECK
  for($x=0; $x<9; $x++){
    if($num[$x][$j] !== 0){  //number already exists
      $index = array_search($num[$x][$j], $possibleElements);
      if($index !== FALSE){
        array_splice($possibleElements, $index, 1);
      }
    }
  }

  //BOX CHECK
  $k=$l=0;
  if($i>=0 && $i<=2){
      $k=0;
  }else if($i<=5){
    $k=3;
  }else{
    $k=6;
  }

  if($j>=0 && $j<=2){
    $l=0;
  }else if($j<=5){
    $l=3;
  }else{
    $l=6;
  }

  for($x=$k; $x<$k+3; $x++){
    for($y=$l; $y<$l+3; $y++){
      if($num[$x][$y] !== 0){  //number already exists
        $index = array_search($num[$x][$y], $possibleElements);
        if($index !== FALSE){
          array_splice($possibleElements, $index, 1);
        }
      }
    }
  }

  return $possibleElements;
}

//JSON ENCODE THE SOLUTION AFTER GETTING IT
function success($num){
  echo json_encode($num);
}

?>
