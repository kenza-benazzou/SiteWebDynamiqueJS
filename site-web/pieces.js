import {
  ajoutListenerAvisBoutons,
  ajoutListenerEnvoyerAvis,
  afficherAvis,
} from "./avis.js";

/*Récupération des pièces depuis le fichier JSON
//const reponse = await fetch("pieces-autos.json");
//const pieces = await reponse.json();
//const pieces = await fetch("pieces-autos.json").then(response => response.json());
//const reponse = await fetch(`http://localhost:8081/pieces`);
//const pieces = await reponse.json();*/

//recuperation des pieces depuis le serveur
//const pieces = await fetch(`http://localhost:8081/pieces`).then(response => response.json());

let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
  // Récupération des pièces depuis l'API
  const reponse = await fetch("http://localhost:8081/pieces/");
  pieces = await reponse.json();
  // Transformation des pièces en JSON
  const valeurPieces = JSON.stringify(pieces);
  // Stockage des informations dans le localStorage
  window.localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}

// on appel la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis(); // Ajout des listeners aux formulaires d'avis

Affichage(pieces);

for (let i = 0; i < pieces.length; i++) {
  const piece = pieces[i];
  const avis =
    JSON.parse(window.localStorage.getItem(`avis-piece-${piece.id}`)) || [];
  if (avis.length !== null) {
    const avisContainer = document.querySelector(
      `article[data-id="${piece.id}"] .avis`
    );
    afficherAvis(avisContainer, avis);
  }
}

//gestion des bouttons

//trier par prix croissant
const boutonTrierC = document.querySelector(".btn-trierc");
boutonTrierC.addEventListener("click", () => {
  const piecesOrdonneesC = pieces.sort((a, b) => a.prix - b.prix);
  Affichage(piecesOrdonneesC);
});

//trier par prix décroissant
const boutonTrierD = document.querySelector(".btn-trierd");
boutonTrierD.addEventListener("click", () => {
  const piecesOrdonneesD = pieces.sort((a, b) => b.prix - a.prix);
  Affichage(piecesOrdonneesD);
});

//filter les pièces non abordables
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", () => {
  const piecesFiltrees = pieces.filter((piece) => piece.prix > 35);
  Affichage(piecesFiltrees);
});

//filtrer la liste des pièces pour n’afficher que celles qui ont une description
const boutonFilterDescription = document.querySelector(".btn-description-on");
boutonFilterDescription.addEventListener("click", () => {
  const descriptionsFiltrees = pieces.filter((piece) => piece.description);
  Affichage(descriptionsFiltrees);
});

//Affichage des articles
function Affichage(articles) {
  const sectionFiches = document.querySelector(".fiches");
  sectionFiches.innerHTML = ""; // On vide la section avant de réafficher les fiches
  for (let i = 0; i < articles.length; i++) {
    let article = articles[i];
    // Création d’une balise dédiée à une pièce automobile
    const pieceElement = document.createElement("article");
    // On crée l’élément img.
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} € (${
      article.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "(Pas de description pour le moment.)";
    const disponibiliteElement = document.createElement("p");
    disponibiliteElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock";

    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.innerText = "Afficher les avis";

    const avisContainer = document.createElement("div");
    avisContainer.classList.add("avis");

    sectionFiches.appendChild(pieceElement);
    //Rattachement de nos balises au DOM
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(disponibiliteElement);
    pieceElement.appendChild(avisBouton);
    pieceElement.appendChild(avisContainer);
  }
  ajoutListenerAvisBoutons(); // Ajout des listeners aux boutons d'avis
}

//exercice1: Affichage des noms des pièces abordables
//suppression des éléments non abordables
const noms = pieces.map((piece) => piece.nom);
for (let i = noms.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}
// Affichage des elements abordables
const abordableElements = document.createElement("ul");
//ajout des noms a la liste
for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = noms[i];
  abordableElements.appendChild(nomElement);
}
// création de la div pour les éléments abordables
let abordableDiv = document.createElement("div");
abordableDiv.classList.add("abordables");
document.querySelector(".filtres").appendChild(abordableDiv);
abordableDiv.appendChild(document.createElement("p")).innerText =
  "Liste des pièces abordables";
document.querySelector(".abordables").appendChild(abordableElements);

//exercice2: Affichage des pièces disponibles
let disponibiliteElements = pieces.map((piece) => piece.disponibilite);
let nomElementsDispo = pieces.map((piece) => piece.nom);
let prixElementsDispo = pieces.map((piece) => piece.prix);

const pieceDispo = document.createElement("ul");
//afficher toutes les pieces disponible et leurs prix
for (let i = 0; i < disponibiliteElements.length; i++) {
  // On vérifie si la pièce est disponible
  if (disponibiliteElements[i]) {
    let nomElement = document.createElement("li");
    nomElement.innerText = `${nomElementsDispo[i]} - ${prixElementsDispo[i]} €`;
    pieceDispo.appendChild(nomElement);
  }
}

let dispoDiv = document.createElement("div");
dispoDiv.classList.add("disponibles");
document.querySelector(".filtres").appendChild(dispoDiv);
dispoDiv.appendChild(document.createElement("p")).innerText =
  "Liste des pièces disponibles";
document.querySelector(".disponibles").appendChild(pieceDispo);

//exercice 3 Range
const inputPrixMax = document.getElementById("prix-max");
inputPrixMax.addEventListener("input", () => {
  const prixMax = inputPrixMax.value;
  // Filtrer les pièces en fonction du prix maximum
  const piecesFiltrees = pieces.filter((piece) => piece.prix <= prixMax);
  Affichage(piecesFiltrees);
  document.getElementById("valeur-prix-max").innerText = prixMax;
});

const boutonMaj = document.querySelector(".btn-maj");
boutonMaj.addEventListener("click", () => {
  // Mettre à jour les pièces dans le localStorage
  window.localStorage.removeItem("pieces");
  window.location.reload();
});
