// Debug script for signup issues
console.log('=== SIGNUP DEBUG SCRIPT ===');

// Check if all required elements exist
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Find the signup form
    const form = document.querySelector('form');
    console.log('Form found:', !!form);
    
    // Find the submit button
    const submitBtn = document.querySelector('button[type="submit"]');
    console.log('Submit button found:', !!submitBtn);
    
    if (submitBtn) {
        console.log('Button disabled:', submitBtn.disabled);
        console.log('Button text:', submitBtn.textContent);
        
        // Add click listener
        submitBtn.addEventListener('click', function(e) {
            console.log('BUTTON CLICKED!');
            console.log('Event:', e);
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            console.log('FORM SUBMITTED!');
            console.log('Event:', e);
        });
    }
});

// Check for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});