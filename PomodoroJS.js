const pomodoroTimer = document.querySelector('#pomodoroTimer');

//Buttons
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const stopButton = document.querySelector('#stopButton');
const submitButton = document.querySelector('#submitButton');

var defaultWorkLimit = 1500;
var defaultBreakLimit = 300;

var TIME_LIMIT = defaultWorkLimit;
var BREAK_TIME = defaultBreakLimit;





const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;


let timePassed = 0;
let timeLeft = TIME_LIMIT;

let timerInterval = null;
let pauseTime = 0;

var c = TIME_LIMIT; 
var t;

var isTimerOn = false; 
var userClicks = 0;

var currentTask;

var workOrBreak = 1;


document.getElementById("workDurationInput").value = defaultWorkLimit/60;
document.getElementById("breakDurationInput").value = defaultBreakLimit/60;

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

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', resetTimer);
submitButton.addEventListener('click', setDurations);

setTimer();

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



function timedCount(){
    document.getElementById("base-timer-label").innerHTML = formatTime(c);
    c = c - 1;
    timeLeft = c;
    t = setTimeout(timedCount, 1000);
  
    setCircleDasharray();
    setRemainingPathColor(c);
  
    if (c === -1) {
      onTimesUp();
    }
}

function onTimesUp() {
  
  workOrBreak++; //Break time
  clearTimeout(t);

  if(workOrBreak % 2 == 0)
  {
    //breakTime
    //alert("ITS TIME TO BREAK"); //Break Alert
    c = BREAK_TIME;

  }
  else if(workOrBreak % 2 === 1){
    
    c =TIME_LIMIT;
    
  }
  
  resetColorCodes();
  setCircleDasharray();
  setRemainingPathColor(c);
  
  timedCount();

}

function startTimer(){
  isTimerOn = true;
  userClicks++;
  currentTask = document.getElementById("taskNameInput").value;
  if(isTimerOn === true && userClicks === 1){
    if(currentTask != ""){
      timedCount();
    }
    else{
      //Display notification for text input 
      alert("You must input something for current task.");
      userClicks = 0;
    }
    
  }
}

function pauseTimer(){
  clearTimeout(t);
  isTimerOn = false; 
  userClicks=0;
}

function resetTimer(){
  clearTimeout(t);
  isTimerOn = false; 
  c= TIME_LIMIT;
  timeLeft = c;
  document.getElementById("base-timer-label").innerHTML = formatTime(c);
  setCircleDasharray();
  setRemainingPathColor(c);
  userClicks = 0;

  document.getElementById("taskNameInput").value = "";
  currentTask = "";
}


function formatTime(time){
    const minutes = Math.floor(time/60);

    let seconds = time % 60;

    if(seconds < 10){
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

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

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function setDurations(){
  if(document.getElementById("workDurationInput").value === "")
  {
    alert("Cannot leave Work Duration empty.");
  }

  if(document.getElementById("breakDurationInput").value === "")
  {
    alert("Cannot leave Break Duration empty.");
  }

  TIME_LIMIT = convertToMinutes(document.getElementById("workDurationInput").value);
  BREAK_TIME= convertToMinutes(document.getElementById("breakDurationInput").value);
  resetTimer();
  resetColorCodes();
}

function convertToMinutes(seconds){
  return seconds*60;
}

