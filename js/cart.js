// In-memory cart state (initialized from localStorage)
let cart = JSON.parse(localStorage.getItem('cafe_cart')) || [];

function saveCart() {
    localStorage.setItem('cafe_cart', JSON.stringify(cart));
}

/**
 * Syncs the UI with the current cart state
 */
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTotalElement = document.getElementById('cart-total-amount');

    if (!cartContainer) return;

    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);

    // Update cart items list
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
    } else {
        let total = 0;
        cartContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
                        <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h6 class="cart-item-name">${item.name}</h6>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn minus" onclick="updateItemQuantity('${item.id}', -1)">-</button>
                            <span class="cart-qty-val">${item.quantity}</span>
                            <button class="cart-qty-btn plus" onclick="updateItemQuantity('${item.id}', 1)">+</button>
                            <button class="cart-remove-btn mdi mdi-delete" onclick="removeFromCart('${item.id}')"></button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        if (cartTotalElement) cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

/**
 * Adds an item to the cart
 */
window.addToCart = function(id, name, price, imageUrl) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), imageUrl, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    
    // Show success toast
    showToast('Item Added', `${name} has been added to your cart.`, 'success');
    
    // Optional: Open sidebar automatically when adding item
    // document.querySelector('.rd-navbar-cart-sidebar').classList.add('active');
};

/**
 * Removes an item from the cart
 */
window.removeFromCart = function(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    if (item) {
        showToast('Item Removed', `${item.name} removed from cart.`, 'info');
    }
};

/**
 * Updates item quantity
 */
window.updateItemQuantity = function(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

/**
 * Handles Checkout
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI update from localStorage
    updateCartUI();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Empty Cart', 'Please add items before checking out.', 'info');
                return;
            }
            
            // Navigate to checkout page
            window.location.href = 'checkout.html';
        });
    }

    // Handle existing "Add to cart" buttons in static HTML
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.add-to-cart-btn');
        if (target) {
            e.preventDefault();
            const id = target.getAttribute('data-id');
            const name = target.getAttribute('data-name');
            const price = target.getAttribute('data-price');
            const image = target.getAttribute('data-image');
            window.addToCart(id, name, price, image);
        }
    });
});
