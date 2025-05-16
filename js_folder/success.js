window.onload = function() {
    // Get the span element to display the last four digits
    const lastFourDigitsElement = document.getElementById("lastFourDigits");
    
    if (lastFourDigitsElement) {
        // Retrieve the last four digits from localStorage
        const lastFourDigits = localStorage.getItem("lastFourDigits");
        
        // Display the last four digits in the span
        lastFourDigitsElement.textContent = lastFourDigits;
    }
};
