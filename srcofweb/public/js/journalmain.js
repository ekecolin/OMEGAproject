import App from "./App.js";

// Get the main container element where the app will be initialized.
const root = document.getElementById("app");
// Initialize the main app class.
const app = new App(root);

// Function to add blur effect to header on scroll
const blurHeader = () => {
    const header = document.getElementById('header');
    // Apply blur class if window is scrolled more than 50 pixels.
    window.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
};

// Attach scroll event listener to window to trigger blur effect on header.
window.addEventListener('scroll', blurHeader);

// Navigation menu elements and their event listeners for opening and closing.
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// Add click event to open menu when toggle icon is clicked.
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Add click event to close menu when close icon is clicked.
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Handling navigation link actions to close menu when any link is clicked.
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    // Function to hide navigation menu
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
};
// Attach the link action function to each navigation link.
navLink.forEach(n => n.addEventListener('click', linkAction));
