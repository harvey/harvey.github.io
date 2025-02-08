document.addEventListener("DOMContentLoaded", function() {
    // Setup default localStorage values if they don't exist
    if (!localStorage.getItem('panoptoExtSpeed')) {
        localStorage.setItem('panoptoExtSpeed', '1');
    }

    if (!localStorage.getItem('panoptoExtToggle')) {
        localStorage.setItem('panoptoExtToggle', 'false');
    }

    // Get DOM elements
    const slider = document.getElementById('dynamicSlider');
    const editableSpan = document.getElementById('sliderValue');
    const checkBox = document.getElementById('startupSpeed');

    // Set checkbox based on localStorage toggle value
    let toggleValue = localStorage.getItem('panoptoExtToggle');
    if (toggleValue === "true") {
        checkBox.checked = true;
    }

    checkBox.addEventListener('click', () => {
        if (checkBox.checked) {
            localStorage.setItem('panoptoExtToggle', 'true');
        } else {
            localStorage.setItem('panoptoExtToggle', 'false');
        }
        console.log("Toggle:", localStorage.getItem('panoptoExtToggle'));
        // Chrome communication removed
    });

    // Setup the editable speed display
    editableSpan.textContent = localStorage.getItem('panoptoExtSpeed') + "x";
    console.log("Current speed:", editableSpan.textContent);

    editableSpan.addEventListener('click', () => {
        editableSpan.setAttribute('contenteditable', 'true');
        editableSpan.focus();
    });

    editableSpan.addEventListener('blur', () => {
        editableSpan.removeAttribute('contenteditable');
        editableSpan.textContent = removeAllNonNums(editableSpan.textContent) + "x";
        // Chrome communication removed
    });

    editableSpan.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            editableSpan.blur();
        } else if (!isNumericKey(event)) {
            event.preventDefault();
        }
    });

    // Removes non-numeric characters, updates storage and slider value
    function removeAllNonNums(textStr) {
        let output = textStr.replace(/[^\d.]/g, '');
        const floatValue = parseFloat(output);
        if (!isNaN(floatValue)) {
            localStorage.setItem('panoptoExtSpeed', floatValue.toString());
            slider.value = floatValue.toString();
            return floatValue.toString();
        }
        const intValue = parseInt(output);
        if (!isNaN(intValue)) {
            localStorage.setItem('panoptoExtSpeed', intValue.toString());
            slider.value = intValue.toString();
            return intValue.toString();
        }
        return '1.00';
    }

    // Helper: Only allow numeric keys and a few necessary control keys
    function isNumericKey(event) {
        const key = event.key;
        return (key >= '0' && key <= '9') || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'x', 'X', '.', 'Ctrl', 'a'].includes(key);
    }

    // Initialize slider with stored speed value
    let storedSpeed = parseFloat(localStorage.getItem('panoptoExtSpeed'));
    if (isNaN(storedSpeed)) {
        storedSpeed = 1;
        localStorage.setItem('panoptoExtSpeed', '1');
    }
    const sliderValue = document.getElementById('sliderValue');

    // Adjust the slider's max if stored speed exceeds it
    let currentMax = parseFloat(slider.max);
    if (storedSpeed > currentMax) {
        slider.max = storedSpeed;
    }

    slider.value = storedSpeed;
    sliderValue.innerText = `${storedSpeed.toFixed(2)}x`;

    slider.addEventListener('input', function() {
        updateSlider(this);
    });

    function updateSlider(sliderElem) {
        let value = parseFloat(sliderElem.value);
        localStorage.setItem('panoptoExtSpeed', value);
        sliderValue.innerText = `${value.toFixed(2)}x`;
    }

    // Format time in a user-friendly string (if needed for display)
    function formatTime(seconds) {
        const days = Math.floor(seconds / 86400);
        seconds %= 86400;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        let formattedTime = "";
        if (days > 0) formattedTime += `${days} day${days !== 1 ? "s" : ""}, `;
        if (hours > 0) formattedTime += `${hours} hour${hours !== 1 ? "s" : ""}, `;
        if (minutes > 0) formattedTime += `${minutes} minute${minutes !== 1 ? "s" : ""}, `;
        if (seconds > 0 || formattedTime === "") formattedTime += `${seconds} second${seconds !== 1 ? "s" : ""}`;
        return formattedTime.replace(/, $/, "");
    }

    // Simulated time saved counter—imagine a video is always playing!
    // It increments by the difference between current speed and normal speed.
    // Only when the accumulated saved time exceeds one full second is the display updated.
    const timeSavedEl = document.getElementById("timeSaved");
    if (timeSavedEl) {
        let displayedTimeSaved = 0; // in integer seconds
        let accumulatedFraction = 0; // stores partial seconds
        timeSavedEl.textContent = formatTime(displayedTimeSaved);
        setInterval(() => {
            let currentSpeed = parseFloat(localStorage.getItem('panoptoExtSpeed'));
            if (isNaN(currentSpeed)) {
                currentSpeed = 1;
            }
            // Calculate how many seconds are saved in one actual second.
            // If the speed is 1, no time is saved. For speed 2, 1 second is saved per second.
            const secondsSavedThisTick = Math.max(0, currentSpeed - 1);
            accumulatedFraction += secondsSavedThisTick;
            if (accumulatedFraction >= 1) {
                const increment = Math.floor(accumulatedFraction);
                displayedTimeSaved += increment;
                accumulatedFraction -= increment;
                timeSavedEl.textContent = formatTime(displayedTimeSaved);
            }
        }, 1000);
    }
});