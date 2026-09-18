const form = document.getElementById("gradeForm");
const button = document.getElementById("calculateBtn");

form.addEventListener("submit", (event) => {
    const grades = [
        Number(document.getElementById("grade1").value),
        Number(document.getElementById("grade2").value),
        Number(document.getElementById("grade3").value)
    ];

    const invalidGrade = grades.some(
        grade => Number.isNaN(grade) || grade < 0 || grade > 100
    );

    if (invalidGrade) {
        event.preventDefault();

        alert("Please enter valid grades between 0 and 100.");

        return;
    }

    button.textContent = "Calculating...";
    button.disabled = true;
});