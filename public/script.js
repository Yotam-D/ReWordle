let currWord = [];
let gssWord = [];
let rowInd = 1;
let colInd = 0;
let matchCount = 0;
let keyBtns = document.querySelectorAll('button')
keyBtns.forEach(button=>button.addEventListener('click', pressButton));
getWord();


async function getWord() {   
    // let getWord = await fetch('http://localhost:5000/getWord')
    let getWord = await fetch('/getWord')
    .then(response => response.json())
    .then(data => {
        // getting from the server the word and the wordID 
        setCurrWord(data.userWord, data.wordId)
        // saving data in case of refresh page
        sessionStorage.setItem('Userdata', JSON.stringify(data));
        })
    .catch(err => {
        console.error('couldnt get word from server:'+err)
        let savedData = JSON.parse(sessionStorage.getItem('Userdata'));
        console.log(savedData)
        // setCurrWord(savedData.userWord, savedData.wordId)       //default word in case couldnt get from server
        setCurrWord('BIRDS', 1)       //default word 'BIRDS'
    })
};

function setCurrWord(word, wordID='Disconnected') {
    currWord = word.split('')
    document.getElementById('wordnum').innerHTML = `#${wordID}`
    console.log('Set Current Word to:',currWord);
    console.log('Set Current WordNum to:',wordID);
}

//manage actions according to the key pressed on the app keyboard
function pressButton(event) {
    let key = event.target.dataset.key
    switch (key) {
        case '←':
            deleteLetter();
            break;
        case '↵':
            if (gssWord.length % 5 ==0 && gssWord.length > 0) 
                testWord();
            break;
        case 'restart':
            resetBoard();
            break;
        default:
            if (rowInd <= 5)
                    putLetter(key.toUpperCase());
            break;
    }
}

//insert the letter in the current index and increment
function putLetter(letter){
    gssWord.push(letter);
    let butEl = document.getElementById(`${colInd*5+rowInd}`)
    butEl.innerHTML = letter
    rowInd++;
}

function deleteLetter() {
    if (gssWord.length>0) {
        gssWord.splice(-1)
        let butEl = document.getElementById(`${colInd*5+rowInd-1}`)
        butEl.innerHTML = ' '
        rowInd--; 
    }
}

function testWord() {
    // Change Buttons Color
    for (let index = 1; index <= 5; index++) {
        let butEl = document.getElementById(`${colInd*5+index}`)
        if (butEl.innerHTML == currWord[index-1]) {
            butEl.style.backgroundColor = 'rgb(106,170,100)'
            
            matchCount++;
        } else if(currWord.some(item => item == butEl.innerHTML)){
            butEl.style.backgroundColor = 'orange'
        } else {
            butEl.style.backgroundColor = 'red'
        }
    }
    //Check if the word is the winning word
    if(matchCount == 5){
        if(confirm("you won!, Do you want to play again?")){
            updateGame()
        };
        return
    } else if ( colInd == 5){
        if(confirm("you lost, Do you want to play again?")){
            resetBoard();
        };
    }
    matchCount = 0;
    colInd++;
    rowInd = 1;
    gssWord =[];
}

async function updateGame() {
    await progessUser()
    .then(setTimeout(() => {
        getWord()
        .then(resetBoard())
        .catch(err=>console.log(err))
    }, 3000))
    
    
}

function resetBoard() {
    // reset color and innerHTML
    for (let index = 1; index <= 25; index++){
        let butEl = document.getElementById(`${index}`)
        butEl.style.backgroundColor = 'rgb(172, 169, 169)';
        butEl.innerHTML = ' ';
    }
    matchCount = 0;
    colInd = 0;
    rowInd = 1;
    gssWord =[]; 
}

//fetching the server to update the user progress status in the DB
async function progessUser() {
    // let updateWord = await fetch('http://localhost:5000/updateuser')
    let updateWord = await fetch('/updateuser')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error('couldnt update the server:'+err))
}