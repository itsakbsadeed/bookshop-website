// Select the elements
const menuIcon = document.getElementById("menu-icon");
const nav = document.getElementById("nav");

// Toggle the active class on  nav when  hamburger menu is clicked
menuIcon.addEventListener("click", () => {
    nav.classList.toggle("active");
});