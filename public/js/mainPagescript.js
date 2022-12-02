

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('');
let masterPlay = document.getElementById('masterPlay');
let shuffle = document.getElementById('shuffle');
let repeat = document.getElementById('repeat');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
// Variables for state of shuffle and repeat, playing state
let isplaying = false;
let shuffle_state = false;
let repeat_state = false;
let repeat_one = false;

// variable to keep track if song is playing
let isPlaying = false;


// creating a songs obj array 
let songs = [
    {songName: "Daku - Chani Nattan ", filePath: "/songs/1.mp3", coverPath: "/covers/1.jpg"},
    {songName: "Keshariya - Bhramasatra", filePath: "/songs/2.mp3", coverPath: "/covers/2.jpg"},
    {songName: "Srivali - Pushpa ", filePath: "/songs/3.mp3", coverPath: "/covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart ", filePath: "/songs/4.mp3", coverPath: "/covers/4.jpg"},
    {songName: "Janji-Heroes-Tonight", filePath: "/songs/5.mp3", coverPath: "/covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "/songs/2.mp3", coverPath: "/covers/6.jpg"},
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "/songs/2.mp3", coverPath: "/covers/7.jpg"},
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "/songs/2.mp3", coverPath: "/covers/8.jpg"},
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "/songs/2.mp3", coverPath: "/covers/9.jpg"},
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "/songs/4.mp3", coverPath: "/covers/10.jpg"},
]

// variable for songs Queue
let songQueueIndex = 0;
let songsQueue = [];
let shuffleQueue = [];
let shuffleQueueIndex = 0;



// initialize all songs object in html page with there values from song array
songItems.forEach((element, i)=>{ 
    element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName; 
})
 
//Add event listners
// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    //play if paused
    if(audioElement.paused || audioElement.currentTime<=0){
        //For resuming song
        if( audioElement.currentTime > 0 ){
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            gif.style.opacity = 1;
        }else{// if no song present then start a new song
            playSong(songQueueIndex);
        }
    }//pause if song already played
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})
// Listen to Events
//time update and seeker
audioElement.addEventListener('timeupdate', ()=>{ 
    // Update Seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    myProgressBar.value = progress;
    changeCurrent_totalDuraiton();
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
    changeCurrent_totalDuraiton();
})

// function for updating the current time
function changeCurrent_totalDuraiton(){
    let musicCurrentTime = document.getElementById("current");
    let musicDuration = document.getElementById("duration");
    //getting the total duration from audio element
    audioElement.addEventListener("loadeddata", ()=>{
        let audioDuration = audioElement.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // changing the current time
    let currentMin = Math.floor(audioElement.currentTime/60);
    let currentSec = Math.floor(audioElement.currentTime%60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
}

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

// handles play button on song list
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 
        makeAllPlays();

        songIndex = parseInt(e.target.id);
        //Adding function to run full playlist on click from here if queue empty
        // else only normally play/pause

        if(songsQueue.length === 0 || songQueueIndex === songsQueue.length){
            addInQueue(songIndex);
        }else{
            if(songQueueIndex === 0){
                // make this new song as the first in queue
                songsQueue.unshift(songIndex);
            }else{
                // cuurently leave the order preserving of queue
                songsQueue[songQueueIndex-1] = songIndex;
                songQueueIndex--;
            }
        }
        
        
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        //calling playSong function
        playSong(songQueueIndex);
    })
})

// Handles the adding in queue button
Array.from(document.getElementsByClassName('fa-solid fa-plus')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 

        songIndex = parseInt(e.target.id);
        // add the element in playing queue
        addInQueue(songIndex);
    })
})


//Handles next button
document.getElementById('next').addEventListener('click', nextSong)

