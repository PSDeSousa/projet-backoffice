//tableau miroir du JSON
let produits = document.getElementById('product-row');
let categories = document.querySelector('.list-categorie');
let form = document.getElementById('form-product');
let donnees = [];

fetch('produits.json')
  .then(function(reponse) {
    return reponse.json();
  })
  .then(function(data) {
    jsonDonnees = data;


    //Local storage du JSON :
    if (!localStorage.getItem("jsonDonnees")){
      localStorage.setItem("jsonDonnees",JSON.stringify(jsonDonnees));
      donnees = JSON.parse(localStorage.getItem("jsonDonnees"));
    }else{
      donnees = JSON.parse(localStorage.getItem("jsonDonnees"));
      console.log(donnees);
    }

    afficherProduits();
  })
  .catch(function(error) {
    console.error("Erreur lors du chargement du fichier JSON :", error);
  });

  //bouton reset localStorage
    document.getElementById("resetStorage").addEventListener("click", function(){
    localStorage.clear()
    donnees = jsonDonnees;
    afficherProduits();
  })



  function afficherProduits() {
    produits.innerHTML = "";
    //déclarations catégories
    let tabCategorie = [""];

    for (let i = 0; i < donnees.length; i++) {
      let produit = donnees[i];
      //création des lignes du tableau
      let row = document.createElement('tr');
  
      let contenu = "<td>" + produit.reference + "</td>";
      contenu += "<td>" + produit.categorie + "</td>";
      contenu += "<td>" + produit.libelle + "</td>";
      contenu += "<td>" + produit.prix + "€</td>";
      if (produit.stock > 0) {
        contenu += "<td><div class='stock-oui'><div></td>";
      }else{
        contenu += "<td><div class='stock-non'><div></td>";
      };
      //boutons tableau
      contenu += "<td><button onclick='visualiser(" + '"' + produit.reference + '"' + ")' class='secondary-button'><img src='assets/images/icone/eye.png' alt='Voir'></button></td>";
      contenu += "<td><button onclick='modifier(" + '"' + produit.reference + '"' + ")' class='secondary-button'><img src='assets/images/icone/edit.png' alt='Modifier'></button></td>";
      contenu += "<td><button onclick='supprimer(" + '"' + produit.reference + '"' +  ")' class='secondary-button'><img src='assets/images/icone/trash.png' alt='Supprimer'></button></td>";

      row.innerHTML = contenu;
  
      produits.appendChild(row);

      //alimente la liste categorie
      listeLesCategories(produit.categorie, tabCategorie);
    }
    //boucle le tableau des catégories pour alimenter la liste
    for (let k = 0; k < tabCategorie.length; k++){
        let catOption = document.createElement('option');
        contenuCat = tabCategorie[k];   
        catOption.innerHTML = contenuCat;
        categories.appendChild(catOption);
    }
  }

//Bouton enregistrer du formulaire
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  
    let inputRef = document.getElementById('product-reference').value;
    let inputCategorie = document.getElementById('product-categorie').value;
    let inputLibelle = document.getElementById('product-libelle').value;
    let inputPrix = document.getElementById('product-prix').value;
    let inputPhoto = document.getElementById('product-photo').value;
    let inputDescription = document.getElementById('product-description').value;
    //Boucle pour vérifier si la reference existe déjà ou non avec une variable testNew vrai ou faux
    let testNew = true;    
    for (let i = 0; i < donnees.length; i++) {
      //si la référence existe on enregistre les modifications
        if (donnees[i].reference === inputRef) {
            donnees[i].categorie = inputCategorie;
            donnees[i].libelle = inputLibelle;
            donnees[i].prix = parseInt(inputPrix * 100) / 100;
            donnees[i].photo = inputPhoto;
            donnees[i].description = inputDescription;
            donnees[i].stock = verifCheckbox(donnees[i].stock);
            testNew = false;
            break;
        }
    }
    //si la référence n'existe pas on crée un nouveau produit dans les données
    if (testNew) {
        let nouveauProduit = {
            reference: inputRef, 
            libelle: inputLibelle,
            description: inputDescription,
            stock: verifCheckbox(1),
            prix: parseInt(inputPrix * 100)/100,
            categorie: inputCategorie,
            photo: inputPhoto,
        }
        donnees.push(nouveauProduit);
    }
    localStorage.setItem("jsonDonnees",JSON.stringify(donnees));
    donnees = JSON.parse(localStorage.getItem("jsonDonnees"));
    //remise à zéro du formulaire
    form.reset();
  
    afficherProduits();
  });

//Déclarations Modal Page d'ajout

let ouvrirAjout = document.getElementById("ajout");
let pageAjout = document.getElementById("page-ajout");
let fermerAjout = document.getElementById("fermer-ajout");

