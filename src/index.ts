// import A11yDialog from "https://cdn.jsdelivr.net/npm/a11y-dialog@8/dist/a11y-dialog.esm.min.js" /* "a11y-dialog" */;

import A11yDialog from "a11y-dialog";
import { animate, spring } from "motion";
import "./style.css";

if (process.env.NODE_ENV !== "production") {
    console.log("Looks like we are in development mode!");
}

// Identify HTML elements

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

// Initialize custom menu button
// ref: https://github.com/Heydon/inclusive-menu-button/tree/master

// Define allowed characters
// Character codes for lowercase and uppercase letters pulled from Unicode characters (lowercase a is #97)
const charCodes = Array.from(Array(26)).map((_, i) => i + 97);
const lowerLetters = charCodes.map((code) => String.fromCharCode(code));
const upperLetters = lowerLetters.map((letter) => letter.toUpperCase());
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "="];

// || Modal dialogue for spellphabet selection:

// Identify dialog button
const confirmDialogBtn = document.querySelector(
    ".dialog-confirm-btn"
) as HTMLElement;

// Identify dialog element
const container = document.querySelector(".dialog-container") as HTMLElement;

// Initialize dialog
const dialog = new A11yDialog(container);

const symbolsToDashes = function (string: string) {
    let dashedString = string.replace(
        /([`~!@#$%^&*()_+={}:;'"<>,. \[\]\|\\\/\?])+/g,
        "-"
    );
    return dashedString.toLowerCase().trim();
};

// || Spelling alphabet

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
        return `
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
        "dragon",
        "empire",
        "feisty",
        "goblet",
        "happy",
        "igloo",
        "joker",
        "king",
        "loudly",
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

// Unchanging "spellphabet" words: symbols and numbers
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
    currentSpellphabet: string[] = animalsSpellphabet.wordList
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
    // ToDo: modify currentSpellphabet - define with ternary statement that checks if a custom wordlist was input?

    // Combine letters array with the set spellphabet.
    // For each lowercase letter, create a key-value pair in the spellphabet object of "[letter]: [word]"
    lowerLetters.forEach((letter: string, index: number) => {
        spellphabetObj[letter] = currentSpellphabet.at(index) as string;
    });

    // For each capital letter, create a key-value pair in the spellphabet object of "[letter]: [WORD]"
    upperLetters.forEach((letter: string, index: number) => {
        const upperSpellphabet = currentSpellphabet.map((word) =>
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

// || Basic PW settings

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
    settings.length = +lengthEl.value;
    settings.lower = lowercaseEl.checked;
    settings.upper = uppercaseEl.checked;
    settings.num = numbersEl.checked;
    settings.sym = symbolsEl.checked;
}

// Listen for changes to variables and update ~local storage~
lengthEl.onchange = updateSettings;
uppercaseEl.onchange = updateSettings;
lowercaseEl.onchange = updateSettings;
numbersEl.onchange = updateSettings;
symbolsEl.onchange = updateSettings;

const setDisplayedSpellphabet = (spellphabet: SpellingAlphabet) => {
    const buttons = Array.from(
        document.querySelectorAll(`.option-wrapper button`)
    );

    const activeButton = document.querySelector(
        `#${spellphabet.id} button`
    ) as HTMLElement;

    buttons.forEach((btn) => btn.setAttribute("aria-checked", "false"));
    activeButton.setAttribute("aria-checked", "true");

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

    // ToDo:
    // Change border color

    // Update confirm button text
    const confirmBtnFrontEl = dialogConfirmEl.querySelector(
        `.front`
    ) as HTMLSpanElement;
    confirmBtnFrontEl.textContent = `"${spellphabet.name} spellphabet, I choose you!"`;
};

const setActiveSpellphabet = (spellphabet: SpellingAlphabet) => {
    const buttons = Array.from(
        document.querySelectorAll(`.option-wrapper button`)
    );

    const markers = Array.from(document.querySelectorAll(`.currently-active`));

    const currentMarker = document.querySelector(
        `#${spellphabet.id} .currently-active`
    ) as HTMLElement;

    markers.forEach((el) => el.setAttribute("hidden", "hidden"));

    currentMarker.removeAttribute("hidden");

    // updateSpellphabet(spellphabet);
    settings.spellphabet = spellphabet;

    // Generate a spelling alphabet version of PW, pass result to spellphabetEl
    spellphabetEl.innerHTML = generateSpellphabet(
        resultEl.innerText,
        settings.spellphabet.wordList
    );
};

const handleSpellMenuBtn = () => {
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

const handleSpellSelectBtn = (clickEvent: Event) => {
    const selectedOptionWrapper = clickEvent.currentTarget as HTMLElement;
    setDisplayedSpellphabet(keyedSpellphabets[selectedOptionWrapper.id]);
};

const handleDialogConfirm = () =>
    setActiveSpellphabet(
        spellphabets.at(
            Number(spellDisplayEl.getAttribute("data-displayed"))
        ) as SpellingAlphabet
    );

const initializeSpellphabet = (spellphabet: SpellingAlphabet) => {
    setDisplayedSpellphabet(spellphabet);
    setActiveSpellphabet(spellphabet);
};

const spellphabetOptionButtons = Array.from(
    document.querySelectorAll(`.option-wrapper`)
);
spellphabetOptionButtons.forEach((button) =>
    button.addEventListener("click", handleSpellSelectBtn)
);

spellMenuBtn.addEventListener("click", handleSpellMenuBtn);
dialogConfirmEl.addEventListener("click", handleDialogConfirm);

initializeSpellphabet(fantasySpellphabet);

// || Core functionality

// Generate password function
const generatePassword = (settings: Settings): string | void => {
    const availableCharacters = [
        // If settings.lower is true, include lowerLetters in availableCharacters.
        // This uses spread syntax (e.g., ...) to add the individual characters within lowerLetters instead of the lowerLetters Array as a single entry.
        ...(settings.lower ? lowerLetters : []),

        // Rinse and repeat.
        ...(settings.upper ? upperLetters : []),
        ...(settings.num ? numbers : []),
        ...(settings.sym ? symbols : []),
    ];
    // console.log("availableCharacters:", availableCharacters);

    let password = "";

    if (availableCharacters.length === 0) {
        alert(
            "Please select at least one type of character to include in the password."
        );
        return;
    }

    for (let i = 0; i < settings.length; i++) {
        const randomIndex = Math.floor(
            Math.random() * availableCharacters.length
        );
        password += availableCharacters[randomIndex];
    }

    // Add <span> elements to password to help with coloring.
    // 1. Define regex filters:
    const numbersRegex = /(\d+)/g;
    const symbolsRegex = /(\W+)/g;

    // 2. Replace the password characters with appropriate spans:
    let finalPassword = password
        .replace(symbolsRegex, "<span class='output-symbol'>$1</span>")
        .replace(numbersRegex, "<span class='output-number'>$1</span>");

    return finalPassword;
};

// || Generate password button

const handleGenerate = function (settings: Settings) {
    const newPW = generatePassword(settings);

    // Call generate password function, pass result to resultEl
    if (newPW) resultEl.innerHTML = newPW;
    const pword = resultEl.innerText;

    // Generate a spelling alphabet version of PW, pass result to spellphabetEl
    spellphabetEl.innerHTML = generateSpellphabet(
        pword,
        settings.spellphabet.wordList
    );
};

// Pass GUI variables to the Generate button on click
generateBtn.addEventListener("click", () => {
    handleGenerate(settings);
});

// || Copy button

// navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
//     if (result.state === "granted" || result.state === "prompt") {
//         /* write to the clipboard now */
//         console.log(result.state, "permission granted");
//     }
// });

const copyPassword = function () {
    const password = resultEl.innerText;

    if (!password) {
        alert("Nothing to copy. Generate a password first.");
        return;
    }

    const textarea = document.createElement("textarea");

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    alert("Password copied to clipboard.");
};

const handleCopy = () => copyPassword();

// Copy result on click clipboard button
clipboardBtn.addEventListener("click", handleCopy);

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

//
//
//

// confirmDialogBtn.addEventListener("click", dialog.hide());

//

// const modal = document.querySelector(".modal"),
//     overlay = document.querySelector(".overlay"),
//     openModalBtn = document.querySelector(".spellphabet-btn"),
//     closeModalBtn = document.querySelector(".modal-btn-close");

// const toggleModal = function () {
//     modal.classList.toggle("hidden");
//     overlay.classList.toggle("hidden");
// };

// openModalBtn.addEventListener("click", toggleModal);
// closeModalBtn.addEventListener("click", toggleModal);

// overlay.addEventListener("click", toggleModal);

//
//
//

// add ability to provide CSV list for custom phonetic alphabet

// style length [number] input to have separate + - buttons

// add alternate provided spellphabets that users can select from a dropdown menu ----- then display the custom spellphabets in that dropdown menu (add name field to custom input to label list in the menu--provide a default incrementing name if none is selected)
// add ability to delete custom word lists
// add ability to export custom word lists ----- could just have a popover dialogue that gives a text field populated with the "csv" text

// at narrowness breakpoint, switch settings list from row display to column

// remove alert if no boxes checked. instead implement model like dashlane where you can't uncheck minimum # of boxes. but maybe throw a little error message so it's less confusing.

//
// || Done:
//

// figure out how to exclude commonly confused characters
// color numbers and symbols differently from letters

// a b c d e f g h i j k l m n o p q r s t u v w x y z
// add phonetic alphabet field

// set it all up so that the chosen basic settings can be shared
// either using URL modifiers like the old one or with a settings export/import tool. latter is worse for single-action sharing of the tool.
// either way requires figuring out how to make the settings reference a text area or something...
