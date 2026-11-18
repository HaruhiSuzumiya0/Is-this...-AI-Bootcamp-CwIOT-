// tout le fonctionnement du quiz : les écrans, l'ordre de passage,
// les réponses et les statistiques à la fin.

let stage = document.querySelector("#stage");
let screens = document.querySelectorAll(".screen");
let screenHome = document.querySelector("#screen-home");
let screenQuiz = document.querySelector("#screen-quiz");
let screenQ1 = document.querySelector("#screen-q1");
let screenReveal1 = document.querySelector("#screen-reveal1");
let screenQ2 = document.querySelector("#screen-q2");
let screenReveal2 = document.querySelector("#screen-reveal2");
let screenStats = document.querySelector("#screen-stats");

let datasetButtons = document.querySelector("#dataset-buttons");
let quizWho = document.querySelector("#quiz-who");
let quizMedia = document.querySelector("#quiz-media");
let quizPrevious = document.querySelector("#quiz-previous");
let quizNoPrevious = document.querySelector("#quiz-no-previous");
let buttonAi = document.querySelector("#button-ai");
let buttonHuman = document.querySelector("#button-human");

let q1Picker = document.querySelector("#q1-picker");
let q1Next = document.querySelector("#q1-next");
let reveal1Line = document.querySelector("#reveal1-line");
let reveal1Next = document.querySelector("#reveal1-next");
let q2Picker = document.querySelector("#q2-picker");
let q2Next = document.querySelector("#q2-next");
let reveal2Line = document.querySelector("#reveal2-line");
let reveal2Next = document.querySelector("#reveal2-next");

let pieCircle = document.querySelector("#pie-circle");
let pieSlice = document.querySelector("#pie-slice");
let statsCorrect = document.querySelector("#stats-correct");
let statsWrong = document.querySelector("#stats-wrong");
let statsPercent = document.querySelector("#stats-percent");
let statsPersons = document.querySelector("#stats-persons");
let statsMedia = document.querySelector("#stats-media");
let newGroup = document.querySelector("#new-group");


// Scène de 1080x1920, mise à l'échelle
let stageWidth = 1080;
let stageHeight = 1920;
stage.style.width = stageWidth + "px";
stage.style.height = stageHeight + "px";

function fitStage() {
    // On garde le plus petit des deux pour que tout rentre
    let scale = Math.min(window.innerWidth / stageWidth, window.innerHeight / stageHeight);
    stage.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
}
fitStage();
window.addEventListener("resize", fitStage);


// État
let state = {
    dataset: null, // le dataset choisi sur le premier écran
    steps: [],     // tous les passages dans l'ordre : { turn, person, media }
    step: 0,       // index du passage en cours dans steps
    answers: [],   // toutes les réponses données : { person, media, answer }
    q1: null,      // réponse du groupe à la question 1 (de 0 à 6)
    q2: null,      // réponse du groupe à la question 2 (en %)
};

// Après chaque changement d'écran, on bloque les clics une demi-seconde.
// un double appui pourrait répondre pour la personne d'après
let clickAllowedAt = 0;

function showScreen(screen) {
    for (let i = 0; i < screens.length; i = i + 1) {
        screens[i].hidden = true;
    }
    screen.hidden = false;
    clickAllowedAt = performance.now() + 500;
}

function canClick() {
    return performance.now() >= clickAllowedAt;
}

// Pour les boutons qui passent juste à l'écran d'après ("Next", "New group")
function onNext(button, showNext) {
    button.addEventListener("click", function () {
        if (canClick()) {
            showNext();
        }
    });
}


// Petits outils

// Calculation de pourcentage
function percent(a, b) {
    return Math.round(a / b * 100) + "%";
}

// Le HTML d'une pastille AI ou Human
function chip(answer) {
    let label = "Human";
    if (answer == "ai") {
        label = "AI";
    }
    return '<span class="chip ' + answer + '">' + label + '</span>';
}

// La bonne réponse d'un media.
function truthOf(mediaNumber) {
    return state.dataset.items[mediaNumber - 1].answer;
}

function isCorrect(a) {
    return a.answer == truthOf(a.media);
}

