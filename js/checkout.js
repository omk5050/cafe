/**
 * checkout.js
 * Handles checkout page logic, rendering cart items from localStorage,
 * and processing the checkout submission to MongoDB.
 */

document.addEventListener('DOMContentLoaded', () => {
    const checkoutCartContainer = document.getElementById('checkout-items-container');
    const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
    const checkoutTaxEl = document.getElementById('checkout-tax');
    const checkoutTotalEl = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutContent = document.getElementById('checkout-content');
    const checkoutEmpty = document.getElementById('checkout-empty');
    const btnPlaceOrder = document.querySelector('.btn-place-order');

    // Retrieve cart from localStorage
    let checkoutCart = JSON.parse(localStorage.getItem('cafe_cart')) || [];
    let subtotal = 0;
    let taxAmount = 0;
    let grandTotal = 0;

    function renderCheckoutCart() {
        if (checkoutCart.length === 0) {
            if (checkoutContent) checkoutContent.style.display = 'none';
            if (checkoutEmpty) checkoutEmpty.style.display = 'block';
            return;
        }

        if (checkoutContent) checkoutContent.style.display = 'flex';
        if (checkoutEmpty) checkoutEmpty.style.display = 'none';

        if (!checkoutCartContainer) return;

        subtotal = 0;
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
        taxAmount = subtotal * taxRate;
        grandTotal = subtotal + taxAmount;

        if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (checkoutTaxEl) checkoutTaxEl.textContent = `$${taxAmount.toFixed(2)}`;
        if (checkoutTotalEl) checkoutTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    }

    renderCheckoutCart();

    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (checkoutCart.length === 0) return;

            // Gather form data
            const formData = new FormData(checkoutForm);
            
            // Construct payload
            const payload = {
                customer: {
                    firstName: formData.get('first-name'),
                    lastName: formData.get('last-name'),
                    company: formData.get('company'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                shippingAddress: {
                    street: formData.get('address'),
                    address2: formData.get('address-2'),
                    city: formData.get('city'),
                    postcode: formData.get('postcode')
                },
                notes: formData.get('notes'),
                items: checkoutCart,
                totals: {
                    subtotal: Number(subtotal.toFixed(2)),
                    tax: Number(taxAmount.toFixed(2)),
                    total: Number(grandTotal.toFixed(2))
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'credit'
            };

            try {
                if (btnPlaceOrder) {
                    btnPlaceOrder.disabled = true;
                    btnPlaceOrder.textContent = 'Processing...';
                }

                const response = await fetch('/api/public/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Checkout failed');

                showToast('Order Placed!', 'Your order has been successfully placed.', 'success');
                
                // Clear cart
                localStorage.removeItem('cafe_cart');
                checkoutCart = [];
                
                // Update global cart UI if cart.js is present
                if (typeof updateCartUI === 'function') {
                    window.cart = [];
                    updateCartUI();
                }

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } catch (error) {
                console.error('Checkout error:', error);
                showToast('Error', error.message, 'error');
                
                if (btnPlaceOrder) {
                    btnPlaceOrder.disabled = false;
                    btnPlaceOrder.textContent = 'Place Order';
                }
            }
        });
    }
});
