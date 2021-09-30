let blackjackGame = {
    'your' : {'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer' : {'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score':0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap' : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnOver' : false,
}
let YOU = blackjackGame['your'];
let DEALER = blackjackGame['dealer'];

const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lossSound = new Audio('./sounds/aww.mp3');
const drewSound = new Audio('./sounds/drew.wav')

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click',blackjackStand);

function blackjackHit(){
    if (blackjackGame['isStand'] === false){
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card,YOU);
    console.log(YOU['score']);
    showScore(YOU);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand(){
    blackjackGame['isStand'] = true;

    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
    let card = randomCard();
    showCard(card,DEALER);
    updateScore(card,DEALER);
    showScore(DEALER);
    await sleep(1000);
    }

    
      blackjackGame['turnOver'] = true;
      showResult(computeWinner());
    
}

function blackjackDeal(){

    if(blackjackGame['turnOver'] === true){
        blackjackGame['isStand'] = false;
    
let yourImages = document.querySelector('#your-box').querySelectorAll('img');
let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

for( let i= 0; i< yourImages.length; i++){
    yourImages[i].remove();
}

for( let i= 0; i< dealerImages.length; i++){
    dealerImages[i].remove();
}

YOU['score'] = 0;
DEALER['score'] =0;

document.querySelector('#your-blackjack-result').textContent = 0;
document.querySelector('#dealer-blackjack-result').textContent = 0;

document.querySelector('#your-blackjack-result').style.color = '#ffffff';
document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

document.querySelector('#blackjack-result').textContent = "let's play";
document.querySelector('#blackjack-result').style.color = 'black'
 
blackjackGame['turnOver'] = false;
    }
}

function showCard(card, activePlayer){
    if(activePlayer['score'] <= 21){
    cardImage = document.createElement('img')
    cardImage.src =`images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play()
}
}


function randomCard(){
    cardIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][cardIndex];
}

function updateScore(card, activePlayer){
    if(card === 'A'){
        if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1]
        }else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }else
activePlayer['score'] += blackjackGame['cardsMap'][card];
}

function showScore(activePlayer){
    

    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    }else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
         }
}


function computeWinner(){
    let winner;

    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            winner = YOU;
            blackjackGame['wins']++;
            console.log('you win');
        } else if (YOU['score'] < DEALER['score']){
            winner = DEALER;
            blackjackGame['losses']++;
            console.log('you lose');
        } else if (YOU['score'] === DEALER['score']){
            console.log('you drew');
            blackjackGame['draws']++
        }
    }else if (YOU['score'] >21 && DEALER['score'] <= 21){
        console.log('you lose');
        blackjackGame['losses']++;
        winner = DEALER;
    }else if (YOU['score'] > 21 && DEALER['score'] > 21){
        console.log('you drew');
        blackjackGame['draws']++;
    }
    console.log('winner is',winner);
    return winner;
}

function showResult(winner){
    if(blackjackGame['turnOver'] === true){

    let message, messageColor;


    if (winner === YOU){
        message = 'you won !';
        messageColor = 'green';
        winSound.play();
        document.querySelector('#wins').textContent = blackjackGame['wins'];

    }else if (winner === DEALER){
        message = 'you lose !';
        messageColor = 'red' ;
        lossSound.play();
        document.querySelector('#losses').textContent = blackjackGame['losses'];
    }else {
        message = 'you drew !' ;
        messageColor = 'black';
        drewSound.play();
        document.querySelector('#draws').textContent = blackjackGame['draws'];
    }
     
    
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;

    }
}