// Compte les réponses qui passent le test
function countAnswers(test) {
    let count = 0;
    for (let i = 0; i < state.answers.length; i = i + 1) {
        if (test(state.answers[i])) {
            count = count + 1;
        }
    }
    return count;
}

// Les extensions affichées en vidéo. Tout le reste est affiché en image
let videoExtensions = ["mp4", "webm", "mov", "m4v"];

// Crée l'image ou la vidéo d'un media
function createMedia(item) {
    let extension = item.src.split(".").pop().toLowerCase(); // "media/clip.MP4" -> "mp4"
    let media;
    if (videoExtensions.includes(extension)) {
        media = document.createElement("video");
        media.muted = true; // le navigateur interdit l'autoplay avec le son
        media.autoplay = true;
        media.loop = true;
    } else {
        media = document.createElement("img");
    }
    media.src = item.src;
    // Si le fichier existe pas, le media s'enlève et on voit le placeholder en fond
    media.onerror = function () {
        media.remove();
    };
    return media;
}


// Écran 1 : choix du dataset

for (let i = 0; i < config.datasets.length; i = i + 1) {
    let button = document.createElement("button");
    button.textContent = config.datasets[i].label;
    button.addEventListener("click", function () {
        startQuiz(config.datasets[i]);
    });
    datasetButtons.appendChild(button);
}

// Écran 2 : le quiz

function startQuiz(dataset) {
    state.dataset = dataset;
    state.step = 0;
    state.answers = [];

    // La liste de tous les passages : tour 1 (personne 1 à 6), puis tour 2, etc.
    // config.order[personne][tour] = le media que cette personne voit à ce tour
    state.steps = [];
    for (let turn = 0; turn < config.order[0].length; turn = turn + 1) {
        for (let person = 0; person < config.order.length; person = person + 1) {
            // +1 pour afficher "Turn 1" et pas "Turn 0"
            state.steps.push({ turn: turn + 1, person: person + 1, media: config.order[person][turn] });
        }
    }
    showQuiz();
}

function showQuiz() {
    let step = state.steps[state.step];
    quizWho.textContent = "Turn " + step.turn + " | Participant " + step.person;
    quizMedia.replaceChildren(createMedia(state.dataset.items[step.media - 1], false));

    // Les réponses précédentes, mais seulement pour CE media
    let html = "";
    for (let i = 0; i < state.answers.length; i = i + 1) {
        if (state.answers[i].media == step.media) {
            html = html + chip(state.answers[i].answer);
        }
    }
    quizPrevious.innerHTML = html;
    quizNoPrevious.hidden = html != ""; // "No previous answers" seulement s'il y en a aucune

    showScreen(screenQuiz);
}

// Quand quelqu'un appuie sur AI ou Human
function answer(value) {
    if (!canClick()) {
        return;
    }
    let step = state.steps[state.step];
    state.answers.push({ person: step.person, media: step.media, answer: value });
    state.step = state.step + 1;

    if (state.step < state.steps.length) {
        showQuiz(); // la personne suivante
    } else {
        showPicker(screenQ1, q1Picker, q1Next); // tout le monde a fini
    }
}

buttonAi.addEventListener("click", function () {
    answer("ai");
});
buttonHuman.addEventListener("click", function () {
    answer("human");
});


// Écrans 3 et 5 : les questions de groupe

// Fait marcher les boutons d'une question (0 / 6, 1 / 6... ou 0%, 10%...)
// onPick = ce qu'il faut faire avec le chiffre choisi
function setupPicker(picker, nextButton, onPick) {
    let buttons = picker.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i = i + 1) {
        buttons[i].addEventListener("click", function () {
            for (let j = 0; j < buttons.length; j = j + 1) {
                buttons[j].classList.toggle("selected", j == i); // sélectionné seulement si c'est lui
            }
            nextButton.disabled = false;
            onPick(Number(buttons[i].dataset.value)); // data-value dans index.html
        });
    }
}

// Affiche une question remise à zéro (rien de sélectionné, "Next" grisé)
function showPicker(screen, picker, nextButton) {
    let buttons = picker.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i = i + 1) {
        buttons[i].classList.remove("selected");
    }
    nextButton.disabled = true;
    showScreen(screen);
}

