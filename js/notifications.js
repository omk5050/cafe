/**
 * Shows a professional toast notification
 * @param {string} title - The title of the toast
 * @param {string} message - The message body
 * @param {string} type - 'success', 'info', 'error'
 */
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Fallback if container is missing: create it
        const newContainer = document.createElement('div');
        newContainer.id = 'toast-container';
        newContainer.className = 'toast-container';
        document.body.appendChild(newContainer);
        return showToast(title, message, type);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'mdi-information';
    if (type === 'success') icon = 'mdi-check-circle';
    if (type === 'error') icon = 'mdi-alert-circle';
    
    toast.innerHTML = `
        <span class="toast-icon mdi ${icon}"></span>
        <div class="toast-content">
            <h6 class="toast-title">${title}</h6>
            <p class="toast-msg">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('active'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Export to window for global access
window.showToast = showToast;
