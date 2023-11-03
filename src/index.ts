// import A11yDialog from "https://cdn.jsdelivr.net/npm/a11y-dialog@8/dist/a11y-dialog.esm.min.js" /* "a11y-dialog" */;

import A11yDialog from "a11y-dialog";
import "./style.css";

// Identify HTML elements
const resultEl = document.getElementById("result") as HTMLElement;
const spellphabetEl = document.getElementById("spellphabet") as HTMLElement;

const generateBtn = document.getElementById("generate") as HTMLElement;
const clipboardBtn = document.getElementById("clipboard") as HTMLElement;

const lengthEl = document.getElementById("lengthNumber") as HTMLInputElement;

const uppercaseEl = document.getElementById("uppercase") as HTMLInputElement;
const lowercaseEl = document.getElementById("lowercase") as HTMLInputElement;
const numbersEl = document.getElementById("numbers") as HTMLInputElement;
const symbolsEl = document.getElementById("symbols") as HTMLInputElement;

// Initialize custom menu button
// ref: https://github.com/Heydon/inclusive-menu-button/tree/master

// Define allowed characters
// Character codes for lowercase and uppercase letters pulled from Unicode characters (lowercase a is #97)
const charCodes = Array.from(Array(26)).map((_, i) => i + 97);
const lowerLetters = charCodes.map((code) => String.fromCharCode(code));
const upperLetters = lowerLetters.map((letter) => letter.toUpperCase());
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "="];

// Default letters word list if user doesn't set another
const animalSpellphabet = [
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
];

const settings = {
    // Specify default values.
    length: 15,
    lower: true,
    upper: true,
    num: true,
    sym: false,
    spellphabet: animalSpellphabet,
};

function updateSettings() {
    settings.length = +lengthEl.value;
    settings.lower = lowercaseEl.checked;
    settings.upper = uppercaseEl.checked;
    settings.num = numbersEl.checked;
    settings.sym = symbolsEl.checked;
    settings.spellphabet = animalSpellphabet;
}

// Listen for changes to variables and update local storage
lengthEl.onchange = updateSettings;
uppercaseEl.onchange = updateSettings;
lowercaseEl.onchange = updateSettings;
numbersEl.onchange = updateSettings;
symbolsEl.onchange = updateSettings;
// spellselect trigger.....

// || Core functionality

// Generate password function
const generatePassword = (settings: {
    length: number;
    lower: boolean;
    upper: boolean;
    num: boolean;
    sym: boolean;
}): string | void => {
    const availableCharacters = [
        // If settings.lower is true, include lowerLetters in availableCharacters.
        // Using spread syntax (...) to add the individual characters instead of the array as a single object.
        ...(settings.lower ? lowerLetters : []),
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

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
            Math.random() * availableCharacters.length
        );
        password += availableCharacters[randomIndex];
    }

    // Add <span> elements to password to help with coloring
    const numbersRegex = /(\d+)/g;
    const symbolsRegex = /(\W+)/g;

    // Replace
    let finalPassword = password
        .replace(symbolsRegex, "<span class='output-symbol'>$1</span>")
        .replace(numbersRegex, "<span class='output-number'>$1</span>");

    return finalPassword;
};

// Alternative word lists for user selection
const placeSpellphabet = [
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
    easySpellphabet = [
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
        "opera",
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
    ],
    natureSpellphabet = [
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
    fantasySpellphabet = [
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
    ],
    fruitAndVegSpellphabet = [
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
    ];

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
    // Provide animalSpellphabet as a default argument.
    currentSpellphabet: string[] = animalSpellphabet
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
    // toDo: modify currentSpellphabet - define with ternary statement that checks if a custom wordlist was input?

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

// || Generate password button

const handleGenerate = function () {
    const newPW = generatePassword(settings);

    // Call generate password function, pass result to resultEl
    if (newPW) resultEl.innerHTML = newPW;
    const pword = resultEl.innerText;

    // Generate a spelling alphabet version of PW, pass result to spellphabetEl
    spellphabetEl.innerHTML = generateSpellphabet(pword, settings.spellphabet);
};

// Pass GUI variables to the Generate button on click
generateBtn.addEventListener("click", handleGenerate);

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

// Copy result on click clipboard button
clipboardBtn.addEventListener("click", copyPassword);

// || Modal for spellphabet selection:

const confirmDialogBtn = document.querySelector(".dialog-confirm-btn");

const container = document.querySelector(".dialog-container") as HTMLElement;

// Initialize dialog
const dialog = new A11yDialog(container);

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

// document.addEventListener("keydown", function (event) {
//     if (event.key === "Escape" && !modal.classList.contains("hidden")) {
//         toggleModal();
//     }
// });

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
