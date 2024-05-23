/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navClose = document.getElementById('nav-close')

/*==================== MENU SHOW =======================*/
/* Toggle menu visibility on small screens when the menu icon is clicked */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*=================== MENU HIDDEN ======================*/
/* Close menu when the close icon is clicked */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
/* Close mobile menu when a link is clicked */
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*=============== ADD BLUR HEADER ===============*/
/* Add a blur effect to the header on scroll */
const blurHeader = () =>{
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('blur-header')
                       : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)

/*=============== SHOW SCROLL UP ===============*/ 
/* Show a scroll-to-top button when the user scrolls down */
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')

}
window.addEventListener('scroll', scrollUp)

/*=============== WEBSITE SHARE COPY LINK ===============*/
/* Copy website link to clipboard */
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copyLink');
    
    copyButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the default anchor action
      const linkToCopy = this.getAttribute('data-link'); // Get the link from the data-link attribute
      
      // Use the Clipboard API to copy the link
      navigator.clipboard.writeText(linkToCopy).then(() => {
        // Optional: Show some feedback to the user here
        alert('OMEGA web link copied to clipboard!');
      }).catch(err => {
        console.error('Error copying link to clipboard', err);
      });
    });
  });

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
/* Highlight navigation links as their corresponding sections come into view */
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => { // Function to highlight the active link in the navigation menu
    const scrollDown = window.scrollY; // Current scroll position
    

    sections.forEach(current => { // Loop through each section
        const sectionHeight = current.offsetHeight; // Get the height of the section
        const sectionTop = current.offsetTop - 58; // header height adjustment
        const sectionId = current.getAttribute('id'); // Get the ID of the section

        // Attempt to find the corresponding link in the navigation menu
        const sectionsClass = document.querySelector('.nav__menu a[href*="' + sectionId + '"]');

        // Only proceed if the link was found
        if (sectionsClass) { // Check if the section is in the viewport
            if (scrollY > sectionTop && scrollDown <= sectionTop + sectionHeight) { // Highlight the active link
                sectionsClass.classList.add('active-link'); // Add the active-link class to the link
            } else {
                sectionsClass.classList.remove('active-link'); // Remove the active-link class from the link
            }
        } else {
            console.warn(`No link found for section ID: ${sectionId}`); // Log a warning if the link is not found
        }
    });
};

window.addEventListener('scroll', scrollActive);

/*============= FEEDBACK FORM + ERROR CHECKER =============*/
/* Handle form submission and validation for the feedback form */
const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

/* Function to send an email using SMTP server credentials and display success or error notifications using SweetAlert. */
function sendEmail(){
    const bodyMessage = `Full Name: ${fullName.value} <br> Email: ${email.value} <br> Phone Number: ${phone.value} <br> Message: ${message.value}`; // Email body content

    Email.send({ // Send email using EmailJS
        SecureToken : "b6535f38-58db-4ff0-8c3d-93897c81f545",
        To : 'Omegadiscordgamebot@gmail.com',
        From : "Omegadiscordgamebot@gmail.com",
        Subject : subject.value,
        Body : bodyMessage
    }).then(
      message => {
        if (message == "OK"){
            Swal.fire({
                title: "Success!",
                text: "Message sent successfully!",
                icon: "success"
              });
            }
        }
    );
}

/* Validates input fields on the form. Adds error classes to inputs with invalid data, and removes them when corrected. */
function checkInputs(){ // Function to check form inputs for errors
    const items = document.querySelectorAll(".item"); // Get all form inputs

    for (const item of items){ /// Loop through each input
        if (item.value == ""){ // Check if the input is empty
            item.classList.add("error"); // Add the error class to the input
            item.parentElement.classList.add("error"); // Add the error class to the input's parent element
        }

        if (items[1].value != ""){ // Check if the email input is not empty 
            checkEmail();
        }

        items[1].addEventListener("keyup", () => { // Listen for keyup events on the email input
            checkEmail();
        });

        item.addEventListener("keyup", () => { // Listen for keyup events on the input
            if (item.value != ""){
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            }
            else{
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        });
    }
}

/* Validates the email address against a regular expression to ensure it's in a correct format. */
function checkEmail(){
    const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/; // Regular expression for email validation
    const errorTxtEmail = document.querySelector(".error-txt.email"); // Get the error message element for the email input

    if (!email.value.match(emailRegex)){ // Check if the email input value does not match the regular expression
        email.classList.add("error");
        email.parentElement.classList.add("error");

        if (email.value != ""){ // Check if the email input is not empty
            errorTxtEmail.innerText = "Please enter a valid email address"; // Display an error message
        }
        else{
            errorTxtEmail.innerText = "Email Address can't be blank"; // Display an error message
        }
    }
    else{
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}

/* Stops the form from submitting if there are errors and triggers the email send function if all inputs are valid. */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkInputs();

    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !phone.classList.contains("error") && !subject.classList.contains("error") && !message.classList.contains("error")){ // Check if there are no errors
        sendEmail();

        form.reset();
        return false;
    }
    
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
/* Setup for scroll-triggered animations using the ScrollReveal library to enhance the visual interaction on the webpage. */
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2500,
    delay: 300
    //reset: true // Animation repeat
})

/* Register elements to reveal animations as they come into the viewport. */
sr.reveal(`.home__img, .features__data, .benefits_img, share__content, .contact__content, .footer, .feedback`);
sr.reveal(`.home__data, .benefits__list, .share__img, .contact__img, .feedback__form`, {delay: 500});
sr.reveal(`.home__img`, {delay: 500, interval: 100});