setupPicker(q1Picker, q1Next, function (value) {
    state.q1 = value;
});
setupPicker(q2Picker, q2Next, function (value) {
    state.q2 = value;
});


// Écran 4 : réponse à la question 1
function showReveal1() {
    let items = state.dataset.items;
    let ai = 0;
    for (let i = 0; i < items.length; i = i + 1) {
        if (items[i].answer == "ai") {
            ai = ai + 1;
        }
    }
    reveal1Line.innerHTML = "You said <b>" + state.q1 + " / " + items.length + "</b>. "
        + "In reality, <b>" + ai + " / " + items.length + " (" + percent(ai, items.length) + ")</b> "
        + "of the content was AI-generated.";
    showScreen(screenReveal1);
}


// Écran 6 : réponse à la question 2

function showReveal2() {
    let correct = countAnswers(isCorrect);
    let total = state.answers.length;
    reveal2Line.innerHTML = "You said <b>" + state.q2 + "%</b>. "
        + "In reality, you got <b>" + percent(correct, total) + "</b> right "
        + "(" + correct + " / " + total + " answers).";
    showScreen(screenReveal2);
}


// Écran 7 : statistiques du groupe

// le cercle = la couleur "faux", et la part par-dessus = la couleur "juste"
function drawPie(correct, total) {
    // Tout juste : on colore juste le cercle
    if (correct == total) {
        pieCircle.setAttribute("class", "correct");
    } else {
        pieCircle.setAttribute("class", "wrong");
    }
    if (correct == 0 || correct == total) {
        pieSlice.setAttribute("d", "");
        return;
    }
    // Le point où la part s'arrête sur le bord du cercle
    let angle = correct / total * 2 * Math.PI;
    let x = 210 + 200 * Math.sin(angle);
    let y = 210 - 200 * Math.cos(angle);
    let bigArc = 0; // 1 si la part fait plus de la moitié du cercle
    if (angle > Math.PI) {
        bigArc = 1;
    }
    // M = départ au centre, L = ligne jusqu'en haut, A = arc jusqu'à (x, y), Z = retour au centre
    pieSlice.setAttribute("d", "M 210 210 L 210 10 A 200 200 0 " + bigArc + " 1 " + x + " " + y + " Z");
}

function showStats() {
    let correct = countAnswers(isCorrect);
    let total = state.answers.length;
    drawPie(correct, total);
    statsCorrect.textContent = correct;
    statsWrong.textContent = total - correct;
    statsPercent.textContent = percent(correct, total);

    // Le score de chaque personne
    let html = "";
    for (let person = 1; person <= config.order.length; person = person + 1) {
        let personCorrect = countAnswers(function (a) {
            return a.person == person && isCorrect(a);
        });
        let personTotal = countAnswers(function (a) {
            return a.person == person;
        });
        html = html + "<div><b>" + personCorrect + "/" + personTotal + "</b>Person " + person + "</div>";
    }
    statsPersons.innerHTML = html;

    // Pour chaque media, sa vraie réponse, et combien ont dit AI ou Human
    html = "";
    for (let m = 1; m <= state.dataset.items.length; m = m + 1) {
        let saidAi = countAnswers(function (a) {
            return a.media == m && a.answer == "ai";
        });
        let saidHuman = countAnswers(function (a) {
            return a.media == m && a.answer == "human";
        });
        html = html + "<tr><td>Media " + m + "</td><td>" + state.dataset.items[m - 1].type + "</td>"
            + "<td>" + chip(truthOf(m)) + "</td>"
            + '<td class="center">' + saidAi + '</td><td class="center">' + saidHuman + "</td></tr>";
    }
    statsMedia.innerHTML = html;

    showScreen(screenStats);
}


// Les boutons qui passent à l'écran d'après

onNext(q1Next, showReveal1);
onNext(reveal1Next, function () {
    showPicker(screenQ2, q2Picker, q2Next);
});
onNext(q2Next, showReveal2);
onNext(reveal2Next, showStats);
onNext(newGroup, function () {
    showScreen(screenHome);
});
