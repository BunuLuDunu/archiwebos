import { adminAuth } from "./auth.js";

//Récupération des travaux depuis l'API
const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();

//Récupération de l'élément du DOM qui accueillera les projets
const gallery = document.querySelector(".gallery");


//
//Fonction pour créer la gallerie de projets
//
function createGallery(works) {
    gallery.innerHTML = "";
    works.forEach(createGalleryItem)
};

createGallery(works);

//
//Fonction pour créer un projet dans la gallerie
//
function createGalleryItem(work) {
    //Création de chaque projet en HTML
    const workElement = document.createElement("figure");
    workElement.setAttribute("id", work.id);
    const imageElement = document.createElement("img");
    imageElement.setAttribute("alt", work.title);
    imageElement.src = work.imageUrl;
    const titleElement =  document.createElement("figcaption");
    titleElement.innerText = work.title;

    //Rattachement de la balise figure à la div gallery
    gallery.appendChild(workElement);
    //Rattachement de l'image à la balise figure
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
}

//
//Fonction pour créer les boutons filtres par catégorie
//
function createCategoryButton(category, checked) {
    //Création des boutons
    const galleryMenu = document.querySelector(".gallery-menu")
    const galleryCategory = document.createElement("input")
    galleryCategory.type = "radio";
    galleryCategory.id = category.id;
    galleryCategory.name = "category";
    galleryCategory.value = category.name;
    galleryCategory.checked = checked;
    //Création de chaque label
    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", category.id);
    categoryLabel.innerText = category.name;
    //Ajout de l'écouteur d'évènement pour filtrer au clic
    galleryCategory.addEventListener("click", e => {
       const filteredWorks = works.filter(function (work) {
        return work.category.name == galleryCategory.value || galleryCategory.value == "Tous";
       });
       createGallery(filteredWorks);
    });

    //Rattachement des boutons à la div gallery-menu
    galleryMenu.appendChild(galleryCategory);
    galleryMenu.appendChild(categoryLabel);
    
}

//
//Fonction pour le select de la modale à l'ajout de nouveaux travaux
//
function createCategoryOption(category) {
    const categorySelect = document.getElementById("work-category")
    const categoryOption = document.createElement("option")
    categoryOption.value = category.id;
    categoryOption.innerText = category.name;
    categorySelect.appendChild(categoryOption)
}

//Récupération des catégories pour chaque projet
let workCategories = await fetch('http://localhost:5678/api/categories');
workCategories = await workCategories.json();


//
//Création des boutons si l'admin n'est pas connectée sinon, dashboard admin
//
if(!adminAuth()) {

    //Récupération de l'élément du DOM qui accueillera les boutons
    const portfolio = document.querySelector("#portfolio");
    //Création d'une div pour accueillir les boutons
    const galleryMenu = document.createElement("div");
    galleryMenu.classList.add("gallery-menu");
    //Rattachement de la div gallery-menu à la section portfolio
    portfolio.insertBefore(galleryMenu, gallery);

    //Création des boutons radio pour chaque catégorie
    createCategoryButton({
        "id": 0,
        "name": "Tous"
    }, true);
    workCategories.forEach(category => {
        createCategoryButton(category, false)
    });
} else {
    //Récupération de l'élement du DOM qui accueillera le bouton modifier
    const title = document.querySelector(".title");
    //Création d'une div pour l'icone et le texte
    const modify = document.createElement("div");
    modify.classList.add("modify");
    title.appendChild(modify)
    //Ajout du bouton modifier
    const modifyButton = document.createElement("button");
    modifyButton.setAttribute("type", "button");
    modifyButton.setAttribute("id", "open-modal-btn");
    modifyButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
    modify.appendChild(modifyButton)
    //Faire apparaître la bannière d'édition
    const editBanner = document.querySelector("#edit-banner");
    editBanner.style.display = "flex";
    //Faire apparaître le bouton modifier de l'intro
    const editBtn = document.querySelector(".edit-intro");
    editBtn.style.display = "flex";
    //Faire disparaître le bouton log-in
    const logIn = document.querySelector(".login");
    logIn.style.display = "none";
    //Faire apparaître le bouton log-out qui déconnecte au clic
    const logOut = document.querySelector(".logout");
    logOut.style.display = "inline";
    logOut.addEventListener('click', (e) => {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token')
    })
    //Récupération des catégories pour le select
    workCategories.forEach(category => {
        createCategoryOption(category)
    });
}

// 
//Fonction pour supprimer les travaux par ID
// 
export async function deleteWorkbyID(id) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Authorization': "Bearer " + token
        }
    });

    return response;
}

//
//Ajout d'un nouveau projet
//
const addForm = document.querySelector('.add-work');

//
//Fonction pour vérifier le remplissage de chaque champ du formulaire
//
function formValidation(e) {
    //Récupération des champs du formulaire
    const image = document.getElementById('add-work').files[0];
    const fileTitle = document.getElementById('work-title').value;
    const fileCategory = document.getElementById('work-category').value;

    if (!fileTitle || !image || !fileCategory) {
        document.querySelector('.modal-form-submit').disabled = true;
    } else {
        document.querySelector('.modal-form-submit').disabled = false;
    }
}

//Ecouteurs d'évènements pour le remplissage de chaque champ du formulaire
document.querySelectorAll('#add-work, #work-title, #work-category').forEach(field => {
    field.addEventListener('change', formValidation)
})

//Ecouteur d'évènement au submit du formulaire
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //Récupération des champs du formulaire
    const image = document.getElementById('add-work').files[0];
    const fileTitle = document.getElementById('work-title').value;
    const fileCategory = document.getElementById('work-category').value;

    if (!fileTitle || !image || !fileCategory) {
        alert("Veuillez remplir entièrement le formulaire.");
    }

    //Création de l'objet formData
    const formData =  new FormData();
    formData.append("image", image);
    formData.append("title", fileTitle);
    formData.append("category", fileCategory);

    //Vérification du remplissage des champs du formulaire
    const token = sessionStorage.getItem('token');
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Authorization': "Bearer " + token,
        },
        body: formData,
    });
    if(response.status == 201) {
        addForm.reset();
        document.getElementById('file-preview').src = "";
        createGalleryItem(await response.json())
    }
})

