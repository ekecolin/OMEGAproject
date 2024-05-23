const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
};

navLink.forEach(n => n.addEventListener('click', linkAction));

const blurHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
};

window.addEventListener('scroll', blurHeader);

const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    window.scrollY >= 350 ? scrollUp.classList.add('show-scroll') : scrollUp.classList.remove('show-scroll');
};

window.addEventListener('scroll', scrollUp);

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copyLink');
    
    copyButton.addEventListener('click', e => {
        e.preventDefault();
        const linkToCopy = copyButton.getAttribute('data-link');
        
        navigator.clipboard.writeText(linkToCopy).then(() => {
            alert('OMEGA web link copied to clipboard!');
        }).catch(err => {
            console.error('Error copying link to clipboard', err);
        });
    });
});

const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*="' + sectionId + '"]');

        if (sectionsClass) {
            if (scrollY > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        } else {
            console.warn(`No link found for section ID: ${sectionId}`);
        }
    });
};

window.addEventListener('scroll', scrollActive);

const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

function sendEmail() {
    const bodyMessage = `Full Name: ${fullName.value} <br> Email: ${email.value} <br> Phone Number: ${phone.value} <br> Message: ${message.value}`;

    Email.send({
        SecureToken: "b6535f38-58db-4ff0-8c3d-93897c81f545",
        To: 'Omegadiscordgamebot@gmail.com',
        From: "Omegadiscordgamebot@gmail.com",
        Subject: subject.value,
        Body: bodyMessage
    }).then(
        message => {
            if (message == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Message sent successfully!",
                    icon: "success"
                });
            }
        }
    );
}

function checkInputs() {
    const items = document.querySelectorAll(".item");

    for (const item of items) {
        if (item.value == "") {
            item.classList.add("error");
            item.parentElement.classList.add("error");
        }

        if (items[1].value != "") {
            checkEmail();
        }

        items[1].addEventListener("keyup", () => {
            checkEmail();
        });

        item.addEventListener("keyup", () => {
            if (item.value != "") {
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            } else {
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        });
    }
}

function checkEmail() {
    const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errorTxtEmail = document.querySelector(".error-txt.email");

    if (!email.value.match(emailRegex)) {
        email.classList.add("error");
        email.parentElement.classList.add("error");

        if (email.value != "") {
            errorTxtEmail.innerText = "Please enter a valid email address";
        } else {
            errorTxtEmail.innerText = "Email Address can't be blank";
        }
    } else {
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    checkInputs();

    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !phone.classList.contains("error") && !subject.classList.contains("error") && !message.classList.contains("error")) {
        sendEmail();
        form.reset();
        return false;
    }
});

const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2500,
    delay: 300
});

sr.reveal(`.home__img, .features__data, .benefits_img, share__content, .contact__content, .footer, .feedback`);
sr.reveal(`.home__data, .benefits__list, .share__img, .contact__img, .feedback__form`, { delay: 500 });
sr.reveal(`.home__img`, { delay: 500, interval: 100 });
