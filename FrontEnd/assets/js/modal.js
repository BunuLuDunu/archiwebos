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

//Fonction pour afficher et supprimer les projets dans la modale
function createGalleryModal(works) {
    const galleryModal = document.querySelector(".gallery-modal")
    galleryModal.innerHTML = "";
    works.forEach(work => {
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
        deleteWork.addEventListener('click', async (e) => {
            e.preventDefault();
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
    })
};

createGalleryModal(works)