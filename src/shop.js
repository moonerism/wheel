export function createShopWindow() {
    const shopButton = document.getElementById('btnShop');
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = 'Магазин'; 
    
    const closeButtonShop = document.createElement('buttonDeleteShop');
    closeButtonShop.textContent = 'X';

    shopButton.addEventListener('click', function() {
      document.body.appendChild(popup);
      setTimeout(() => {
        popup.classList.add('fade-in'); 
      }, 10); 
    });
    
    closeButtonShop.addEventListener('click', function() {
      popup.classList.remove('fade-in'); 
      setTimeout(() => {
        document.body.removeChild(popup); 
      }, 500); 
    });
    
    popup.appendChild(closeButtonShop); 
    
    const shopContainer = document.createElement('div');
    shopContainer.className = 'shop-container';
    const artifactsGrid = document.createElement('div');
    artifactsGrid.className = 'artifacts-grid';
  
    artifacts.forEach(artifact => {
      const artifactCard = document.createElement('div');
      artifactCard.className = 'artifact-card';
  
      const artifactIcon = document.createElement('span');
      artifactIcon.textContent = '🏆'; 
      artifactIcon.className = 'artifact-icon';
      artifactCard.appendChild(artifactIcon);
  
      const artifactDetails = document.createElement('div');
      artifactDetails.className = 'artifact-details';
  
      const artifactName = document.createElement('h3');
      artifactName.textContent = artifact.name;
      artifactDetails.appendChild(artifactName);
  
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = generateHighlightedDescription(artifact.description, artifact.highlightedWord);
      artifactDetails.appendChild(tooltip);
  
      const artifactCost = document.createElement('p');
      artifactCost.textContent = `${artifact.cost} 💰`; 
      artifactDetails.appendChild(artifactCost);
  
      artifactCard.appendChild(artifactDetails);
      artifactsGrid.appendChild(artifactCard);
    
    });
    shopContainer.appendChild(artifactsGrid);
    function generateHighlightedDescription(description, highlightedWord) {
      const highlightedDescription = description.replace('{highlighted-word}', `<span class="highlighted-word">${highlightedWord}</span>`);
      return highlightedDescription;
    }

    popup.appendChild(shopContainer); 

  }
  
 const artifacts = [
    { name: 'Сейф', cost: 100, description: 'Каждое {highlighted-word} добавляет 1💰',  highlightedWord: 'воскресенье' },
    { name: 'Иконка', cost: 150, description: 'Добавляет иконку к нику' },
    { name: 'Аура', cost: 180, description: 'Описание' },
    { name: 'Трофей', cost: 220, description: 'Описание' },
    { name: 'Эмблема', cost: 160, description: 'Описание' },
    { name: 'Фанфар', cost: 120, description: 'Описание' },
    { name: 'Тест1', cost: 100, description: 'Описание' },
    { name: 'Тест2', cost: 150, description: 'Описание' },
    { name: 'Тест3', cost: 180, description: 'Описание' }
];
  