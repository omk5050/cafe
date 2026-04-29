const getApiBaseUrl = () => {
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return ''; // In production, adjust if your API is hosted on a different domain
};

const API_BASE_URL = getApiBaseUrl();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Booking Form ("Book Your Table")
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch(`${API_BASE_URL}/api/public/book`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok) {
                    showToast('Booking Success', 'Your table has been reserved!', 'success');
                    bookingForm.reset();
                } else {
                    showToast('Booking Error', result.error || 'Failed to book table', 'error');
                }
            } catch (error) {
                showToast('Network Error', 'Please check your connection.', 'error');
            }

        });
    }

    // 2. Contact Form ("Get In Touch")
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch(`${API_BASE_URL}/api/public/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok) {
                    showToast('Message Sent', 'We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showToast('Send Error', result.error || 'Failed to send message', 'error');
                }
            } catch (error) {
                showToast('Network Error', 'Please check your connection.', 'error');
            }

        });
    }

    // 3. Newsletter Forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch(`${API_BASE_URL}/api/public/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok) {
                    showToast('Subscribed!', 'Welcome to our newsletter.', 'success');
                    form.reset();
                } else {
                    showToast('Subscription Error', result.error || 'Failed to subscribe', 'error');
                }
            } catch (error) {
                showToast('Network Error', 'Please check your connection.', 'error');
            }

        });
    });

    // 4. Fetch Menu (Dynamic Menu Items)
    const dynamicMenuGrid = document.getElementById('dynamic-menu-grid');
    if (dynamicMenuGrid) {
        fetch(`${API_BASE_URL}/api/public/menu`)
            .then(res => {
                if(!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Always clear placeholder content first
                dynamicMenuGrid.innerHTML = '';
                if (Array.isArray(data) && data.length > 0) {
                    dynamicMenuGrid.innerHTML = data.map(pizza => `
                        <div class="col-sm-6 col-lg-4 col-xl-3">
                            <article class="product wow fadeInLeft" data-wow-delay=".15s">
                                <div class="product-figure">
                                    <img src="${pizza.imageUrl}" alt="${pizza.name}" width="161" height="162" style="object-fit:cover;"/>
                                </div>
                                <div class="product-rating">
                                    ${'<span class="mdi mdi-star"></span>'.repeat(pizza.rating || 5)}
                                </div>
                                <h6 class="product-title">${pizza.name}</h6>
                                <div class="product-price-wrap">
                                    <div class="product-price">$${pizza.price.toFixed(2)}</div>
                                </div>
                                <div class="product-button">
                                    <div class="button-wrap">
                                        <a class="button button-xs button-primary button-winona add-to-cart-btn" 
                                           href="#" 
                                           data-id="${pizza._id}" 
                                           data-name="${pizza.name}" 
                                           data-price="${pizza.price}" 
                                           data-image="${pizza.imageUrl}">Add to cart</a>
                                    </div>
                                </div>

                                ${pizza.tag && pizza.tag !== 'NONE' ? `<span class="product-badge product-badge-${pizza.tag.toLowerCase()}">${pizza.tag}</span>` : ''}
                            </article>
                        </div>
                    `).join('');
                }
            })
            .catch(err => console.error('Error fetching menu:', err));
    }


    // 5. Fetch Testimonials
    const testimonialsCarousel = document.getElementById('testimonials-carousel');
    if (testimonialsCarousel) {
        fetch(`${API_BASE_URL}/api/public/testimonials`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Always clear static placeholder content first
                testimonialsCarousel.innerHTML = '';
                if (Array.isArray(data) && data.length > 0) {
                    testimonialsCarousel.innerHTML = data.map(t => `
                        <article class="quote-tara">
                            <div class="quote-tara-caption">
                                <div class="quote-tara-text">
                                    <p class="q">${t.quote}</p>
                                </div>
                                <div class="quote-tara-figure">
                                    <img src="${t.imageUrl}" alt="${t.clientName}" width="115" height="115" style="object-fit:cover; border-radius:50%;"/>
                                </div>
                            </div>
                            <h6 class="quote-tara-author">${t.clientName}</h6>
                            <div class="quote-tara-status">${t.clientRole}</div>
                        </article>
                    `).join('');
                }
            })
            .catch(err => console.error('Error fetching testimonials:', err));
    }

    // 6. Fetch Team
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        fetch(`${API_BASE_URL}/api/public/team`)
            .then(res => {
                if(!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Always clear static placeholder content first
                teamGrid.innerHTML = '';
                if (Array.isArray(data) && data.length > 0) {
                    teamGrid.innerHTML = data.map(member => `
                        <div class="col-sm-6 col-lg-3 wow fadeInLeft" data-wow-delay=".2s" data-wow-duration="1s">
                            <article class="team-modern">
                                <a class="team-modern-figure" href="#"><img src="${member.imageUrl}" alt="${member.name}" width="270" height="236" style="object-fit:cover;"/></a>
                                <div class="team-modern-caption">
                                    <h6 class="team-modern-name"><a href="#">${member.name}</a></h6>
                                    <div class="team-modern-status">${member.role}</div>
                                    <ul class="list-inline team-modern-social-list">
                                        <li><a class="icon mdi mdi-facebook" href="#"></a></li>
                                        <li><a class="icon mdi mdi-twitter" href="#"></a></li>
                                        <li><a class="icon mdi mdi-instagram" href="#"></a></li>
                                        <li><a class="icon mdi mdi-google-plus" href="#"></a></li>
                                    </ul>
                                </div>
                            </article>
                        </div>
                    `).join('');
                }
            })
            .catch(err => console.error('Error fetching team:', err));
    }
});
