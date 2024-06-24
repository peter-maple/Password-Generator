// import A11yDialog from "https://cdn.jsdelivr.net/npm/a11y-dialog@8/dist/a11y-dialog.esm.min.js" /* "a11y-dialog" */;

import A11yDialog from "a11y-dialog";
// import { animate, spring } from "motion";
import "./style.css";
import "./main-structure.css";

if (process.env.NODE_ENV !== "production") {
    console.log("Looks like we are in development mode!");
}

//
// || HTML elements
//

// Fields for generated results
const resultEl = document.getElementById("result") as HTMLElement;
const spellphabetEl = document.getElementById("spellphabet") as HTMLElement;

// Primary buttons
const spellMenuBtn = document.getElementById("spell-menu-btn") as HTMLElement;
const generateBtn = document.getElementById("generate") as HTMLElement;
const clipboardBtn = document.getElementById("clipboard") as HTMLElement;

// Settings inputs
const uppercaseEl = document.getElementById("uppercase") as HTMLInputElement;
const lowercaseEl = document.getElementById("lowercase") as HTMLInputElement;
const numbersEl = document.getElementById("numbers") as HTMLInputElement;
const symbolsEl = document.getElementById("symbols") as HTMLInputElement;
const lengthEl = document.getElementById("lengthInput") as HTMLInputElement;

// Dialog elements
const spellListEl = document.getElementById("spellselect") as HTMLElement;
const spellDisplayEl = document.getElementById("words-display") as HTMLElement;
const dialogConfirmEl = document.getElementById(
    "dialog-confirm-btn"
) as HTMLElement;

// Define allowed characters
// Character codes for lowercase and uppercase letters pulled from Unicode characters (lowercase a is #97)
const charCodes = Array.from(Array(26)).map((_, i) => i + 97);
const lowerLetters = charCodes.map((code) => String.fromCharCode(code));
const upperLetters = lowerLetters.map((letter) => letter.toUpperCase());
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "="];

//
// || Modal dialogue for spellphabet selection:
//

// Identify dialog button
const confirmDialogBtn = document.querySelector(
    ".dialog-confirm-btn"
) as HTMLElement;

// Identify dialog element
const container = document.querySelector(".dialog-container") as HTMLElement;

// Initialize dialog
const dialog = new A11yDialog(container);

