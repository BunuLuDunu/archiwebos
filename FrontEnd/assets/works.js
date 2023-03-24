//Récupération des travaux depuis l'API
const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();

works.forEach(work => {
    //Récupération de l'élément du DOM qui accueillera les projets
    const gallery = document.querySelector(".gallery");
    //Création d'une balise dédiée à un projet
    const workElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const titleElement =  document.createElement("figcaption");
    titleElement.innerText = work.title;

    //Rattachement de la balise figure à la div gallery
    gallery.appendChild(workElement);
    //Rattachement de l'image à la balise figure
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
})