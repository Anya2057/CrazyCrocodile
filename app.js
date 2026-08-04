// Centers measured directly on assets/crocodile-open.png (1536 × 1024).
// Coordinates are normalized percentages in the same canonical image space.
const positions = [
  [30.55, 60.76], [28.60, 65.61], [28.27, 70.64], [31.59, 75.60],
  [37.73, 79.33], [45.10, 81.08], [53.47, 81.04], [61.09, 79.34],
  [67.14, 75.63], [70.77, 70.53], [70.74, 65.48], [69.58, 60.77]
];

const questions = [
  'Назови три вещи, которые ты обычно делаешь утром.',
  'Какое животное тебе нравится и почему?',
  'Назови три предмета зелёного цвета.',
  'Что ты любишь делать после школы?',
  'Опиши идеальный выходной тремя словами.',
  'Какой суперсилой ты хотел бы обладать?',
  'Назови три вещи, которые можно найти на кухне.',
  'Куда ты хотел бы отправиться в путешествие?',
  'Что помогает тебе поднять настроение?',
  'Назови три звука, которые слышишь каждый день.',
  'Какой подарок ты бы сделал другу?',
  'Чему новому ты хотел бы научиться?'
];

const teethRoot = document.querySelector('#teeth');
const wrap = document.querySelector('#crocWrap');
const questionButton = document.querySelector('#questionButton');
const continueButton = document.querySelector('#continueButton');
const playAgainButton = document.querySelector('#playAgainButton');
const questionModal = document.querySelector('#questionModal');
const gameOverModal = document.querySelector('#gameOverModal');
const instruction = document.querySelector('#instruction');
const questionText = document.querySelector('#questionText');
const roundNumber = document.querySelector('#roundNumber');
const modalRound = document.querySelector('#modalRound');

let dangerous = 0;
let round = 0;
let canChoose = false;
let ended = false;
let audioOn = true;

function buildTeeth() {
  teethRoot.replaceChildren();
  positions.forEach(([x, y], index) => {
    const tooth = document.createElement('button');
    tooth.className = 'tooth-sprite';
    tooth.style.left = `${x}%`;
    tooth.style.top = `${y}%`;
    tooth.style.zIndex = String(Math.round(y * 100));
    tooth.dataset.index = index;
    tooth.setAttribute('aria-label', `Зуб ${index + 1}`);
    const idleImage = document.createElement('img');
    idleImage.className = 'tooth-idle';
    idleImage.src = 'assets/tooth-buttons/tooth-idle.png';
    idleImage.alt = '';
    idleImage.draggable = false;
    const pressedImage = document.createElement('img');
    pressedImage.className = 'tooth-pressed';
    pressedImage.src = 'assets/tooth-buttons/tooth-pressed.png';
    pressedImage.alt = '';
    pressedImage.draggable = false;
    tooth.append(idleImage, pressedImage);
    tooth.addEventListener('click', () => pressTooth(index, tooth));
    teethRoot.append(tooth);

    const marker = document.createElement('span');
    marker.className = 'socket-debug';
    marker.dataset.label = index + 1;
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    teethRoot.append(marker);
  });
}

function modal(element, on) {
  element.classList.toggle('show', on);
  element.setAttribute('aria-hidden', String(!on));
}

function sync() {
  roundNumber.textContent = round + 1;
  modalRound.textContent = round + 1;
  questionText.textContent = questions[round % questions.length];
}

function newRound() {
  dangerous = Math.floor(Math.random() * 12);
  round = 0;
  ended = false;
  canChoose = false;
  wrap.classList.remove('snap', 'shake');
  teethRoot.classList.add('teeth-disabled');
  buildTeeth();
  sync();
  instruction.textContent = 'Нажми «ВОПРОС», чтобы начать';
  questionButton.hidden = false;
}

function openQuestion() {
  if (ended) return;
  canChoose = false;
  teethRoot.classList.add('teeth-disabled');
  sync();
  modal(questionModal, true);
}

function allowChoice() {
  modal(questionModal, false);
  canChoose = true;
  teethRoot.classList.remove('teeth-disabled');
  instruction.textContent = 'Выбери любой нижний зуб';
  questionButton.hidden = true;
}

function pressTooth(index, tooth) {
  if (!canChoose || ended || tooth.classList.contains('pressed')) return;
  canChoose = false;
  tooth.classList.add('pressed');
  teethRoot.classList.add('teeth-disabled');
  tone(230, 0.07, 'sine');

  if (index === dangerous) {
    ended = true;
    instruction.textContent = 'Ой… опасный зуб!';
    setTimeout(snap, 100);
    return;
  }

  setTimeout(() => {
    round += 1;
    instruction.textContent = 'Безопасно! Следующий вопрос';
    questionButton.hidden = false;
    teethRoot.classList.remove('teeth-disabled');
  }, 230);
}

function snap() {
  wrap.classList.add('snap');
  tone(72, 0.14, 'sawtooth');
  setTimeout(() => {
    wrap.classList.add('shake');
    tone(48, 0.22, 'square');
  }, 80);
  setTimeout(() => modal(gameOverModal, true), 650);
}

function tone(freq, duration, type) {
  if (!audioOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = tone.context || (tone.context = new AudioContext());
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

questionButton.addEventListener('click', openQuestion);
continueButton.addEventListener('click', allowChoice);
playAgainButton.addEventListener('click', () => {
  modal(gameOverModal, false);
  newRound();
});
document.querySelector('#soundButton').addEventListener('click', event => {
  audioOn = !audioOn;
  event.currentTarget.textContent = audioOn ? '♪' : '×';
});

newRound();
