const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const pairsEl = document.getElementById('pairs');
const totalPairsEl = document.getElementById('totalPairs');
const restartBtn = document.getElementById('restart');
const overlay = document.getElementById('overlay');
const winText = document.getElementById('winText');
const playAgain = document.getElementById('playAgain');
const closeOverlay = document.getElementById('closeOverlay');
const sizeBtn = document.getElementById('sizeBtn');

let size = 4;
let icons = [
    "🍎","🍌","🍇","🍓","🍒","🍊","🥝","🍍",
    "🥑","🍋","🍑","🍐","🍉","🥥","🍅","🍆",
    "🌟","🔥","⚡","💎","🍀","🌈","🎵","🎯"
];
let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let pairsFound = 0;
let totalPairs = 8;
let timerInterval = null;
let seconds = 0;

function formatTime(s){
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${mm}:${ss}`;
}

function startTimer(){
    clearInterval(timerInterval);
    seconds = 0;
    timeEl.textContent = formatTime(0);
    timerInterval = setInterval(()=>{
        seconds++;
        timeEl.textContent = formatTime(seconds);
    },1000);
}

function stopTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
}

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildDeck(){
    totalPairs = (size*size)/2;
    totalPairsEl.textContent = totalPairs;
    const chosen = icons.slice(0); // copy
    shuffle(chosen);
    const selected = chosen.slice(0, totalPairs);
    deck = shuffle([...selected, ...selected]); // duplicate and shuffle
}

function renderBoard(){
    boardEl.innerHTML = '';
    boardEl.dataset.size = size;
    deck.forEach((val, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = val;
        card.dataset.index = idx;
        card.setAttribute('role','button');
        card.setAttribute('aria-pressed','false');
        card.tabIndex = 0;

        const inner = document.createElement('div');
        inner.className = 'inner';

        const back = document.createElement('div');
        back.className = 'face back';
        back.textContent = '❓';

        const front = document.createElement('div');
        front.className = 'face front';
        front.textContent = val;

        inner.appendChild(back);
        inner.appendChild(front);
        card.appendChild(inner);
        boardEl.appendChild(card);

        card.addEventListener('click', ()=> onCardClick(card));
        card.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                onCardClick(card);
            }
        });
    });
}

function resetState(){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function onCardClick(card){
    if(lockBoard) return;
    if(card.classList.contains('flipped')) return;

    if(moves === 0 && pairsFound === 0 && !timerInterval) startTimer();

    card.classList.add('flipped');
    card.setAttribute('aria-pressed','true');

    if(!firstCard){
        firstCard = card;
        return;
    }
    secondCard = card;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch(){
    const a = firstCard.dataset.value;
    const b = secondCard.dataset.value;
    moves++;
    movesEl.textContent = moves;

    if(a === b){
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        pairsFound++;
        pairsEl.textContent = pairsFound;
        firstCard.querySelector('.inner').classList.add('pulse');
        secondCard.querySelector('.inner').classList.add('pulse');
        setTimeout(()=>{
            firstCard.querySelector('.inner').classList.remove('pulse');
            secondCard.querySelector('.inner').classList.remove('pulse');
            resetState();
        },300);
        lockBoard = false;
        checkWin();
    } else {
        setTimeout(()=>{
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.setAttribute('aria-pressed','false');
            secondCard.setAttribute('aria-pressed','false');
            resetState();
        },700);
    }
}

function checkWin(){
    if(pairsFound === totalPairs){
        stopTimer();
        winText.innerHTML = `Znalazłeś wszystkie <strong>${totalPairs}</strong> par w ${moves} ruchach i czasie ${formatTime(seconds)}.`;
        overlay.classList.add('show');
    }
}

function initGame(){
    moves = 0;
    pairsFound = 0;
    movesEl.textContent = moves;
    pairsEl.textContent = pairsFound;
    timeEl.textContent = formatTime(0);
    buildDeck();
    renderBoard();
    resetState();
    stopTimer();
}

restartBtn.addEventListener('click', ()=>{
    initGame();
});

playAgain.addEventListener('click', ()=>{
    overlay.classList.remove('show');
    initGame();
});

closeOverlay.addEventListener('click', ()=>{
    overlay.classList.remove('show');
});

sizeBtn.addEventListener('click', ()=>{
    if(size === 4){
        size = 6;
        sizeBtn.textContent = '6×6';
    } else {
        size = 4;
        sizeBtn.textContent = '4×4';
    }
    initGame();
});

document.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase() === 'r') initGame();
});

initGame();