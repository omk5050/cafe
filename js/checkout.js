/**
 * checkout.js
 * Handles checkout page logic, rendering cart items from localStorage,
 * and processing the demo checkout submission.
 */

document.addEventListener('DOMContentLoaded', () => {
    const checkoutCartContainer = document.getElementById('checkout-items-container');
    const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
    const checkoutTaxEl = document.getElementById('checkout-tax');
    const checkoutTotalEl = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutContent = document.getElementById('checkout-content');
    const checkoutEmpty = document.getElementById('checkout-empty');

    // Retrieve cart from localStorage
    let checkoutCart = JSON.parse(localStorage.getItem('cafe_cart')) || [];

    function renderCheckoutCart() {
        if (checkoutCart.length === 0) {
            if (checkoutContent) checkoutContent.style.display = 'none';
            if (checkoutEmpty) checkoutEmpty.style.display = 'block';
            return;
        }

        if (checkoutContent) checkoutContent.style.display = 'block';
        if (checkoutEmpty) checkoutEmpty.style.display = 'none';

        if (!checkoutCartContainer) return;

        let subtotal = 0;
        checkoutCartContainer.innerHTML = checkoutCart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div class="order-summary-item">
                    <div class="order-item-info">
                        <img src="${item.imageUrl}" alt="${item.name}" class="order-item-img">
                        <div class="order-item-details">
                            <h6>${item.name}</h6>
                            <div class="order-item-qty">Qty: ${item.quantity}</div>
                        </div>
                    </div>
                    <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');

        // Calculate tax (e.g., 8%) and total
        const taxRate = 0.08;
        const taxAmount = subtotal * taxRate;
        const grandTotal = subtotal + taxAmount;

        if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (checkoutTaxEl) checkoutTaxEl.textContent = `$${taxAmount.toFixed(2)}`;
        if (checkoutTotalEl) checkoutTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    }

    renderCheckoutCart();

    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (checkoutCart.length === 0) return;

            // Simulate API call and success
            showToast('Order Placed!', 'Your order has been successfully placed.', 'success');
            
            // Clear cart
            localStorage.removeItem('cafe_cart');
            checkoutCart = [];
            
            // Re-render UI
            renderCheckoutCart();
            
            // Update global cart UI if cart.js is present
            if (typeof updateCartUI === 'function') {
                window.cart = [];
                updateCartUI();
            }

            // Redirect to home after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});