const symbolsToDashes = (string: string) => {
    let dashedString = string.replace(
        /([`~!@#$%^&*()_+={}:;'"<>,. \[\]\|\\\/\?])+/g,
        "-"
    );
    return dashedString.toLowerCase().trim();
};

//
// || Spelling alphabet
//

class SpellingAlphabet {
    name: string;
    id: string;
    wordList: string[];
    elementHTML: string;
    btnElem: HTMLElement | null;
    index: number;

    constructor(name: string, wordList: string[], complete = true) {
        this.name = name;
        this.id = symbolsToDashes(this.name);
        this.wordList = wordList;

        this.elementHTML = this.getHTML(this.name, this.id);

        if (complete) {
            // Add HTML for the button (see getHTML function below) to the DOM.
            spellListEl.append(
                document
                    .createRange()
                    .createContextualFragment(this.elementHTML)
            );

            // Store the button element created by the above step.
            this.btnElem = document.getElementById(this.id) as HTMLElement;

            this.btnElem.classList.add(`btn-${this.id}`);

            // Add to the list of spellphabets and note its index.
            spellphabets.push(this);
            this.index = spellphabets.length - 1;

            // Add to the keyedSpellphabets object with its ID as the key.
            keyedSpellphabets[this.id] = this;
        } else {
            this.btnElem = null;
            this.index = -1;
        }
    }

    getHTML = (name: string, id: string) => {
        return /* html */ `
            <div class="option-wrapper" id="${id}">
                <div class="option-flex">
                    <div class="currently-active-container">
                        <div class="currently-active" hidden>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 448 512"
                                title="currently active">
                                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path d="
                                    M438.6 278.6
                                    c12.5 -12.5 12.5 -32.8 0 -45.3
                                    l -160 -160
                                    c -12.5 -12.5 -32.8 -12.5 -45.3 0
                                    s -12.5 32.8 0 45.3
                                    L 338.8 224 32 224
                                    c -17.7 0 -32 14.3 -32 32
                                    s 14.3 32 32 32
                                    l 306.7 0
                                    L 233.4 393.4
                                    c -12.5 12.5 -12.5 32.8 0 45.3
                                    s 32.8 12.5 45.3 0
                                    l 160 -160 z"/>
                            </svg>
                        </div>
                    </div>
                    <button class="pushable spellphabet-option-btn btn-small" aria-checked="false" type="button">
                        <span class="spellphabet-option-front">${name}</span>
                    </button>
                    <div class="currently-displayed-container">
                        <div class="currently-displayed" hidden>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 448 512"
                                title="currently displayed">
                                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path d="
                                    M438.6 278.6
                                    c12.5 -12.5 12.5 -32.8 0 -45.3
                                    l -160 -160
                                    c -12.5 -12.5 -32.8 -12.5 -45.3 0
                                    s -12.5 32.8 0 45.3
                                    L 338.8 224 32 224
                                    c -17.7 0 -32 14.3 -32 32
                                    s 14.3 32 32 32
                                    l 306.7 0
                                    L 233.4 393.4
                                    c -12.5 12.5 -12.5 32.8 0 45.3
                                    s 32.8 12.5 45.3 0
                                    l 160 -160 z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>`;
    };
}

const spellphabets: SpellingAlphabet[] = [];
const keyedSpellphabets: { [index: string]: SpellingAlphabet } = {};

const displaySpellphabetWords = (spellphabet: SpellingAlphabet) => {
    let list = spellphabet.wordList;

    const display = list
        .map(
            (listItem) =>
                `<div class='spellphabet-display-word'>${listItem}</div>`
        )
        .join(" ");

    return display;
};

// Default letters word list if user doesn't set another
const animalsSpellphabet = new SpellingAlphabet("Animals", [
    "antelope",
    "butterfly",
    "crocodile",
    "dinosaur",
    "elephant",
    "flamingo",
    "gorilla",
    "hippo",
    "iguana",
    "jaguar",
    "kangaroo",
    "lion",
    "monkey",
    "narwhal",
    "ocelot",
    "penguin",
    "quail",
    "rhino",
    "snake",
    "tiger",
    "unicorn",
    "vulture",
    "walrus",
    "x-ray (tetra)",
    "yak",
    "zebra",
]);

// Alternative word lists for user selection
const placesSpellphabet = new SpellingAlphabet(
        "Places",
        [
            "arizona",
            "boston",
            "canada",
            "delaware",
            "egypt",
            "florida",
            "georgia",
            "hawai'i",
            "idaho",
            "jamaica",
            "kentucky",
            "louisiana",
            "montana",
            "nevada",
            "oregon",
            "pennsylvania",
            "queens",
            "rhode island",
            "switzerland",
            "tennessee",
            "utah",
            "virginia",
            "wyoming",
            "x-ray town (made up)",
            "yemen",
            "zimbabwe",
        ],
        false
    ),
    clearNEasySpellphabet = new SpellingAlphabet("Clear n' Easy", [
        "apple",
        "bagel",
        "cactus",
        "desert",
        "eagle",
        "fluffy",
        "goofy",
        "happy",
        "image",
        "joker",
        "king",
        "listen",
        "magic",
        "north",
        "omelet",
        "power",
        "queen",
        "random",
        "swamp",
        "token",
        "unique",
        "vampire",
        "water",
        "x-ray",
        "yellow",
        "zebra",
    ]),
    natureSpellphabet = new SpellingAlphabet(
        "Nature",
        [
            "a",
            "bumble bee",
            "c",
            "daisy",
            "e",
            "forest",
            "glacier",
            "highland",
            "iceberg",
            "j",
            "k",
            "lagoon",
            "meadow",
            "n",
            "o",
            "petunia",
            "q",
            "river",
            "sunrise",
            "tumbleweed",
            "u",
            "vine",
            "w",
            "x",
            "y",
            "z",
        ],
        false
    ),
    fantasySpellphabet = new SpellingAlphabet("Fantasy", [
        "amulet",
        "bewitch",
        "crystal ball",
        "dragon",
        "enchantress",
        "fairy",
        "goblin",
        "hobbit",
        "incantation",
        "jinx",
        "kingdom",
        "lady of the lake",
        "magic",
        "necromancy",
        "ogre",
        "pixie",
        "quest",
        "ritual",
        "sorcery",
        "talisman",
        "unicorn",
        "vampire",
        "wizard",
        "x-ray vision",
        "yeti",
        "zombie",
    ]),
    fruitAndVegSpellphabet = new SpellingAlphabet("Fruit n' Veg", [
        "apple",
        "banana",
        "cucumber",
        "dragonfruit",
        "eggplant",
        "fig",
        "grapes",
        "honeydew",
        "iceberg lettuce",
        "juice",
        "kiwi",
        "lemon",
        "mango",
        "nectarine",
        "orange",
        "pomegranate",
        "quince",
        "raspberry",
        "strawberry",
        "tomato",
        "ugli",
        "vine",
        "watermelon",
        "x-ray fruit (made up)",
        "yam",
        "zucchini",
    ]),
    spaceSpellphabet = new SpellingAlphabet("Space", [
        "asteroid",
        "black hole",
        "comet",
        "dark matter",
        "eclipse",
        "flying saucer",
        "galaxy",
        "heliocentric",
        "ice giant",
        "jupiter",
        "kuiper belt",
        "lightyear",
        "mars",
        "nebula",
        "orbit",
        "pluto",
        "quasar",
        "rocket",
        "space",
        "telescope",
        "universe",
        "vacuum",
        "white dwarf",
        "x-rays",
        "year",
        "zodiac",
    ]);

// Static "spellphabet" words: symbols and numbers

// Symbols
const symbolsObj = {
    "!": "exclamation point",
    "@": "at symbol",
    "#": "hash symbol",
    $: "dollar sign",
    "%": "percent symbol",
    "^": "caret symbol",
    "&": "ampersand",
    "*": "asterix",
    "=": "equals sign",
};

const generateSpellphabet = (
    password: string,
    // Provide animalsSpellphabet as a default argument:
    currentSpellphabetList: string[] = animalsSpellphabet.wordList
) => {
    interface SpellingAlphabetType {
        [index: string]: string;
    }

    // Create and present spelling alphabet for generated password
    const spellphabetObj: SpellingAlphabetType = {};

    for (const [key, value] of Object.entries(symbolsObj)) {
        spellphabetObj[
            key
        ] = `<span class='output-symbol'><i>${value}</i></span>`;
    }

    // Push numbers array into the final spellphabet with "number" label
    numbers.forEach((num) => {
        spellphabetObj[
            num
        ] = `<span class='output-number'>number ${num}</span>`;
    });

    // Variable "spellphabet" words: letters
    // ToDo: modify currentSpellphabetList - define with ternary statement that checks if a custom wordlist was input?

    // Combine letters array with the selected spellphabet.
    // For each lowercase letter, create a key-value pair in the spellphabet object of "[letter]: [word]"
    lowerLetters.forEach((letter: string, index: number) => {
        spellphabetObj[letter] = currentSpellphabetList.at(index) as string;
    });

    // For each capital letter, create a key-value pair in the spellphabet object of "[letter]: [WORD]"
    upperLetters.forEach((letter: string, index: number) => {
        const upperSpellphabet = currentSpellphabetList.map((word) =>
            word.toUpperCase()
        );

        spellphabetObj[letter] = upperSpellphabet.at(index) as string;
    });

    // Create an array from the individual characters of the generated PW.
    let generatedPWChars = Array.from(password);

    // map() creates a corresponding array, replacing each character with its corresponding "spelling" string.
    const generatedSpellingPW = generatedPWChars.map(
        (char) => spellphabetObj[char]
    );

    // join() turns the array into a single string, in this case connected with " - ".
    const spellingPW = generatedSpellingPW.join(" — ");

    return spellingPW;
};

//
// || Basic PW settings
//

interface Settings {
    length: number;
    lower: boolean;
    upper: boolean;
    num: boolean;
    sym: boolean;
    spellphabet: SpellingAlphabet;
}
const settings: Settings = {
    // Default values:
    length: 15,
    lower: true,
    upper: true,
    num: true,
    sym: false,
    spellphabet: animalsSpellphabet,
};

function updateSettings() {
    settings.length = Number(lengthEl.value);
    settings.lower = lowercaseEl.checked;
    settings.upper = uppercaseEl.checked;
    settings.num = numbersEl.checked;
    settings.sym = symbolsEl.checked;

    if (localStorage.getItem("spellphabet")) {
        let stored = localStorage.getItem("spellphabet") as string;
        let spellphabet = JSON.parse(stored);
        settings.spellphabet = spellphabet;
    }
}

// Listen for changes to variables and update ~local storage~
lengthEl.onchange = updateSettings;
uppercaseEl.onchange = updateSettings;
lowercaseEl.onchange = updateSettings;
numbersEl.onchange = updateSettings;
symbolsEl.onchange = updateSettings;

const checkDisplayedButton = (spellphabet: SpellingAlphabet) => {
    const buttons = Array.from(
        document.querySelectorAll(`.option-wrapper button`)
    );

    // Get the button that matches spellphabet arg.
    const displayedButton = document.querySelector(
        `#${spellphabet.id} button`
    ) as HTMLElement;

    buttons.forEach((btn) => btn.setAttribute("aria-checked", "false"));
    displayedButton.setAttribute("aria-checked", "true");
};

const setDisplayedSpellphabet = (spellphabet: SpellingAlphabet) => {
    checkDisplayedButton(spellphabet);

    const currentlyDisplayedMarkers = Array.from(
        document.querySelectorAll(`.currently-displayed`)
    );

    const currentMarker = document.querySelector(
        `#${spellphabet.id} .currently-displayed`
    ) as HTMLElement;

    currentlyDisplayedMarkers.forEach((el) =>
        el.setAttribute("hidden", "hidden")
    );

    currentMarker.removeAttribute("hidden");

    // Display the words of the spellphabet.
    spellDisplayEl.innerHTML = displaySpellphabetWords(spellphabet);
    spellDisplayEl.setAttribute("data-displayed", `${spellphabet.index}`);

    // Update confirm button text
    const confirmBtnFrontEl = dialogConfirmEl.querySelector(
        `.front`
    ) as HTMLSpanElement;
    confirmBtnFrontEl.textContent = `"${spellphabet.name} spellphabet, I choose you!"`;
};

const setStoredSpellphabet = function (spellphabet: SpellingAlphabet) {
    localStorage.setItem("spellphabet", JSON.stringify(spellphabet));
};

const setActiveSpellphabet = (spellphabet: SpellingAlphabet) => {
    const markers = Array.from(document.querySelectorAll(`.currently-active`));

    const currentMarker = document.querySelector(
        `#${spellphabet.id} .currently-active`
    ) as HTMLElement;

    markers.forEach((el) => el.setAttribute("hidden", "hidden"));

    currentMarker.removeAttribute("hidden");

    // Store the selected spelling alphabet for future browser settings.
    setStoredSpellphabet(spellphabet);

    // Update the settings object with the selected spelling alphabet.
    settings.spellphabet = spellphabet;

    // Generate a spelling alphabet version of PW with the new spelling alphabet and pass the result to spellphabetEl.
    spellphabetEl.innerHTML = generateSpellphabet(
        resultEl.innerText,
        settings.spellphabet.wordList
    );
};

//
// || Handler functions
//

const handleSpellMenuBtn = function () {
    const activeButtonMarker = document.querySelector(
        `.option-wrapper .currently-active:not([hidden])`
    ) as HTMLElement;

    const activeButtonWrapper = activeButtonMarker.closest(
        ".option-wrapper"
    ) as HTMLElement;
    console.log("activebtn:", activeButtonWrapper);

    const activeSpellphabet = keyedSpellphabets[activeButtonWrapper.id];

    setDisplayedSpellphabet(activeSpellphabet);
};

const handleSpellSelectBtn = function (clickEvent: Event) {
    const selectedOptionWrapper = clickEvent.currentTarget as HTMLElement;
    setDisplayedSpellphabet(keyedSpellphabets[selectedOptionWrapper.id]);
};

const handleDialogConfirm = function () {
    setActiveSpellphabet(
        spellphabets.at(
            Number(spellDisplayEl.getAttribute("data-displayed"))
        ) as SpellingAlphabet
    );
};

// Add event listeners to buttons.

// Individual spellphabet buttons:
const spellphabetOptionButtons = Array.from(
    document.querySelectorAll(`.option-wrapper`)
);
spellphabetOptionButtons.forEach((button) =>
    button.addEventListener("click", handleSpellSelectBtn)
);

// Spellphabet settings menu button:
spellMenuBtn.addEventListener("click", handleSpellMenuBtn);

// "I choose you!"/dialog close button:
dialogConfirmEl.addEventListener("click", handleDialogConfirm);

//
// || Initialization
//

/**
 * @returns The pre-set spelling alphabet from localStorage or the default.
 */
const getSpellphabet = () => {
    const stored = localStorage.getItem("spellphabet");
    let spellphabet: SpellingAlphabet;

    if (stored) spellphabet = JSON.parse(stored);
    else spellphabet = settings.spellphabet;

    return spellphabet;
};

const initializeSpellphabet = (spellphabet: SpellingAlphabet) => {
    setDisplayedSpellphabet(spellphabet);
    setActiveSpellphabet(spellphabet);
};

document.addEventListener("DOMContentLoaded", () => {
    const spellphabet = getSpellphabet();
    initializeSpellphabet(spellphabet);
});

//
// || Core functionality
//

// Determine the available characters based off the current settings.
const getAvailableCharacters = (settings: Settings): (string | number)[] => {
    const availableCharacters = [
        // If settings.lower is true, include lowerLetters in availableCharacters.
        // This uses spread syntax (e.g., ...) to add the individual characters within lowerLetters instead of the lowerLetters Array as a single entry.
        ...(settings.lower ? lowerLetters : []),

        // Rinse and repeat.
        ...(settings.upper ? upperLetters : []),
        ...(settings.num ? numbers : []),
        ...(settings.sym ? symbols : []),
    ];

    return availableCharacters;
};

const fetchRandomCharacter = (availableCharacters: (string | number)[]) => {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const randomCharacter = availableCharacters[randomIndex];
    return randomCharacter;
};

const randomArrFrom = (
    availableCharacters: (string | number)[],
    arrayLength: number
) => {
    const arr = [];

    for (let i = 0; i < arrayLength; i++) {
        arr.push(fetchRandomCharacter(availableCharacters));
    }

    return arr;
};

// Generate password function
const generatePassword = (settings: Settings): string | void => {
    const availableCharacters = getAvailableCharacters(settings);

    const passwordCharacters = randomArrFrom(
        availableCharacters,
        settings.length
    );

    const rawPassword = passwordCharacters.join("");

    // Add <span> elements to password to provide stylable classes for coloring.
    // 1. Define regex filters:
    const numbersRegex = /(\d+)/g;
    const symbolsRegex = /(\W+)/g;

    // 2. Replace the password characters with appropriate spans:
    const finalPasswordHTML = rawPassword
        .replace(symbolsRegex, "<span class='output-symbol'>$1</span>")
        .replace(numbersRegex, "<span class='output-number'>$1</span>");

    return finalPasswordHTML;
};

//
// || Generate password button
//

const handleGenerate = function (settings: Settings) {
    // Call generate password function, pass result to resultEl.
    const newPW = generatePassword(settings);

    if (newPW) {
        // Update displayed HTML.
        resultEl.innerHTML = newPW;

        // Read innerText property to ignore markup.
        const pword = resultEl.innerText;

        // Generate a spelling alphabet version of PW, pass result to spellphabetEl.
        spellphabetEl.innerHTML = generateSpellphabet(
            pword,
            settings.spellphabet.wordList
        );
    }
};

// Pass GUI variables to the Generate button on click
generateBtn.addEventListener("click", () => {
    handleGenerate(settings);
});

//
// || Copy button
//

// navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
//     if (result.state === "granted" || result.state === "prompt") {
//         /* write to the clipboard now */
//         console.log(result.state, "permission granted");
//     }
// });

// button.addEventListener("click", () => writeClipboardText("<empty clipboard>"));

async function writeClipboardText(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error: any) {
        console.error(error.message);
    }
}

const copyPasswordNav = async function () {
    const password = resultEl.innerText;

    if (!password) {
        alert("Nothing to copy. Generate a password first.");
        return;
    }

    await writeClipboardText(password);

    alert("Password copied to clipboard.");

    return;
};

// const copyPassword = function () {
//     const password = resultEl.innerText;

//     if (!password) {
//         alert("Nothing to copy. Generate a password first.");
//         return;
//     }

//     const textarea = document.createElement("textarea");

//     textarea.value = password;
//     document.body.appendChild(textarea);
//     textarea.select();
//     document.execCommand("copy");
//     textarea.remove();
//     alert("Password copied to clipboard.");

//     return;
// };

const handleCopy = () => copyPasswordNav();

// Copy result on clipboard button click:
clipboardBtn.addEventListener("click", handleCopy);

//
// || Keyboard shortcuts
//

window.addEventListener(
    "keydown",
    (event) => {
        if (event.defaultPrevented) {
            // Do nothing if the event was already processed.
            return;
        }

        switch (event.key) {
            case "G":
            case "P":
                handleGenerate(settings);
                break;

            case "C":
                handleCopy();
                break;

            // Quit when this doesn't handle the key event.
            default:
                return;
        }

        // Cancel the default action to avoid it being handled twice.
        event.preventDefault();
    },
    true
);
