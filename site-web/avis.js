export function ajoutListenerAvisBoutons() {
  const piecesElements = document.querySelectorAll(".fiches article button");
  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async (event) => {
      const idPiece = event.target.dataset.id;
      const reponse = await fetch(
        `http://localhost:8081/pieces/${idPiece}/avis`
      );
      const avis = await reponse.json();
      window.localStorage.setItem(`avis-piece-${idPiece}`, JSON.stringify(avis));
      const avisContainer = event.target.parentElement.querySelector(".avis");
      afficherAvis(avisContainer, avis);
    });
  }
}

export function afficherAvis(avisContainer, avis)
{
     let avisListe = "<ul>";
      for (let i = 0; i < avis.length; i++) {
        avisListe += `<li>${avis[i].utilisateur}: ${avis[i].commentaire}</li>`;
      }
      avisListe += "</ul>";

      if(avisContainer !== null && avisContainer !== undefined){
        avisContainer.innerHTML = "";
        avisContainer.innerHTML = avisListe;
      }
}

export function ajoutListenerEnvoyerAvis() {
    const form = document.querySelector(".formulaire-avis")
    form.addEventListener("submit", async(event) =>{
        event.preventDefault();

        const avis={
            pieceId: parseInt(event.target.querySelector("input[name='piece-id']").value),
            utilisateur: event.target.querySelector("input[name='utilisateur']").value,
            commentaire: event.target.querySelector("input[name='commentaire']").value,
            note : parseInt(event.target.querySelector("input[name='nbEtoiles']").value)
        }
        
        const chargeUtile = JSON.stringify(avis);
        


        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    })
}