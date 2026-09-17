const form = document.getElementById("gradeForm");
const button = document.getElementById("calculateBtn");

form.addEventListener("submit", function (event) {

    const gradeInputs = [
        document.getElementById("grade1"),
        document.getElementById("grade2"),
        document.getElementById("grade3")
    ];

    const grades = gradeInputs.map(input =>
        Number(input.value)
    );

    // Check if grades are valid
    const invalidGrade = grades.some(
        grade =>
            Number.isNaN(grade) ||
            grade < 0 ||
            grade > 100
    );

    if (invalidGrade) {

        event.preventDefault();

        alert(
            "Please enter valid grades between 0 and 100."
        );

        return;
    }

    // Change button while submitting
    button.textContent = "Calculating...";
    button.disabled = true;
});