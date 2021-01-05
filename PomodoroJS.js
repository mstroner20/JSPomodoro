const pomodoroTimer = document.querySelector('#pomodoroTimer');

//Buttons
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const stopButton = document.querySelector('#stopButton');
const submitButton = document.querySelector('#submitButton');

var defaultWorkLimit = 1500; //Default work timer set to 25 Minutes
var defaultBreakLimit = 300; //Default break time set to 5 Minutes

//Sets the current Time for timer
var TIME_LIMIT = defaultWorkLimit;
var BREAK_TIME = defaultBreakLimit;

//Values for circular timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

//Set initial time limit
let timeLeft = TIME_LIMIT;
//Current Time - used for increment and decrementing timer
var currentTime = TIME_LIMIT; 
//Timer variable used for resetting and pausing 
var time = null;
//Checks timer state
var isTimerOn = false; 
//Tracks user click to ensure timer is only run once 
var userClicks = 0;
//String var for current task 
var currentTask;
//Switches between timer states
var workOrBreak = 1;

var isPauseTrue = false; 



//Converts the inputs to minutes instead of seconds
document.getElementById("workDurationInput").value = defaultWorkLimit/60;
document.getElementById("breakDurationInput").value = defaultBreakLimit/60;

//Sets color based on time passed
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let remainingPathColor = COLOR_CODES.info.color;

//Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', resetTimer);
submitButton.addEventListener('click', setDurations);

//Initial setting of timer 
setTimer();

//Sets timer using inner HTML along with formatting style
function setTimer(){
  document.getElementById("pomodoroTimer").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${remainingPathColor}"
          d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;
}


//Formats time and begins the countdown
function timedCount(){
    document.getElementById("base-timer-label").innerHTML = formatTime(currentTime);
    currentTime -= 1; //decrement by 1 second
    timeLeft = currentTime;
    time = setTimeout(timedCount, 1000); //Timeout 
  
    //Sets path colors
    setCircleDasharray();
    setRemainingPathColor(currentTime);
  
    //Code for when timer finished
    if (currentTime === -1) {
      onTimesUp();
    }
}

//Timer finished 
function onTimesUp() {
  
  addToCompleteList(); //Adds task to completed list -> in future might want to allow user to continue on same task 
  workOrBreak++; //Switch state
  clearTimeout(time); //Clear timer

  if(workOrBreak % 2 == 0)
  {
    currentTime = BREAK_TIME; //Switches time to break time
  }
  else if(workOrBreak % 2 === 1){
    
    currentTime =TIME_LIMIT; //Switches time to work time
  }

  resetColorCodes(); //Resets colors for next timer
  setCircleDasharray();
  setRemainingPathColor(currentTime);
  
  timedCount(); //Restarts the timer automatically 

}

//Checks if the timer is able to begin counting down
function startTimer(){
  isTimerOn = true;
  userClicks++; //Ensures that user only starts the timer once and that it only counts down by 1 second 
  currentTask = document.getElementById("taskNameInput").value; //Grabs the users current task
  
  
  //Checks to verify timer can run
  if(isTimerOn === true && userClicks === 1 && isPauseTrue === false){ //Timer set to on and user only clicked once 
    if(currentTask != ""){ //Make sure there is a task inputted
      timedCount(); //Begin counting 
      addToList(); //Add task to incomplete task 
    }
    else{
      //Display error notification for text input 
      alert("You must input something for current task.");
      userClicks = 0; //Reset clicks
    }
    
  }

  if(isPauseTrue === true){
    timedCount();
    isPauseTrue = false; 
  }
}
//Simple pause function 
function pauseTimer(){
  clearTimeout(time);
  //Allows user to press start to resume 
  isTimerOn = false; 
  userClicks=0;
  isPauseTrue = true; 
}
//Simple reset Timer
function resetTimer(){
  clearTimeout(time); //Pauses timer temporarily 
  isTimerOn = false;  //Stop timer
  currentTime= TIME_LIMIT; //Reset the clock to old work time 
  timeLeft = currentTime;
  //Reset circle style
  document.getElementById("base-timer-label").innerHTML = formatTime(currentTime);
  setCircleDasharray();
  setRemainingPathColor(currentTime);
  userClicks = 0; //Allows restarting 

  //Clears input 
  document.getElementById("taskNameInput").value = "";
  currentTask = "";
}

//Formats the time for counting down
function formatTime(time){
    const minutes = Math.floor(time/60);

    let seconds = time % 60;

    if(seconds < 10){
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`; //Return correct format
}
//Sets circle array
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
//Sets path color based on threshold of time left
function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}
//Resets color codes if the timer is reset with new values 
function resetColorCodes(){
  document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.info.color);

  document
    .getElementById("base-timer-path-remaining")
    .classList.remove(COLOR_CODES.warning.color);
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(COLOR_CODES.alert.color);
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

//Updates the circle array 
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
//Sets durations based on user input 
function setDurations(){
  if(document.getElementById("workDurationInput").value === "")
  {
    alert("Cannot leave Work Duration empty.");
  }

  if(document.getElementById("breakDurationInput").value === "")
  {
    alert("Cannot leave Break Duration empty.");
  }
  //Converts to minutes instead of seconds
  TIME_LIMIT = convertToMinutes(document.getElementById("workDurationInput").value); 
  BREAK_TIME= convertToMinutes(document.getElementById("breakDurationInput").value);
  resetTimer();
  resetColorCodes();
}
//Convert to minutes function
function convertToMinutes(seconds){
  return seconds*60;
}
//Adds current user task to incomplete task list 
function addToList(){
  var incompleteList = document.getElementById("incompleteTaskList")
  var li = document.createElement("li"); //create new List element to be added
  li.textContent = currentTask;
  
  incompleteList.append(li); //append to bottom of list 
 
}

function addToCompleteList(){
  
  var completeList = document.getElementById("completeTaskList")
  var li = document.createElement("li"); //create new list element 

  var completeChildren = completeList.children; //grabs all elements in complete taks list 

  var checkDups = 1; //int to check if there are duplicates in the list 
  
  li.textContent = currentTask; //set new li to current task 

  if(completeChildren.length < 1){ //if no elements in list, automatically add current task 
    completeList.append(li);
  }
  else{ //more than 0 elements
     for(var i = 0; i < completeChildren.length; i++){ //loop through list 
       if(completeChildren[i].textContent === currentTask){ //Found duplicate
         checkDups = 1; //reset counter
         break; //break loop and do not add current task to list 
       }else{
         checkDups++; //element does not match current task 
       }
     }
  }

  if(checkDups === completeChildren.length+1){
    completeList.append(li); //no dups found 
    checkDups = 1; //reset counter
  }
}


