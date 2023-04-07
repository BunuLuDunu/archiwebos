import { login } from "./auth.js";

//Récupération du formulaire de login
const loginForm = document.getElementById('form');

//Ecouteur d'évènement sur la confirmation du formulaire
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    login(email, password)
})