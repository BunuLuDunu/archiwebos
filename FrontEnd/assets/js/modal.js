import { deleteWorkbyID } from "./works.js";

//Récupération des travaux depuis l'API
const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();

const modal = document.querySelector('#modal')

document.addEventListener('click', (e) => {
    if(e.target.closest('.close-modal-btn') || !e.target.closest('.modal-wrapper')) {
        modal.close();
    }
})

document.addEventListener('click', (e) => {
    if(e.target.closest('#open-modal-btn')) {
        modal.showModal();
    }
})

//Récupération de la modale
const galleryModal = document.querySelector(".gallery-modal")

//
//Fonction pour afficher les projets dans la modale
//
function createGalleryModal(works) {
    galleryModal.innerHTML = "";
    works.forEach(createGalleryModalItem)
};

createGalleryModal(works)

//
//Fonction pour créer chaque projet dans la modale
//
export function createGalleryModalItem(work) {
    //Création de chaque projet en HTML
    const workElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.setAttribute("alt", work.title);
    imageElement.src = work.imageUrl;

    //Ajout du bouton éditer
    const editWork = document.createElement("button");
    editWork.setAttribute("type", "button");
    editWork.classList.add("edit-work");
    editWork.textContent = "éditer";

    //Ajout du bouton supprimer
    const deleteWork = document.createElement("button");
    deleteWork.setAttribute("type", "button");
    deleteWork.classList.add("delete-work");
    deleteWork.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    //Ajout d'un écouteur d'évènement pour supprimer un projet
    deleteWork.addEventListener('click', async () => {
        if(!confirm("Êtes-vous certain.e de vouloir supprimer le projet ?")) {
            return
        }
        const response = await deleteWorkbyID(work.id);
        if(response.status === 204) {
            workElement.remove();
            document.getElementById(work.id).remove();
        }
    })

    //Ajout du bouton deplacer
    const moveWork = document.createElement("button");
    moveWork.setAttribute("type", "button");
    moveWork.classList.add("move-work");
    moveWork.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;

    //Rattachement de la balise figure à la div gallery
    galleryModal.appendChild(workElement);
    //Rattachement de l'image à la balise figure
    workElement.appendChild(imageElement);
    //Rattachement du bouton éditer à la balise figure
    workElement.appendChild(editWork);
    //Rattachement du bouton supprimer à la balise figure
    workElement.appendChild(deleteWork);
    //Rattachement du bouton deplacer à la balise figure
    workElement.appendChild(moveWork);
}

//Modale d'ajout de photo
const modalForm = document.querySelector('#modal-form')

document.addEventListener('click', (e) => {
    if(e.target.closest('#file-upload')) {
        modalForm.showModal();
        modal.close();
    }
})

document.addEventListener('click', (e) => {
    if(e.target.closest('.close-modal-btn') || !e.target.closest('.modal-wrapper')) {
        modalForm.close();
    }
})

document.addEventListener('click', (e) => {
    if(e.target.closest('.return-modal-btn')) {
        modal.showModal();
        modalForm.close();
    }
})

//Preview de la photo ajoutée
document.addEventListener('change', (e) => {
    if(e.target.closest('#add-work')) {
        if(e.target.files.length == 0) {
            return
        }

        const src = URL.createObjectURL(e.target.files[0]);
        const preview = document.getElementById("file-preview");
        preview.src = src;
    }
})