// Ouvre le formulaire d'ajout (modal)

//Clique bouton ouverture
ouvrirAjout.addEventListener("click", function(){
    ouvPage(pageAjout);
});


//clique bouton fermeture
fermerAjout.addEventListener("click", function(e){
    //Sinon la page se réactualisait
    e.preventDefault();
    if (pageAjout.classList.contains("hidden")){    
    }else{
        pageAjout.classList.remove("show");
        pageAjout.classList.add("hidden");
    }
    form.reset();
});

// Ouvre la fiche produit (modal)

let pageVisu = document.getElementById("page-visu");
let fermerVisu = document.getElementById("fermer-visu");


//clique bouton fermeture
fermerVisu.addEventListener("click", function(e){
    //Sinon la page se réactualisait
    e.preventDefault();
    if (pageVisu.classList.contains("hidden")){    
    }else{
        pageVisu.classList.remove("show");
        pageVisu.classList.add("hidden");
    }
});


//fonction pour identifier les catégories et les mettre dans un tableau
function listeLesCategories(cat, tab){
    let testCat=false;
    if (tab.length === 0){
        tab.push(cat)
    }else{
        for (let j = 0; j < tab.length; j++){
            if (tab[j] === cat){
                testCat = true
            }
        }
        if (!testCat){
            tab.push(cat)
        }
    }
}


//Remplir le formulaire avec 1 produit
function modifier(inputRef) {
    ouvPage(pageAjout);
    for (let i = 0; i < donnees.length; i++) {
      if (donnees[i].reference === inputRef) {
        document.getElementById('product-reference').value = donnees[i].reference;
        document.getElementById('product-categorie').value = donnees[i].categorie;
        document.getElementById('product-libelle').value = donnees[i].libelle;
        document.getElementById('product-prix').value = donnees[i].prix;
        document.getElementById('product-photo').value = donnees[i].photo;
        document.getElementById('product-description').value = donnees[i].description;
        //En fonction du stock : on ajoute des classes pastille verte ou rouge
        if (donnees[i].stock > 0) {
            document.getElementById('product-stock').checked = true ;
          }else{
            document.getElementById('product-stock').checked = false ;
          };
        break;
      }
    }
    localStorage.setItem("jsonDonnees",JSON.stringify(donnees));
    donnees = JSON.parse(localStorage.getItem("jsonDonnees"));
}

let visuPhoto = document.getElementById("visu-photo")
//Remplir la card avec 1 produit
function visualiser(inputRef) {
  ouvPage(pageVisu);
  for (let i = 0; i < donnees.length; i++) {
    //on remplit les éléments de la card avec des inner text
      if (donnees[i].reference === inputRef) {
          document.getElementById('visu-reference').innerText = donnees[i].reference;
          document.getElementById('visu-categorie').innerText = donnees[i].categorie;
          document.getElementById('visu-libelle').innerText = donnees[i].libelle;
          document.getElementById('visu-prix').innerText = donnees[i].prix + "€";
          document.getElementById('visu-photo').value = donnees[i].photo;
          document.getElementById('visu-description').innerText = donnees[i].description;
          //En fonction du stock : on ajoute des classes pastille verte ou rouge
          if (donnees[i].stock > 0) {
              if (document.getElementById('visu-stock-tag').classList.contains('stock-non')){
                document.getElementById('visu-stock-tag').classList.remove('stock-non');
              }
              document.getElementById('visu-stock-tag').classList.add('stock-oui');
              document.getElementById('visu-stock').innerText = "En stock";
          }else{
            if (document.getElementById('visu-stock-tag').classList.contains('stock-oui')){
              document.getElementById('visu-stock-tag').classList.remove('stock-oui');
            }
              document.getElementById('visu-stock-tag').classList.add('stock-non').add;
              document.getElementById('visu-stock').innerText = "Epuisé";
          };
          //Image : on rajoute une balise image dans la div
          let contenu = '<img src="assets/images/images-produits/' + donnees[i].photo + '" alt="' + donnees[i].libelle + '">';
          
          visuPhoto.innerHTML = contenu;
          break;
    }
  }
}

//Suppression d'une ligne
function supprimer(inputRef) {
let nouvelleListe = [];
for (let i = 0; i < donnees.length; i++) {
    if (donnees[i].reference !== inputRef) {
    nouvelleListe.push(donnees[i]);
    }
}
donnees = nouvelleListe;
afficherProduits();
}

//Fonction ouverture de modale
function ouvPage(page){
    if (page.classList.contains("hidden")){
        page.classList.remove("hidden");
        page.classList.add("show");
    }
}

//fonction vérif checkbox
function verifCheckbox(sto){
  let checkbox = document.getElementById("product-stock");
  if(checkbox.checked){
    return sto;
  }else{
    return 0;
  }
}


