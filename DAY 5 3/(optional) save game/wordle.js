/**
 * Objective:
 * 1) Using objects (aka dictionary)
 * 2) Update game status and announce win or lose
 * 3) Save game and load game - optional
 * 4) Browser technology (save things to Local Storage) - optional
 */

const wordList = ["apple", "paper", "melon", "zebra", "books", "cheap"];

const rating = {
    unknown: 0,
    absent: 1,
    present: 2,
    correct: 3,
};

function startGame(round) {
    /* First show what variables we need to save */
    // const userAttempts = [];
    // const highlightedRows = [];
    // let status = "in-progress";
    // let attemptCount = 0;
    // let keyboard = getKeyboard();

    /* And what we will not save */
    // const answer = wordList[0];

    /* Then use the load or start game method */
    let {
        attemptCount,
        userAttempts,
        highlightedRows,
        keyboard,
        answer,
        status,
    } = loadOrStartGame();

    while (attemptCount < round && status === "in-progress") {
        let currentGuess = prompt("Guess a five letter word: ");
        // 1. Check if word is in word list
        if (isInputCorrect(currentGuess)) {
            console.log(currentGuess);
            // Update user attempts
            userAttempts.push(currentGuess);
            // 2. absent (grey), present (yellow), correct (green)
            const highlightedCharacters = checkCharacters(currentGuess, answer);
            highlightedRows.push(highlightedCharacters);
            console.log(highlightedCharacters);
            // 3. highlight keyboard
            keyboard = updateKeyboardHighlights(
                keyboard,
                currentGuess,
                highlightedCharacters
            );
            console.log(keyboard);
            // 4. update status
            status = updateGameStatus(
                currentGuess,
                answer,
                attemptCount,
                round - 1
            );
            // 5. Update attempt count
            attemptCount = attemptCount + 1;
            // 6. Save game
            saveGame({
                attemptCount,
                keyboard,
                userAttempts,
                highlightedRows,
            });
        } else {
            retry(currentGuess);
        }
    }
    if (status === "success") {
        alert("Congratulations");
    } else {
        alert(`The word is ${answer}`);
    }
}

function updateGameStatus(currentGuess, answer, attemptCount, round) {
    if (currentGuess === answer) {
        return "success";
    }
    if (attemptCount === round) {
        return "failure";
    }
    return "in-progress";
}

function saveGame(gameState) {
    window.localStorage.setItem("PREFACE_WORDLE", JSON.stringify(gameState));
}

function loadOrStartGame() {
    const answer = wordList[0];

    const prevGame = JSON.parse(window.localStorage.getItem("PREFACE_WORDLE"));

    if (prevGame) {
        return {
            ...prevGame,
            answer,
        };
    }
    return {
        attemptCount: 0,
        userAttempts: [],
        highlightedRows: [],
        keyboard: getKeyboard(),
        answer,
        status: "in-progress",
    };
}

function isInputCorrect(word) {
    return wordList.includes(word);
}

function retry(word) {
    alert(`${word} is not in word list`);
}

function checkCharacters(word, answer) {
    // 1. split characters
    const wordSplit = word.split("");
    const result = [];

    // 2. check order of characters
    wordSplit.forEach((character, index) => {
        if (character === answer[index]) {
            // 2a. correct = index of word equal index of answer
            result.push("correct");
        } else if (answer.includes(character)) {
            // 2b. present = if not correct, character is part of answer
            result.push("present");
        } else {
            // 2c. absent = else, it must be absent
            result.push("absent");
        }
    });

    return result;
}

function getKeyboard() {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const entries = [];
    for (const alphabet of alphabets) {
        entries.push([alphabet, "unknown"]);
    }
    return Object.fromEntries(entries);
}

function updateKeyboardHighlights(
    keyboard,
    currentGuess,
    highlightedCharacter
) {
    // 5a. use currentGuess ("apple") highlightedCharacters (["correct", "present"...])
    // 5b. compare keyboard["a"] with "correct",
    // if keyboard status < "correct", update keyboard
    const newKeyboard = Object.assign({}, keyboard);

    for (let i = 0; i < highlightedCharacter.length; i++) {
        const character = currentGuess[i]; // R
        const nextStatus = highlightedCharacter[i]; // absent
        const nextRating = rating[nextStatus]; // 1
        const previousStatus = newKeyboard[character]; // unknown
        const previousRating = rating[previousStatus]; // 0

        if (nextRating > previousRating) {
            newKeyboard[character] = nextStatus;
        }
    }

    return newKeyboard;
}
startGame(2);
