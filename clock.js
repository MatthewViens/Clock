const main              = document.getElementById('main'),
      clockButton       = document.getElementById('clock-button'),
      alarmButton       = document.getElementById('alarm-button'),
      timerButton       = document.getElementById('timer-button'),
      digital           = document.getElementById('digital'),
      analog            = document.getElementById('analog'),
      hourHand          = analog.querySelector('.hour'),
      minuteHand        = analog.querySelector('.minute'),
      secondHand        = analog.querySelector('.second'),
      clockDisplay      = document.getElementById('clock-display'),
      alarmDisplay      = document.getElementById('alarm-display'),
      alarmTime         = document.getElementById('alarm-time'),
      alarmHours        = document.getElementById('alarm-hours'),
      alarmMinutes      = document.getElementById('alarm-minutes'),
      alarmSeconds      = document.getElementById('alarm-seconds'),
      alarmCancelButton = document.getElementById('alarm-cancel-button'),
      alarmStartButton  = document.getElementById('alarm-start-button'),
      timerDisplay      = document.getElementById('timer-display'),
      timerTime         = document.getElementById('timer-time'),
      timerStartButton  = document.getElementById('timer-start-button'),
      timerResetButton  = document.getElementById('timer-reset-button');

let clockTimer,
    alarmTimer,
    timerTimer,
    blinkTimer,
    ampm,
    datetime  = new Date(),
    hours     = datetime.getHours(),
    minutes   = datetime.getMinutes(),
    seconds   = datetime.getSeconds();

if(hours > 12) {
  hours -= 12;
  ampm = 'PM';
} else if(hours === 0) {
  ampm = 'AM';
  hours = 12;
} else if(hours < 12) {
  ampm = 'AM';
} else if(hours === 12) {
  ampm = 'PM';
}

/* ===============
CLOCK
================== */

let clock = {
  hours:    hours,
  minutes:  minutes,
  seconds:  seconds,
  ampm:     ampm,

  updateTime: function() {
    this.seconds++;

    if(this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if(this.minutes >= 60) {
      this.minutes = 0;
      this.hours++;
    }

    if(this.hours >= 13){
      this.hours = 1;
      if(ampm === 'AM') {
        ampm === 'PM';
      } else(ampm === 'AM');
    }
  },

  renderTime: function() {
    hourHand.style.transform = `rotate(${30 * clock.hours}deg)`;
    minuteHand.style.transform = `rotate(${6 * clock.minutes}deg)`;
    secondHand.style.transform = `rotate(${6 * clock.seconds}deg)`;
    digitalHTML = `<h1>${this.hours}:${formatTime(this.minutes)}:${formatTime(this.seconds)} ${this.ampm}</h1>`;
    digital.innerHTML = digitalHTML;
  }
}

let showClockDisplay = () => {
  resetMenuItems();
  clockButton.classList.add('active');
  resetEventListeners();
  clockButton.removeEventListener('click', showClockDisplay);
  alarmDisplay.style.display = 'none';
  timerDisplay.style.display = 'none';
  clockDisplay.style.display = 'flex';
}

let updateClockDisplay = () => {
  clock.updateTime();
  clock.renderTime();
}

/* ===============
ALARM
================== */

let alarm = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  done: false,

  cancel: function() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.running = false;
    this.done = false;
  },

  updateTime: function () {
    if(this.seconds === 0 &&
      this.minutes === 0 &&
      this.hours === 0) {
        clearInterval(alarmTimer);
        this.done = true;
        blinkTimer = setInterval(blink, 750);
        return;
      }

    this.seconds--;

    if(this.seconds < 0) {
      this.seconds = 59;
      this.minutes--;
    }

    if(this.minutes < 0) {
      this.minutes = 59;
      this.hours--;
    }
  },

  renderTime: function() {
    alarmHours.value = formatTime(alarm.hours);
    alarmMinutes.value = formatTime(alarm.minutes);
    alarmSeconds.value = formatTime(alarm.seconds);
  }
}

