document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.id;
  
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
          });
  
          if (!response.ok) throw new Error('Failed to add to cart');
  
          const result = await response.json();
          alert('Product added to cart');
        } catch (error) {
          console.error(error.message);
          alert('Error adding to cart');
        }
      });
    });
  });
  