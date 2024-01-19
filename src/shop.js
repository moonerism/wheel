export function createShopWindow() {
    const shopButton = document.getElementById('btnShop');
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = 'Здесь будет магазин.'; 
    
    const closeButtonShop = document.createElement('buttonDeleteShop');
    closeButtonShop.textContent = 'X';
    
    closeButtonShop.addEventListener('click', function() {
      popup.classList.remove('fade-in'); 
      setTimeout(() => {
        document.body.removeChild(popup); 
      }, 500); 
    });
    
    popup.appendChild(closeButtonShop); 
    
    shopButton.addEventListener('click', function() {
      document.body.appendChild(popup);
      setTimeout(() => {
        popup.classList.add('fade-in'); 
      }, 10); 
    });
  }
  