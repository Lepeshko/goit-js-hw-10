import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('button[data-start]');
const stopButton = document.querySelector('button[data-stop]');
const datetimePicker = document.querySelector('#datetime-picker');
const timerFields = {
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]')
};

let userSelectedDate = null;
let timerInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future'
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    }
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    datetimePicker.disabled = true;
    startCountdown();
});

stopButton.addEventListener('click', () => {
    stopCountdown();
    datetimePicker.disabled = false;
    startButton.disabled = true;
    stopButton.disabled = true;
});

function startCountdown() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const timeRemaining = userSelectedDate - now;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            datetimePicker.disabled = false;
            updateTimerDisplay(0, 0, 0, 0);
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeRemaining);
        updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
}

function stopCountdown() {
    clearInterval(timerInterval);
    updateTimerDisplay(0, 0, 0, 0);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    timerFields.days.textContent = addLeadingZero(days);
    timerFields.hours.textContent = addLeadingZero(hours);
    timerFields.minutes.textContent = addLeadingZero(minutes);
    timerFields.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}