let showAlarmDisplay = () => {
  resetMenuItems();
  alarmButton.classList.add('active');
  resetEventListeners();
  alarmButton.removeEventListener('click', showTimerDisplay);
  clockDisplay.style.display = 'none';
  timerDisplay.style.display = 'none';
  alarmDisplay.style.display = 'flex';
}

let updateAlarmDisplay = () => {
  alarm.updateTime();
  alarm.renderTime();
}

let blink = () => {
  if(alarmTime.style.visibility === 'visible'){
    alarmTime.style.visibility = 'hidden';
  } else {
    alarmTime.style.visibility = 'visible';
  }
}

/* ===============
TIMER
================== */

let timer = {
  milliseconds: 0,
  seconds: 0,
  minutes: 0,
  running: false,

  reset: function() {
    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.running = false;
  },

  updateTime: function() {
    this.milliseconds++;

    if(this.milliseconds >= 100) {
      this.milliseconds = 0;
      this.seconds++;
    }

    if(this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }
  },

  renderTime: function() {
    timerTime.textContent = `${formatTime(this.minutes)}:${formatTime(this.seconds)}:${formatTime(this.milliseconds)}`;
  }
}

let showTimerDisplay = () => {
  resetMenuItems();
  timerButton.classList.add('active');
  resetEventListeners();
  timerButton.removeEventListener('click', showTimerDisplay);
  clockDisplay.style.display = 'none';
  alarmDisplay.style.display = 'none';
  timerDisplay.style.display = 'flex';
  timer.renderTime();
}

let updateTimerDisplay = () => {
  timer.updateTime();
  timer.renderTime();
}

/* ===============
EVENT LISTENERS
================== */

timerStartButton.addEventListener('click', () => {
  if(timer.running){
    clearInterval(timerTimer);
    timerStartButton.textContent = 'Start';
    timer.running = false;
  } else {
    timerTimer = setInterval(updateTimerDisplay, 10);
    timerStartButton.textContent = 'Stop';
    timer.running = true;
  }
});

timerResetButton.addEventListener('click', () => {
  clearInterval(timerTimer);
  timerStartButton.textContent = 'Start';
  timer.reset();
  timer.renderTime();
});

alarmStartButton.addEventListener('click', () => {
  if(alarm.running && !alarm.done) {
    clearInterval(alarmTimer);
    alarmStartButton.textContent = 'Start';
    alarm.running = false;
  } else {
    if(!alarmHours.disabled) {
      alarm.hours = alarmHours.value || 0;
      alarm.minutes = alarmMinutes.value || 0;
      alarm.seconds = alarmSeconds.value || 0;
      alarmHours.disabled = true;
      alarmMinutes.disabled = true;
      alarmSeconds.disabled = true;
    }
    if(!isNaN(alarmHours.value) && !isNaN(alarmMinutes.value) && !isNaN(alarmSeconds.value) && !alarm.done) {
      alarmStartButton.textContent = 'Pause';
      alarmTimer = setInterval(updateAlarmDisplay, 1000);
      alarm.running = true;
    }
  }
});

alarmCancelButton.addEventListener('click', () => {
  clearInterval(alarmTimer);
  alarm.cancel();
  alarmHours.value = '';
  alarmMinutes.value = '';
  alarmSeconds.value = '';
  alarmHours.disabled = false;
  alarmMinutes.disabled = false;
  alarmSeconds.disabled = false;
  alarmStartButton.textContent = 'Start';
  clearInterval(blinkTimer);
});

/* ===============
HELPER FUNCTIONS
================== */

let resetEventListeners = () => {
  clockButton.addEventListener('click', showClockDisplay);
  timerButton.addEventListener('click', showTimerDisplay);
  alarmButton.addEventListener('click', showAlarmDisplay);
}

let resetMenuItems = () => {
  clockButton.classList.remove('active');
  timerButton.classList.remove('active');
  alarmButton.classList.remove('active');
}

let formatTime = (time) => {
  if(time.toString().length < 2) {
    return '0' + time.toString();
  }
  return time;
}

/* ===============
INITIAL SETUP
================== */

resetEventListeners();
updateClockDisplay();
showClockDisplay();
clockTimer = setInterval(updateClockDisplay, 1000);
