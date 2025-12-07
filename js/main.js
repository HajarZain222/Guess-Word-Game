// Setting Game Name
let nameOfGame = 'Guess The Word';
document.title = nameOfGame;
document.querySelector('h1').innerHTML = nameOfGame;
document.querySelector('footer').innerHTML = `${nameOfGame} Created By Hajar Zain`;

// Setting Game Area
let numbersOfLetters = 6;
let numbersOfTries = 5;
let currentTry = 1;
let numbersOfHints = 2;

// Manage Words
let wordToGuess = '';

let words = ["PLANET", "GARDEN", "MARKET", "ORANGE", "POCKET", "MONKEY", "WINTER", "FLOWER", "CASTLE", "BRIDGE", "BUTTON", "STRONG", "ANIMAL", "FUTURE", "SPIRIT"]
let secretWord = words[Math.floor(Math.random() * words.length)];
console.log(secretWord);

let messageArea = document.querySelector('.message');

// Manage Hint
document.querySelector('.hint span').innerHTML = numbersOfHints;
const hintButton = document.querySelector('.hint');

hintButton.addEventListener('click', handleHint);

function generateInputs() {
    let inputsContainer = document.querySelector('.inputs'); 

    // Create tries
    for (let i = 1; i <= numbersOfTries; i++) {
        const tryDiv = document.createElement('div');
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span class="try-number">Try ${i}</span>`;

        if (i !== 1) {
            tryDiv.classList.add('disabled-try');
        }

        // Create inputs
        for (let j = 1; j <= numbersOfLetters; j++) {
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute('maxlength', '1');

            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);
    }
    // Focus on first input of first try
    inputsContainer.children[0].children[1].focus();

    // Disable all inputs except first
    const inputsInDisabledTry = document.querySelectorAll('.disabled-try input');
    inputsInDisabledTry.forEach(input => {
        input.disabled = true;
    });

    // Convert all inputs to uppercase
    const allInputs = document.querySelectorAll('input');

    allInputs.forEach(input => {
        // Input Event
        input.addEventListener('input', (e) => {
            const currentIndex = Array.from(allInputs).indexOf(e.target); // or this or input

            e.target.value = input.value.toUpperCase();

            // Focus on next input automatically
            const nextInput = currentIndex + 1;
            if (nextInput < allInputs.length) {
                allInputs[nextInput].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            const currentIndex = Array.from(allInputs).indexOf(e.target); // or this or input

            // Move to Right
            if (e.key === 'ArrowRight') {
                const nextInput = currentIndex + 1;
                if (nextInput < allInputs.length) {
                    allInputs[nextInput].focus();
                }
            }
            // Move to Left
            if (e.key === 'ArrowLeft') {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) {
                    allInputs[prevInput].focus();
                }
            }
        })
    });
}

const guessButton = document.querySelector('.check');

guessButton.addEventListener('click', handleGuesses);

function handleGuesses() {
    let successGuess = true;

    for(let i = 1; i <= numbersOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        let letter = inputField.value.toUpperCase();
        const actualLetter = secretWord[i - 1];

        // Game Logic
        if (letter === actualLetter) {
            // Letter is Correct and in the right place
            inputField.classList.add('in-place');
        } else if (secretWord.includes(letter) && letter !== "") {
            // Letter is Correct but not in the right place
            inputField.classList.add('not-in-place');
            successGuess = false;
        } else {
            // Letter is not in the word
            inputField.classList.add('not-in-word');
            successGuess = false;
        }
    }

    // Check If User Win or Lose
    if (successGuess) {
        // If User did not use hints
        if(numbersOfHints === 2) {
            messageArea.innerHTML = `
            <p>Congratulations! You Won Without Using Any Hints 🎉</p>
            <p>The Word Was <span>${secretWord}</span></p>
            `;
        }
        else {
            messageArea.innerHTML = `
            <p>Congratulations! You Won 🎉</p>
            <p>The Word Was <span>${secretWord}</span></p>
            `;
        }

        // Disable All Tries
        let allTries = document.querySelectorAll('.inputs > div');
        allTries.forEach(tryDiv => {
            tryDiv.classList.add('disabled-try');
        });

        // Disable Guess & Hint Button
        guessButton.disabled = true;
        hintButton.disabled = true;
    }
    else {
        // User Lose
        document.querySelector(`.try-${currentTry}`).classList.add('disabled-try');
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach(input => {
            input.disabled = true;
        });

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach(input => {
            input.disabled = false;
        });
        

        let element = document.querySelector(`.try-${currentTry}`);
        if (element) {
            document.querySelector(`.try-${currentTry}`).classList.remove('disabled-try');
            element.children[1].focus();
        } else {
            messageArea.innerHTML = `You Lose! The Word Was <span>${secretWord}</span>`;
            // Disable Guess & Hint Button
            guessButton.disabled = true;
            hintButton.disabled = true;
        }

    }
}

function handleHint() {
    if (numbersOfHints > 0 ) {
        numbersOfHints--;
        document.querySelector('.hint span').innerHTML = numbersOfHints;
        
    } 
    if (numbersOfHints === 0) {
        hintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll('input:not([disabled])');
    const emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === '');

    if(emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

        if(indexToFill !== -1) {
            randomInput.value = secretWord[indexToFill];
        }
    }
}

function handleBackSpace(Event) {
    if(Event.key === 'Backspace') {
        const allInputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(allInputs).indexOf(document.activeElement);

        if(currentIndex > 0) {
            const currentInput = allInputs[currentIndex];
            const prevInput = allInputs[currentIndex - 1];
            currentInput.value = '';
            prevInput.value = '';
            prevInput.focus();
        }
    }
}

document.addEventListener('keydown', handleBackSpace)
window.onload = () => {
    generateInputs();
}

