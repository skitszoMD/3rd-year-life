console.log("JavaScript is connected!");

const form = document.getElementById("contactForm");
const confirmation = document.getElementById("confirmation");
const pageHeading = document.getElementById("pageHeading");

form.addEventListener("submit", function (event) {


// STOP the normal form submission
event.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const message = document.getElementById("message").value.trim();

// VALIDATION
if (name === "" || email === "" || message === "") {
    confirmation.textContent = "Please complete all fields.";
    confirmation.style.color = "red";

    return;
}

// SUCCESS
confirmation.textContent =
    "Thank you! Your message has been submitted.";

confirmation.style.color = "green";

// DOM manipulation
pageHeading.style.color = "green";

// Clear the form
form.reset();


});
