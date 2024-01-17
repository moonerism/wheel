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
  canvasContext.fillStyle = '#fff';
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
  rotateWheel(); // Initial rotation
  startAnimation(); // Start engine
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
    console.log(movieData)
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
  });
}


function updatePlayerNames() {
  const player1Name = document.querySelector('.player-1').textContent.trim();
  const player2Name = document.querySelector('.player-2').textContent.trim();

  document.querySelector('option[value="player-1"]').textContent = player1Name.charAt(0);
  document.querySelector('option[value="player-2"]').textContent = player2Name.charAt(0);
}

updatePlayerNames();

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

const player1Item = document.querySelector('.leaderboard-item .player-1');
const player2Item = document.querySelector('.leaderboard-item .player-2');
const playerInfo = document.querySelector('.player-info');
const closeButton = document.createElement('buttonDelete'); 
closeButton.textContent = 'X'; 
closeButton.addEventListener('click', function() {
  playerInfo.style.display = 'none'; 
});

player1Item.addEventListener('click', function() {
  playerInfo.textContent = 'Player 1: Артемий';
  playerInfo.style.display = 'block'; 
  playerInfo.appendChild(closeButton); 
});

player2Item.addEventListener('click', function() {
  playerInfo.textContent = 'Player 2: Слава';
  playerInfo.style.display = 'block'; 
  playerInfo.appendChild(closeButton); 
});

fetch('assets/players.json')
.then(response => response.json())
.then(data => {
  // Use the fetched JSON data in your code
  console.log(data); // Output: Array of player objects
})
.catch(error => {
  console.error('Error fetching player data:', error);
});





initialize();
