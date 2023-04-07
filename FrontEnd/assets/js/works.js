import { adminAuth } from "./auth.js";
import { openModal } from "./modal.js";

//Récupération des travaux depuis l'API
const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();

//Récupération de l'élément du DOM qui accueillera les projets
const gallery = document.querySelector(".gallery");

function createGallery(works) {
    gallery.innerHTML = "";
    works.forEach(work => {
        //Création de chaque projet en HTML
        const workElement = document.createElement("figure");
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
    })
};

createGallery(works);

function createCategoryButton(category, checked) {
    //Création des boutons
    const galleryCategory = document.createElement("input")
    galleryCategory.type = "radio";
    galleryCategory.id = category;
    galleryCategory.name = "category";
    galleryCategory.value = category;
    galleryCategory.checked = checked;
    //Création de chaque label
    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", category);
    categoryLabel.innerText = category;
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

//Création des boutons si l'aadmin n'est pas connectée sinon bouton modifier
if(!adminAuth()) {
    //Récupération des catégories pour chaque projet
    let workCategories = works.map(work => {
        return work.category.name;
        
    });

    //Création d'un set avec les 3 catégories
    workCategories = new Set(workCategories);

    //Récupération de l'élément du DOM qui accueillera les boutons
    const portfolio = document.querySelector("#portfolio");
    //Création d'une div pour accueillir les boutons
    const galleryMenu = document.createElement("div");
    galleryMenu.classList.add("gallery-menu");
    //Rattachement de la div gallery-menu à la section portfolio
    portfolio.insertBefore(galleryMenu, gallery);

    //Création des boutons radio pour chaque catégorie
    createCategoryButton("Tous", true);
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
    //Création de l'icon modifier
    const modifyIcon = document.createElement("i");
    modifyIcon.classList.add("fa-sharp", "fa-regular", "fa-pen-to-square");
    modify.appendChild(modifyIcon)
    //Ajout du lien modifier
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    const modifyLink = document.createTextNode("Modifier");
    a.appendChild(modifyLink)
    modify.appendChild(a);
    //Ecouteur d'évènement pour ouvrir la modale
    openModal(e)
    a.addEventListener("click", openModal)
}