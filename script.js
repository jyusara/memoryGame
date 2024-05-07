const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    resetButton: document.querySelector('.reset-button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    console.log("Generating new game...");
    const dimensions = selectors.board.getAttribute('data-dimension')  

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const emojis = ['images/yoda.jpg', 'images/ahsoka.jpg', 'images/anakinSkywalker.jpg', 'images/bobaFett.jpg', 'images/C3PO.jpg', 'images/darthMaul.jpg', 'images/darthVader.jpg', 'images/obiWanKenobi.jpg', 'images/princesaLeia.jpg', 'images/R2D2.jpg', 'images/shewbacca.jpg','images/wicket.jpg']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="Card" style="max-width: 100%; max-height: 100%;"></div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    console.log('Board before replacement:', selectors.board);
    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    resetButton.style.display = 'inline-block'; 

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} movimientos`
        selectors.timer.innerText = `Tiempo: ${state.totalTime} seg`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        const image1 = flippedCards[0].querySelector('.card-back img').src
        const image2 = flippedCards[1].querySelector('.card-back img').src

        if (image1 === image2) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    Tu ganaste!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

const resetButton = document.querySelector('.reset-button');

resetButton.addEventListener('click', () => {
   
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;

    
    clearInterval(state.loop);

    console.log('Temporizador detenido');

    generateGame();
    selectors.moves.innerText = `0 movimientos`;
    selectors.timer.innerText = `Tiempo: 0 seg`;
    
    
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });

    
    selectors.start.classList.remove('disabled');


    
    selectors.boardContainer.classList.remove('flipped');

    
    selectors.win.innerHTML = '';

   
    resetButton.style.display = 'none';

    
});




generateGame()
attachEventListeners()