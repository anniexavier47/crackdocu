var url = './solve.php';    //link to send the request

let solveButton = document.getElementById("solve"),
  clearButton = document.getElementById("clear"),
  initiallyFilled = [];

solveButton.addEventListener('click', solve);
clearButton.addEventListener('click', clearAll);


//INPUT ALL THE NUMBERS FROM INPUTS TO A 2-D ARRAY AND CHECK CORRECTNESS OF DEFAULT CONFIGURATION
function solve(){
  var el,
    numbers = [],
    errorFlag = false;

  //MAKE THE ARRAY 2-D
  for(let i=0; i<9; i++){
    numbers[i] = [];
  }

  //IF STATE ALREADY SAVED
  if(initiallyFilled.length === 0){
    for(let i=0; el = document.querySelectorAll("input[type=number]")[i]; i++){
      let value = parseFloat(el.value);

      //VALIDATION OF INPUT
      if( (el.value !== "" && !(/^\d$/.test(value))) ){
        el.classList.add("error");
        errorFlag = true;
        continue;
      }else if(el.classList.contains("error")){
        el.classList.remove("error");
      }
      if(isNaN(value)){
        value = 0;
      }

      //IF ALL IS WELL PUSH INTO 2-D ARRAY AND SAVE CURRENT STATE
      initiallyFilled[i] = value;
      numbers[parseInt(i/9)][i%9] = value;
    }
  }else{
    for(let i=0; i<81; i++){
      numbers[parseInt(i/9)][i%9] = initiallyFilled[i];
    }
  }

  //IF VALIDATION HAD GONE WRONG STOP EXECUTIONs
  if(errorFlag){
    initiallyFilled = [];
    return;
  }

  //CHECK CURRENT CONFIGURATION
  if(checkState(numbers) !== true){
    initiallyFilled = [];
    return;
  }else{
    setDefaults(initiallyFilled);
    numbers1DArray = convertTo1D(numbers);

    //SEND ASYNCRONOUS REQUEST
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(numbers1DArray),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => fillUp(response))
    .catch(error => console.error('Error:', error))
  }
}

//CLEAR THE BOARD
function clearAll(){
  for (let i = 0; el = document.querySelectorAll("input.dark[type=number]")[i]; i++) {
    el.disabled = false;
  }
  clearButton.classList.remove('active');
  initiallyFilled = [];
  for(let i=0; el = document.querySelectorAll("input[type=number]")[i]; i++){
    el.classList.remove('dark');
    el.classList.remove('error');
    el.value = '';
  }
}

//SET DEFAULT INPUTS
function setDefaults(config){
  for(let i=0; i<config.length; i++){
    if(config[i] != 0){
      let el = document.querySelectorAll("input[type=number]")[i];
      el.classList.add('dark');
      el.disabled = true;
    }
  }
}

//CONVERT 2-D ARRAY TO 1-D ARRAY
function convertTo1D(numbers){
  OneDArray = [];
  for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
      OneDArray[(9*i)+j] = numbers[i][j];
    }
  }
  return OneDArray;
}

//FILL THE INPUT COLUMNS WITH RESULT
function fillUp(num){

  clearButton.classList.add('active');

  numbers = convertTo1D(num);
  for(let i=0; el = document.querySelectorAll("input[type=number]")[i]; i++){
    el.value = numbers[i];
  }

}

//CHECK IF CURRENT ARRAY IS ALL OKAY
function checkState(num){
  errorFlag = false;

  //CHECK ROWS
  for(let i=0; i<9; i++){
    for(let j=0; j<8; j++){
      for(let k=j+1; k<9; k++){
        if(num[i][k] == num[i][j] && num[i][j] !== 0){
          showErrorAt( [i, k] );
          showErrorAt( [i, j] );
          errorFlag = true;
        }
      }
    }
  }

  //CHECK COLUMNS
  for(let i=0; i<9; i++){
    for(let j=0; j<8; j++){
      for(let k=j+1; k<9; k++){
        if(num[k][i] == num[j][i] && num[j][i] !== 0){
          showErrorAt( [k, i] );
          showErrorAt( [j, i] );
          errorFlag = true;
        }
      }
    }
  }

  //CHECK BOX
  for(let n=0; n<3; n++){
    for(let i=0; i<3; i++){
      for(let j=0; j<3; j++){
        for(let k=0; k<3; k++){
          for(let l=0; l<3; l++){
            for(let m=0; m<3; m++){
              if(num[l+(n*3)][m+(i*3)] == num[j+(n*3)][k+(i*3)] && l!==j && k!==m && num[j+(n*3)][k+(i*3)] !== 0){
                showErrorAt( [eval((n*3)+l), eval(m+(i*3))] );
                showErrorAt( [eval((n*3)+j), eval(k+(i*3))] );
                errorFlag = true;
              }
            }
          }
        }
      }
    }
  }
  return !errorFlag;
}

//SHOWS ERROR AT A SPECIFIC LOCATION
function showErrorAt(pos){
  let i = pos[0]*9+pos[1];
  document.querySelectorAll("input[type=number]")[i].classList.add("error");
}
