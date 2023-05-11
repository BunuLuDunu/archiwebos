//Fonction pour vérifier si les informations de login correspondent à l'API, si oui stocker l'userId et le token, sinon message d'erreur
export async function login(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            email : email, 
            password : password,
        }),
    });
    const loginInfo = await response.json();
    if(loginInfo.userId && loginInfo.token) {
        window.sessionStorage.setItem('userId', loginInfo.userId)
        window.sessionStorage.setItem("token", loginInfo.token)
        window.location.href='./'
    }else {
        const formLogin = document.querySelector(".login-form");
        const loginAlert = document.createElement("p");
        loginAlert.classList.add("login-alert");
        loginAlert.innerText = "Login ou mot de passe incorrect.";
        formLogin.appendChild(loginAlert)
    }
}


//Fonction pour vérifier si l'administratrice est bien connectée
export function adminAuth() {
    const userId = window.sessionStorage.getItem("userId");
    const token = window.sessionStorage.getItem("token");

    return userId !== null && token !== null;
}