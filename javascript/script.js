const container = document.querySelector("#container");

let recipesJson; //

let INGREDIENTS = [];
let USTENSILS = [];

let APPLIANCE = [];

let activeIngredients = [];
let activeUstensils = [];

// ================= Fetch ==============================================
async function fetchRecipes() {
  await fetch("json/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      recipesJson = data.recipes;
      displayRecipes(recipesJson);

      INGREDIENTS = getIngredients();
      USTENSILS = getUstensils();

      APPLIANCE = getAppliance();

      /*
      TODO : 
      Afficher les ingredients et ajouter un events au click

      */
    })
    .then(() => {
      sortRecipes();
      sortUstensils(USTENSILS);
    });
}
//console.log(USTENSILS);

function displayRecipes(recipes) {
  if (recipes.length > 0) {
    document.querySelector("#recipes-no-found").style.display = "none";
    let containerRecipes = [];
    for (let recipe of recipes) {
      containerRecipes.push(templateRecipe(recipe));
    }

    let html = containerRecipes.reduce((a, l) => a + l);
    container.innerHTML = html;
  } else if (recipes.length == 0) {
    document.querySelectorAll(".recipes-container").forEach((elt) => {
      elt.style.display = "none";
    });
    document.querySelector("#recipes-no-found").style.display = "block";
  } else {
    document.querySelector("#recipes-no-found").style.display = "none";
  }
}

// ================= fonction qui permet de générer le contenu des recettes=============

// ===================== Input principal de recherche ===================

function sortRecipes() {
  const inputSearch = document.querySelector('input[type="search"]');
  let notFound = document.querySelector("#recipes-no-found");
  inputSearch.addEventListener("input", (e) => {
    let valueInput = e.target.value; // mettre en minuscule

    if (valueInput.length >= 3) {
      let inputs = valueInput.split(" ");

      let matched_recipes = [];
      if (valueInput) {
        recipesJson.forEach((recipe) => {
          //

          let matched = inputs.every((input) =>
            searchMatchRecipe(recipe, input)
          );

          if (matched == true) {
            matched_recipes.push(recipe);
          }
        });

        displayRecipes(matched_recipes);
      }
    } else if (valueInput.length < 3) {
      displayRecipes(recipesJson);
    }
  });
}

function searchMatchRecipe(recipe, valueInput) {
  let { name, ingredients, description, appliance, ustensils } = recipe;
  let regex = new RegExp(valueInput, "i");

  if (regex.test(name)) return true;

  let ing_words = ingredients
    .map((e) => e.ingredient.split(" "))
    .flat()
    .join(" ");

  if (regex.test(ing_words)) return true;

  if (regex.test(description)) return true;

  return false;
}

// ==================== fonction qui permet de générer les ingredients dans le li =======

function generateIngredients(ingredients) {
  let acc = [];
  for (let ingredient of ingredients) {
    acc.push(
      ` <li>${ingredient.ingredient} : <span>${ingredient.quantity}</span></li>`
    );
  }
  let html = acc.reduce((a, l) => a + l);
  return html;
}

// ========================= fonction qui permet d'afficher contenu des recettes =========

function templateRecipe(recipe) {
  return `
        
      <article class="recipes-container" data-id="${recipe.id}">
      <div class="img"></div>
      <div class="recipes-container-infos">
        <div class="recipes-infos">
          <h3 class="name">${recipe.name}</h3>
          <div class="time">
            <i class="far fa-clock"></i><span> ${recipe.time}</span>
          </div>
        </div>
        <div class="recipes">
          <div class="recipes-composition">
            <ul class="recipes-ingredient">
            ${generateIngredients(recipe.ingredients)}
            
              
            </ul>
          </div>
          <div class="recipes-description">
          ${recipe.description}
          </div>
        </div>
      </div>
    </article>
    
      `;
}

// ===========================  Button Ingredients   ======================

const btnIngredient = document.querySelector(".btn-ingredient");
const inputIngredient = document.querySelector(".search-ingredient");
const sousMenu = document.querySelector(".sous-menu");
const up = document.querySelector("#i");

btnIngredient.addEventListener("click", () => {
  inputIngredient.style.width = "100%";
  sousMenu.style.display = "block";
  document.getElementById("i").classList.add("fa-chevron-up");
  document.getElementById("i").classList.remove("fa-chevron-down");
  document.querySelector(".search-ingredient").placeholder =
    "Rechercher un ingrédient";
});

function getIngredients() {
  let ingredients = recipesJson.map((elt) => elt.ingredients);

  let deleteDuplicates = Array.from(new Set(ingredients));

  return deleteDuplicates;
}

// ===========================  Button Appareil  ======================

const btnAppareil = document.querySelector(".btn-appareil");
const inputAppareil = document.querySelector(".search-appareil");
const sousMenuAppareil = document.querySelector(".sous-menu-appareil");

btnAppareil.addEventListener("click", () => {
  inputAppareil.style.width = "130%";
  sousMenuAppareil.style.display = "block";
  document.getElementById("i").classList.add("fa-chevron-up");
  document.getElementById("i").classList.remove("fa-chevron-down");
  document.getElementById("search-appareil").placeholder =
    "Rechercher un appareil";
});

