// Function to calculate the average
function calculateAverage(score1, score2, score3) {
    return (score1 + score2 + score3) / 3;
}

// Ask the user for the student's name
let studentName = prompt("Enter the student's name:");

// Ask the user for the three quiz scores
let quiz1 = parseFloat(prompt("Enter Quiz 1 score:"));
let quiz2 = parseFloat(prompt("Enter Quiz 2 score:"));
let quiz3 = parseFloat(prompt("Enter Quiz 3 score:"));

// Calculate the average
let average = calculateAverage(quiz1, quiz2, quiz3);

// Determine if the student passed or failed
let status;

if (average >= 75) {
    status = "Passed";
} else {
    status = "Failed";
}

// Display the student information on the webpage
document.getElementById("result").innerHTML =
    "<h2>Student Information</h2>" +
    "<p>Name: " + studentName + "</p>" +
    "<p>Quiz 1: " + quiz1 + "</p>" +
    "<p>Quiz 2: " + quiz2 + "</p>" +
    "<p>Quiz 3: " + quiz3 + "</p>" +
    "<p>Average: " + average.toFixed(2) + "</p>" +
    "<p>Status: " + status + "</p>";

// Ask the user for a number
let number = parseInt(prompt("Enter a number for the multiplication table:"));

// Display the multiplication table in the browser console
console.log("Multiplication Table for " + number);

for (let i = 1; i <= 10; i++) {
    console.log(number + " x " + i + " = " + (number * i));
}