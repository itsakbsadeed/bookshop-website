// Function to validate the card number
const validate_card_number = (cardNumber) => {
    let isValid = true;
    let errorMessage = "";

    if (!cardNumber || typeof cardNumber !== "string") {
        return {isValid: false, errorMessage: "Card number is required" };
    }
    
    // Defining the regex patterns
    const masterCardRegex = /^5[1-5][0-9]{14}$/;

    
    // Checking if the card number is a valid MasterCard
    if (isValid) {
        if (!masterCardRegex.test(cardNumber)) {
            isValid = false;
            errorMessage = "Card must be a valid MasterCard";
        }
    }
    
    return { isValid, errorMessage};
};


// Function to validate if the card has not expired
const validate_expiration_date = (month, year) => {
    let isValid = true;
    let errorMessage = "";
    
    // Checking if month and year are selected
    if (!month || !year) {
        return { isValid: false, errorMessage: "Expiration date is required" };
    }
    
    // Converting the month and year to numbers
    const selectedMonth = parseInt(month);
    const selectedYear = parseInt(year);
    
    // Getting the current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
    
    // Checking if the card is expired
    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
        isValid = false;
        errorMessage = "Card has expired";
    }
    
    return { isValid, errorMessage };
};

// Function to validate the security code 
const validate_security_code = (securityCode) => {
    let isValid = true;
    let errorMessage = "";
    
    // Checking if security code is provided
    if (!securityCode || typeof securityCode !== "string") {
        return { isValid: false, errorMessage: "Security code is required" };
    }
    
    // Checking if security code is valid (3 or 4 digits) using regex
    const securityCodeRegex = /^\d{3,4}$/;
    if (!securityCodeRegex.test(securityCode)) {
        isValid = false;
        errorMessage = "Security code must be 3 or 4 digits";
    }
    
    return { isValid, errorMessage };
};

// user input validation 
window.onload = function() {
    // Geting the payment form and continue button
    const paymentForm = document.querySelector(".payment-form form");
    const continueButton = document.querySelector(".continue-btn");
    
    // Checking if the form exists
    if (paymentForm && continueButton) {
        // Adding a click event listener to the continue button
        continueButton.addEventListener("click", function(e) {
            e.preventDefault(); 
            
            // Getting the forn values
            const cardNumber = document.getElementById("cardNumber").value;
            const expirationMonth = document.getElementById("expirationMonth").value;
            const expirationYear = document.getElementById("expirationYear").value;
            const securityCode = document.getElementById("securityCode").value;
            
            // Validating each input
            const cardResult = validate_card_number(cardNumber);
            const expirationResult = validate_expiration_date(expirationMonth, expirationYear);
            const securityResult = validate_security_code(securityCode);
            
            // Collecting error messages
            let errorMessages = [];
            
            if (!cardResult.isValid) {
                errorMessages.push(cardResult.errorMessage);
            }
            
            if (!expirationResult.isValid) {
                errorMessages.push(expirationResult.errorMessage);
            }
            
            if (!securityResult.isValid) {
                errorMessages.push(securityResult.errorMessage);
            }
            
            // Checking if the form is valid
            if (errorMessages.length === 0) {
               
                const data = {
                    "master_card": parseInt(cardNumber),
                    "exp_year": parseInt(expirationYear),
                    "exp_month": parseInt(expirationMonth),
                    "cvv_code": securityCode
                };
                
                // Making  API call
                fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then((response) => {
                    if(response.status === 200){
                        return response.json();
                    }else if(response.status === 400){
                        throw "Bad data was sent to the server";
                    }else{
                        throw "Something went wrong";
                    }
                })
                .then((resJson) => {
                    // Storing the last 4 digits of  card number in localStorage
                    const lastFourDigits = cardNumber.slice(-4);
                    localStorage.setItem("lastFourDigits", lastFourDigits);
                    
                    // Showing the success message
                    alert(resJson.message);
                    
                    // Redirecting to the success page
                    window.location.href = "success.html";
                })
                .catch((error) => {
                    alert(error);
                });
            } else {
                // Showing all errors in one alert
                alert("Please fix the following errors:\n\n" + errorMessages.join("\n"));
            }
        });
    } 
};