function getAppliance() {
  let appliances = recipesJson.map((elt) => elt.appliance).flat();

  let arrayAppliances = Array.from(new Set(appliances));
}

// ===========================  Button ustensiles ================================================

const btnUstensile = document.querySelector(".btn-ustensiles");
const inputUstensile = document.querySelector(".search-ustensiles");
const sousMenuUstensile = document.querySelector(".sous-menu-ustensiles");

btnUstensile.addEventListener("click", () => {
  inputUstensile.style.width = "130%";
  sousMenuUstensile.style.display = "block";
  document.getElementById("i").classList.add("fa-chevron-up");
  document.getElementById("i").classList.remove("fa-chevron-down");
  document.getElementById("search-ustensiles").placeholder =
    "Rechercher un Ustensiles";
});

// ============================ Map Ustensils =============================

function getUstensils() {
  let ustensilsJson = recipesJson.map((recipe) => recipe.ustensils); // recette avec les ustensiles
  let ustensils = recipesJson.map((recipe) => recipe.ustensils).flat();
  let arrayUstensils = Array.from(new Set(ustensils)); // tri des ustensiles et des doublons
  USTENSILS.push(arrayUstensils); // USTENSILS = variable globale accessible
  //console.log(arrayUstensils);
  displayUstensils(arrayUstensils);
  return arrayUstensils;
}

//============================ Affichage des ustensiles ====================================

function displayUstensils(ustensils) {
  let containerHtml = [];
  let containerUl = document.querySelector(".ustensile");
  for (let ustensil of ustensils) {
    containerHtml.push(templateUstensils(ustensil));
  }

  let html = containerHtml.reduce((a, l) => a + l);
  containerUl.innerHTML = html;
}

// ================================ Template ustensiles ===================================

function templateUstensils(ustensil) {
  return `
<li class="value"><a href="#">${ustensil}</a></li>
`;
}

// ========= Fonction trier les ustensiles =======================================

function tagShowButton(e) {
  console.log(e.target);
  let valueText = e.target.innerText;
  let divMatchedButton = document.querySelector(".add-matchedButton");
  let btn = document.createElement("button");
  btn.classList.add("btn-ustensils-matched");
  let addText = document.createTextNode(valueText); // Créer un noeud textuel
  btn.appendChild(addText); // Ajouter le texte au bouton
  let test = document.createElement("i");
  test.classList.add("far", "fa-times-circle");
  btn.insertAdjacentElement("beforeend", test);
  divMatchedButton.appendChild(btn);
}

function sortUstensils(ustensils) {
  const inputSearchUstensils = document.querySelector("#search-ustensiles");

  inputSearchUstensils.addEventListener("input", (e) => {
    let valueInputUstensils = e.target.value;

    if (valueInputUstensils.length >= 3) {
      let inputsUstensils = valueInputUstensils.split(" ");
      if (valueInputUstensils) {
        ustensils.forEach((ustensil, index) => {
          //

          let matched = inputsUstensils.every((input) =>
            searchMatchUstensils(ustensil, input)
          );

          if (matched == true) {
            console.log(ustensils);
            ustensils.splice(index, 1);
            activeUstensils.push(ustensil);
            console.log(activeUstensils);
            console.log(ustensils);
            sousMenuUstensile.style.display = "block";
          }
        });

        displayUstensils(activeUstensils);
        //return activeUstensils;
      }
    } else if (valueInputUstensils == 0) {
      activeUstensils.forEach((removeUstensil) => {
        ustensils.push(removeUstensil);
      });
      activeUstensils = [];
      displayUstensils(ustensils);
      console.log(ustensils);
      console.log(activeUstensils);
    }
  });

  let valueTag = document.querySelectorAll(".value");
  valueTag.forEach((value) => {
    value.addEventListener("click", (e) => {
      tagShowButton(e);
      activeUstensils.push(value.textContent);
      value.remove();
      console.log(activeUstensils);
    });
  });

  let removeTag = document.querySelectorAll(".btn-ustensils-matched");

  removeTag.forEach((removeValue) => {
    console.log(removeTag);
    removeValue.addEventListener("click", (e) => {
      removeTag.push(activeUstensils);
      console.log(activeUstensils);
    });
  });
}

// ===============================

// ========= Fonction Search Match Ustensils  =======================================

function searchMatchUstensils(ustensil, valueInputUstensils) {
  let test = ustensil;

  let regex = new RegExp(valueInputUstensils, "i");

  if (regex.test(test)) return true;

  return false;
}

// ======================== On affiche les ustensiles qui match avec la saisie utilisateur ======

fetchRecipes();

/*
function displayActiveUstensils() {
  let containerHtml = [];
  if (matchedUstensils.length > 0) {
    let containerUl = document.querySelector(".ustensile");
    matchedUstensils.forEach((matchedUstensil) => {
      containerHtml.push(`
      <li class="value"><a href="#">${matchedUstensil}</a></li>
      `);
    });

    let html = containerHtml.reduce((a, l) => a + l);
    containerUl.innerHTML = html;
    console.log(containerHtml);
    // Dans la zone active j'efface pour afficher les élements en entrée
    sousMenuUstensile.style.display = "block";
  }
}
*/