//function handler for nextSong
function nextSong(){
    //using normal queue, when shuffle not set
    if( !shuffle_state && songsQueue.length !== 0 && songQueueIndex !== songsQueue.length ){
        // basic shuffle and repeat feature
        if(repeat_one){
            songQueueIndex = songQueueIndex;
        }else{
            songQueueIndex++;
            if(songQueueIndex>=songsQueue.length && repeat_state){
                songQueueIndex = 0;
            }
        }

        //calling playSong function
        if(repeat_state || songQueueIndex < songsQueue.length){
            playSong(songQueueIndex);
            return;
        }
    }
    // use this if shuffle set
    if( shuffle_state && shuffleQueue.length !== 0 && shuffleQueueIndex !== shuffleQueue.length ){
        if(repeat_one){
            shuffleQueueIndex = shuffleQueueIndex;
        }else{
            shuffleQueueIndex++;
            if(songQueueIndex>=shuffleQueue.length && repeat_state){
                shuffleQueueIndex = 0;
            }
        }

        //calling playSong function
        if(repeat_state || shuffleQueueIndex < shuffleQueue.length){
            playSong(shuffleQueueIndex);
            return;
        }
    }

    audioElement.pause();
    audioElement.src = ``;
    masterSongName.innerText = "Song Name";
    audioElement.currentTime = 0;
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    gif.style.opacity = 0;

};

// handele previous button
document.getElementById('previous').addEventListener('click', ()=>{
    // checking which index to choose according to repeat_state
    if(repeat_one){
        songQueueIndex = songQueueIndex;
    }else{
        songQueueIndex--;
        if(songQueueIndex < 0 && repeat_state){
            songQueueIndex = songsQueue.length + songQueueIndex;
        }
    }

    //calling playSong function
    if(repeat_state || songQueueIndex >= 0){
        playSong(songQueueIndex);
    }else{
        audioElement.pause();
        audioElement.src = ``;
        masterSongName.innerText = "Song Name";
        masterSongName.innerText = "";
        audioElement.currentTime = 0;
    }
})


//function for random no generation
function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
  


// playSong function, loads song from given index
function playSong(songQueueIndex){
    audioElement.pause();
    //audioElement.src = `/songs/${songIndex+1}.mp3`;

    let songToBePlayed = songs[songsQueue[songQueueIndex]];
    if(shuffle_state){
        songToBePlayed = songs[shuffleQueue[songQueueIndex]];
    }
    audioElement.src = songToBePlayed.filePath;
    masterSongName.innerText = songToBePlayed.songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
}

//function to add song in queue

function addInQueue(songIndex){
    if( !shuffle_state ){
        songsQueue.push(songIndex);
    }else{
        shuffleQueue.push(songIndex);
    }
}


//handles shuffle button
shuffle.addEventListener("click", ()=>{
    shuffle_state = !shuffle_state;
    //console.log("Shuffle");
    redrawShuffle();
})

function redrawShuffle(){
    // adding and removing color
    if(shuffle_state){
        shuffle.classList.add('blue');
        // copy songsQueue and shuffle it  completely
        shuffleQueue = [];
        for (let i = 0; i < songsQueue.length; i++) {
            shuffleQueue.push(songsQueue[i]);
        }
        shuffleArray(shuffleQueue, songsQueue[songQueueIndex]);
    } else {
        // start using the normal shuffle after removeing shuffle
        shuffle.classList.remove('blue');
    }
}

//handles repeat button
repeat.addEventListener("click", ()=>{
    //console.log("Repeat");
    if(!repeat_state){
        repeat_state = true;
    }else if(!repeat_one){
        repeat_one = true;
    }else{
        repeat_state = false;
        repeat_one = false;
    }
    redrawRepeat();
})

function redrawRepeat(){
    if( !repeat_state){
        repeat.classList.remove("fa-person-walking-arrow-loop-left");
        repeat.classList.remove("blue");
        repeat.classList.add("fa-repeat");
    }else if(!repeat_one){
        repeat.classList.add("blue");
    }else{
        repeat.classList.remove("fa-repeat");
        repeat.classList.add("fa-person-walking-arrow-loop-left");
    }
}
//function to shuffle complete array
// using  - Fisher-Yates (aka Knuth) Shuffle.
function shuffleArray(array , value) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    // replace the 1st element of array with current song
    let indexOfCurrentSong = array.indexOf(value);
    let valueOfCuurentSong = array[indexOfCurrentSong];
    array[indexOfCurrentSong] = array[0];
    array[0] = valueOfCuurentSong;
    shuffleQueueIndex = 0;
    return array;
}

// Event Listener calls next method when song ended
audioElement.addEventListener("ended", nextSong)