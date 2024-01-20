import { createShopWindow } from './shop.js';
createShopWindow();

let sectors = [{ id: 'sector-1', color: '#333333', label: '' }];
let movieData = [];
const colors = ['#191528', '#3C162F', '#5C162E', '#7C162E', '#110E1B'];
const diameter = wheel.width;
const radius = diameter / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const spinEl = document.querySelector('#spin');
const addMovieBtn = document.querySelector('#btnAddMovie');
const newMovieInput = document.querySelector('#newMovie');
const colorSelect = document.querySelector('#colorSelect');
const canvasContext = wheel.getContext('2d');
const slider = document.querySelector('input[type="range"]');
const sliderValue = document.querySelector('#sliderValue');
const movieList = document.querySelector('#movieList');
let totalSectors = sectors.length + 1;
let spinningTime = 10000;
slider.value = 10;
let elapsedTime = 0;
const winningPlayerNumber = 0;

slider.addEventListener('input', () => {
  sliderValue.textContent = slider.value;
  spinningTime = slider.value * 1000;
});

const friction = 0.995; // 0.995=soft, 0.99=mid, 0.98hard
let angularVelocity = 0; 
let angle = 0;
let arc = TAU / totalSectors;

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const getIndex = () => Math.floor(totalSectors - (angle / TAU) * totalSectors) % totalSectors;

function drawSector(sector, index) {
  const sectorAngle = arc * ( index );
  const { color, label } = sector;
  const movieName = label.length > 10 ? `${label.substring(0, 10)}...` : label;
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.fillStyle = color;
  canvasContext.moveTo(radius, radius);
  canvasContext.arc(radius, radius, radius, sectorAngle, sectorAngle + arc);
  canvasContext.lineTo(radius, radius);
  canvasContext.fill();
  canvasContext.translate(radius, radius);
  canvasContext.rotate(sectorAngle + arc / 2);
  canvasContext.textAlign = 'right';
  canvasContext.fillStyle = '#FFC9B5';
  canvasContext.font = 'bold 20px sans-serif';
  canvasContext.strokeStyle = 'black'; 
  canvasContext.lineWidth = 1; 
  canvasContext.stroke(); 
  canvasContext.fillText(movieName, radius - 10, 10);
  canvasContext.restore();
}

function rotateWheel() {
  const sector = sectors[getIndex()];
  canvasContext.canvas.style.transform = `rotate(${angle - PI / 2}rad)`;
  const text = !angularVelocity ? 'КРУТИТЬ' : sector.label.length > 10 ? `${sector.label.substring(0, 10)}...` : sector.label;
  spinEl.textContent = text;
  spinEl.style.background = sector.color;
}

function animate() {
  if (!angularVelocity) return;
  angularVelocity *= friction;
  if (angularVelocity < 0.001) {
    angularVelocity = 0;
    elapsedTime = 0;
    const currentSectorIndex = getIndex();
    const currentMovie = movieData[currentSectorIndex];
    movieData.splice(currentSectorIndex, 1);

    if (totalSectors === 2) {
      const eliminatedListItem = document.getElementById(currentMovie.listItem);
      eliminatedListItem.classList.add('loser');
      const winnerListItem = document.querySelector('#movieList li:not(.loser)');
      winnerListItem.classList.add('winner');
      spinEl.textContent = 'ВИН';
      spinEl.style.background = '#333333';
      const playerColor = winnerListItem.style.color;
      let winningPlayerNumber;
  
      if (playerColor === 'cornflowerblue') {
        winningPlayerNumber = 1;
      } else if (playerColor === 'teal') {
        winningPlayerNumber = 2;
      }
  
      if (winningPlayerNumber) {
        winnerPoints(winningPlayerNumber); // Call the function to update points and coins for the winning player
      }
    } else {
      const eliminatedListItem = document.getElementById(currentMovie.listItem);
      eliminatedListItem.classList.add('loser');
    }
    totalSectors--;
    arc = TAU / totalSectors;
    sectors.splice(currentSectorIndex, 1);
    canvasContext.clearRect(0, 0, diameter, diameter);
    sectors.forEach(drawSector);
    slider.disabled = false;
  } else {
    if (elapsedTime <= spinningTime) {
      angularVelocity = getRandomNumber(0.05, 0.15); 
    }
    angle += angularVelocity;
    angle %= TAU;
    rotateWheel();
    elapsedTime += 7; 
  }
}

function startAnimation() {
  animate();
  requestAnimationFrame(startAnimation);
}

