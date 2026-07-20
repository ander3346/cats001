// Game Variables
let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let gameActive = true;

// Game Symbols
const symbols = ['🌟', '🎯', '🚀', '🎪', '🎨', '🎭', '🎬', '🎸'];

// Initialize Game
function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    gameActive = true;

    // Create pairs of cards
    let cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    cardPairs = shuffleArray(cardPairs);

    // Create card elements
    cardPairs.forEach((symbol, index) => {
        const cardElement = document.createElement('button');
        cardElement.className = 'card';
        cardElement.textContent = '?';
        cardElement.dataset.index = index;
        cardElement.dataset.symbol = symbol;
        cardElement.onclick = () => flipCard(cardElement);
        gameBoard.appendChild(cardElement);
        cards.push({ element: cardElement, symbol: symbol, matched: false });
    });

    updateStats();
}

// Shuffle Array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Flip Card
function flipCard(cardElement) {
    if (!gameActive) return;
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    const index = cardElement.dataset.index;
    const card = cards[index];

    // Flip the card
    cardElement.classList.add('flipped');
    cardElement.textContent = card.symbol;
    flippedCards.push({ index, card: cardElement, symbol: card.symbol });

    // Check for match
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check Match
function checkMatch() {
    gameActive = false;
    moves++;

    const [first, second] = flippedCards;

    if (first.symbol === second.symbol) {
        // Match found
        setTimeout(() => {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            matchedCards.push(first.index, second.index);

            flippedCards = [];
            gameActive = true;
            updateStats();

            // Check if game is won
            if (matchedCards.length === cards.length) {
                endGame();
            }
        }, 600);

        document.getElementById('message').textContent = '✨ Great match! ✨';
        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 2000);
    } else {
        // No match
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            first.card.textContent = '?';
            second.card.textContent = '?';

            flippedCards = [];
            gameActive = true;
        }, 1000);

        document.getElementById('message').textContent = '❌ Not a match!';
        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 1500);
    }

    updateStats();
}

// Calculate Stars Based on Moves
function calculateStars() {
    if (moves <= 10) return 3;
    if (moves <= 16) return 2;
    return 1;
}

// Update Game Stats
function updateStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matched').textContent = `${matchedCards.length / 2}/${cards.length / 2}`;
    const stars = calculateStars();
    document.getElementById('stars').textContent = '⭐' + stars;
}

// End Game
function endGame() {
    gameActive = false;
    const stars = calculateStars();
    const starDisplay = '⭐'.repeat(stars);

    document.getElementById('finalStars').textContent = starDisplay;
    document.getElementById('gameOverTitle').textContent = '🎉 You Won! 🎉';
    document.getElementById('gameOverStats').textContent = `Completed in ${moves} moves!\nYou earned ${stars} star${stars !== 1 ? 's' : ''}!`;

    document.getElementById('gameOverModal').classList.add('show');
}

// Reset Game
function resetGame() {
    document.getElementById('gameOverModal').classList.remove('show');
    initGame();
}

// Show Instructions
function showInstructions() {
    alert(`
🎮 MATCHMAN STAR GAME Instructions 🎮

HOW TO PLAY:
1. Click on cards to flip them and reveal the symbols
2. Try to match pairs of identical symbols
3. Keep track of where each symbol is located
4. Match all pairs in the fewest moves possible

STAR RATING:
⭐⭐⭐ = 10 or fewer moves (Excellent!)
⭐⭐ = 11-16 moves (Good!)
⭐ = 17+ moves (Keep practicing!)

TIPS:
• Concentrate and remember the positions
• Take your time to observe the symbols
• Have fun and enjoy the game!

Good luck! 🍀
    `);
}

// Start Game on Load
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});
