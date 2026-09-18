<?php
$name = "";
$student_id = "";
$subject = "";

$grade1 = "";
$grade2 = "";
$grade3 = "";

$average = null;
$status = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = htmlspecialchars(trim($_POST["name"] ?? ""));
    $student_id = htmlspecialchars(trim($_POST["student_id"] ?? ""));
    $subject = htmlspecialchars(trim($_POST["subject"] ?? ""));

    $grade1 = floatval($_POST["grade1"] ?? 0);
    $grade2 = floatval($_POST["grade2"] ?? 0);
    $grade3 = floatval($_POST["grade3"] ?? 0);

    $average = ($grade1 + $grade2 + $grade3) / 3;
    $status = $average >= 75 ? "Passed" : "Failed";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Grade Calculator</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body>

<main class="container">

    <section class="card">

        <header class="header">
            <h1>Student Grade Calculator</h1>
            <p>Enter the student's information and grades to calculate the final result.</p>
        </header>

        <form
            action=""
            method="POST"
            id="gradeForm"
            class="grade-form"
        >

            <div class="section-title">
                <h2>Student Information</h2>
            </div>

            <div class="student-fields">

                <div class="form-group">
                    <label for="name">Student Name</label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter student name"
                        value="<?= $name ?>"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="student_id">Student ID</label>

                    <input
                        type="text"
                        id="student_id"
                        name="student_id"
                        placeholder="Enter student ID"
                        value="<?= $student_id ?>"
                        required
                    >
                </div>

                <div class="form-group full-width">
                    <label for="subject">Subject</label>

                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="e.g. Web Development"
                        value="<?= $subject ?>"
                        required
                    >
                </div>

            </div>

            <div class="section-title grades-title">
                <h2>Grades</h2>
                <span>0 - 100</span>
            </div>

            <div class="grades">

                <div class="form-group">
                    <label for="grade1">Grade 1</label>

                    <input
                        type="number"
                        id="grade1"
                        name="grade1"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0 - 100"
                        value="<?= $grade1 ?>"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="grade2">Grade 2</label>

                    <input
                        type="number"
                        id="grade2"
                        name="grade2"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0 - 100"
                        value="<?= $grade2 ?>"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="grade3">Grade 3</label>

                    <input
                        type="number"
                        id="grade3"
                        name="grade3"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0 - 100"
                        value="<?= $grade3 ?>"
                        required
                    >
                </div>

            </div>

            <button
                type="submit"
                id="calculateBtn"
                class="calculate-btn"
            >
                Calculate Final Result
            </button>

        </form>


        <?php if ($average !== null): ?>

            <section class="result <?= strtolower($status) ?>">

                <div class="result-header">
                    <div>
                        <span class="result-label">FINAL RESULT</span>
                        <h2><?= $name ?></h2>
                    </div>

                    <span class="status-badge">
                        <?= $status ?>
                    </span>
                </div>

                <div class="student-details">

                    <div>
                        <span>Student ID</span>
                        <strong><?= $student_id ?></strong>
                    </div>

                    <div>
                        <span>Subject</span>
                        <strong><?= $subject ?></strong>
                    </div>

                </div>

                <div class="grades-display">

                    <div>
                        <span>Grade 1</span>
                        <strong><?= number_format($grade1, 2) ?></strong>
                    </div>

                    <div>
                        <span>Grade 2</span>
                        <strong><?= number_format($grade2, 2) ?></strong>
                    </div>

                    <div>
                        <span>Grade 3</span>
                        <strong><?= number_format($grade3, 2) ?></strong>
                    </div>

                </div>

                <div class="average">
                    <span>Final Average</span>
                    <strong><?= number_format($average, 2) ?></strong>
                </div>

                <p class="passing-note">
                    Passing grade: <strong>75</strong>
                </p>

            </section>

        <?php endif; ?>

    </section>

</main>

<script src="script.js"></script>

</body>
</html>