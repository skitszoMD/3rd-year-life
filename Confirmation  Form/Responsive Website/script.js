// MOBILE NAVIGATION

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("is-open");

    navToggle.setAttribute(
        "aria-expanded",
        isOpen
    );
});


// Close menu after clicking a navigation link

document.querySelectorAll(".nav a").forEach((link) => {

    link.addEventListener("click", () => {

        nav.classList.remove("is-open");

        navToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    });

});

// PET CARE TIP BUTTON

const careBtn =
    document.getElementById("careBtn");

const actionMessage =
    document.getElementById("actionMessage");


const careTips = [

    "Fresh water should always be available, especially on warm days.",

    "A consistent feeding routine can make mealtimes easier for pets.",

    "Regular grooming is a simple way to check your pet's skin and coat.",

    "If you notice sudden changes in appetite or behavior, consider contacting a veterinarian."

];


let tipIndex = 0;


careBtn.addEventListener("click", () => {

    actionMessage.textContent =
        careTips[tipIndex];

    tipIndex =
        (tipIndex + 1) %
        careTips.length;

    careBtn.textContent =
        "Another Tip";
});

// SERVICE CARD INFORMATION

const serviceInfo = {

    Nutrition:
        "Ask our team about suitable food and nutrition options for your pet's everyday needs.",

    Wellness:
        "We can help with everyday wellness and care essentials. For illness or medication questions, consult a licensed veterinarian.",

    Supplies:
        "Find practical supplies for feeding, grooming, cleaning, playtime, and comfortable everyday pet care."

};


const serviceDetails =
    document.getElementById(
        "serviceDetails"
    );

const detailsTitle =
    document.getElementById(
        "detailsTitle"
    );

const detailsText =
    document.getElementById(
        "detailsText"
    );


document
    .querySelectorAll(".learn-btn")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const service =
                    button.dataset.service;

                serviceDetails.hidden =
                    false;

                detailsTitle.textContent =
                    service;

                detailsText.textContent =
                    serviceInfo[service];

            }
        );

    });

// SECOND INTERACTIVE CARE BUTTON

const tipButton =
    document.getElementById("tipBtn");

const tipResult =
    document.getElementById("tipResult");


tipButton.addEventListener(
    "click",
    () => {

        tipResult.textContent =
            "Tip: Keep your pet's routine consistent and make fresh water easy to access.";

        tipButton.textContent =
            "Tip Shown ✓";
    }
);

// DYNAMIC FOOTER YEAR

const year =
    document.getElementById("year");

year.textContent =
    new Date().getFullYear();