function initialize() {
  totalSectors = sectors.length;
  arc = TAU / totalSectors;
  sectors.forEach(drawSector);
  rotateWheel(); 
  startAnimation(); 
  updateLeaderboard()
  let movieListItemId; 
  
addMovieBtn.addEventListener('click', () => {
  const movieName = newMovieInput.value.trim();
  const selectedColor = colorSelect.value;
  let playerColor = '';

  if (selectedColor === 'player-1') {
    playerColor = 'cornflowerblue';
  } else if (selectedColor === 'player-2') {
    playerColor = 'teal';
  } else {
    playerColor = 'white'; 
  }

  if (movieName && movieList.children.length < 11) {
    const emptySectorIndex = sectors.findIndex(sector => sector.label === '');
    if (emptySectorIndex !== -1) {
      sectors[emptySectorIndex].label = movieName;
      sectors[emptySectorIndex].color = colors[emptySectorIndex % colors.length];
      canvasContext.clearRect(0, 0, diameter, diameter);
      sectors.forEach(drawSector);
      arc = TAU / totalSectors;
      movieListItemId = `movie-${movieList.children.length + 1}`;
      const movieSectorWheelId = `sector-${emptySectorIndex + 1}`;
      const movie = { name: movieName, listItem: movieListItemId, sectorWheel: movieSectorWheelId, player: selectedColor };
      movieData[emptySectorIndex] = movie;
    } else {
      const newSector = { color: colors[totalSectors % colors.length], label: movieName };
      sectors.push(newSector);
      totalSectors++;
      arc = TAU / totalSectors;
      canvasContext.clearRect(0, 0, diameter, diameter);
      sectors.forEach(drawSector);
      movieListItemId = `movie-${movieList.children.length + 1}`;
      const movieSectorWheelId = `sector-${totalSectors}`;
      const movie = { name: movieName, listItem: movieListItemId, sectorWheel: movieSectorWheelId };
      movieData.push(movie);
    }
    const li = document.createElement('li');
    li.id = movieListItemId;
    li.textContent = movieName;
    li.style.color = playerColor;
    movieList.appendChild(li);
    newMovieInput.value = '';
    if (movieList.children.length === 11) {
      newMovieInput.disabled = true; 
      addMovieBtn.disabled = true; 
      colorSelect.disabled = true;
    }
  }
});

  spinEl.addEventListener('click', async () => {
    if (angularVelocity > 0 || totalSectors === 1 || movieList.children.length < 3) {
      return;
    }
    angularVelocity = 0.05;
    addMovieBtn.disabled = true;
    newMovieInput.disabled = true;
    slider.disabled = true;
    colorSelect.disabled = true;
    resetColorSelectBox();
  });
}


function updatePlayerNames() {
  const player1Name = document.querySelector('.leaderboard-item .player-1').textContent.trim();
  const player2Name = document.querySelector('.leaderboard-item .player-2').textContent.trim();

  document.querySelector('option[value="player-1"]').textContent = player1Name.charAt(0);
  document.querySelector('option[value="player-2"]').textContent = player2Name.charAt(0);
}


colorSelect.addEventListener('change', () => {
  const selectedColor = colorSelect.value;
  let playerColor = '';

  if (selectedColor === 'player-1') {
    playerColor = 'cornflowerblue';
    updateColorSelectBox(playerColor);
  } else if (selectedColor === 'player-2') {
    playerColor = 'teal';
    updateColorSelectBox(playerColor);
  } else {
    resetColorSelectBox();
  }
});


function updateColorSelectBox(color) {
  const colorSelect = document.getElementById('colorSelect');
  colorSelect.style.borderColor = color;
  colorSelect.style.boxShadow = `0 0 5px ${color}`;
}

function resetColorSelectBox() {
  const colorSelect = document.getElementById('colorSelect');
  colorSelect.style.borderColor = '';
  colorSelect.style.boxShadow = '';
}

function getEmoji(index) {
  switch (index) {
    case 0:
      return '🥇'; 
    case 1:
      return '🥈'; 
    case 2:
      return '🥉'; 
    default:
      return '🎖️'; 
  }
}

function winnerPoints(winningPlayerNumber) {
  fetch('https://kinowheel-729ea-default-rtdb.europe-west1.firebasedatabase.app/players.json')
    .then(response => response.json())
    .then(data => {
      const playersData = Object.values(data);

      const winningPlayer = playersData.find(player => player.number === winningPlayerNumber);

      if (winningPlayer) {
        winningPlayer.points += 1;
        winningPlayer.coins += 1;

        fetch('https://kinowheel-729ea-default-rtdb.europe-west1.firebasedatabase.app/players.json', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playersData),
        })
        .then(() => {
          updateLeaderboard(data);
      })
    }
  });
}


function updateLeaderboard() {
  fetch('https://kinowheel-729ea-default-rtdb.europe-west1.firebasedatabase.app/players.json')
    .then(response => response.json())
    .then(data => {
      const playersData = Object.values(data);
      playersData.sort((a, b) => b.points - a.points);

      const playerInfo = document.querySelector('.player-info');
      const closeButton = document.createElement('buttonDelete');
      const leaderboard = document.querySelector('.leaderboard');
      leaderboard.innerHTML = '';

      playersData.forEach((player, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.classList.add('leaderboard-item');
        leaderboardItem.innerHTML = `<span class="score-${index + 1}">[${player.points}] </span><span class="player-${player.number}">${player.name}</span><span class="leaderboard-emoji">${getEmoji(index)}</span>`;
        if (index === 0) {
          leaderboardItem.querySelector('.leaderboard-emoji').classList.add('first-place');
        }
        leaderboardItem.addEventListener('click', function() {
          playerInfo.innerHTML = `${player.name}<br><br>Монеты: ${player.coins} 💰 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Очки: ${player.points} 🎬`;
          playerInfo.style.display = 'block';
          closeButton.textContent = 'X';
          closeButton.addEventListener('click', function() {
            playerInfo.style.display = 'none';
          });
          if (!playerInfo.contains(closeButton)) {
            playerInfo.appendChild(closeButton);
          }
        });

        leaderboard.appendChild(leaderboardItem);
      });

      updatePlayerNames();
    })

}


initialize();
