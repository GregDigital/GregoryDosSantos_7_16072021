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

      sortUstensils(USTENSILS);
      INGREDIENTS = getIngredients();
      USTENSILS = getUstensils();
      APPLIANCE = getAppliance();
      sortRecipes();

      /*
      TODO : 
      Afficher les ingredients et ajouter un events au click

      */
    });
}
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
      console.log(inputs);
      let matched_recipes = [];
      if (valueInput) {
        recipesJson.forEach((recipe) => {
          //

          console.log(recipe);
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
    // console.log(ingredient.ingredient);
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
  // console.log(deleteDuplicates);
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
  console.log(arrayAppliances);
}

// ===========================  Button ustensiles ======================

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

function getUstensils() {
  let ustensils = recipesJson.map((recipe) => recipe.ustensils).flat();
  let arrayUstensils = Array.from(new Set(ustensils));

  displayUstensils(arrayUstensils);
}

function displayUstensils(ustensils) {
  let containerUstensils = [];
  let containerUl = document.querySelector(".ustensile");
  for (let i = 0; i < ustensils.length; i++) {
    let elt = ustensils[i];
    let ustensil = elt[0].toUpperCase() + elt.slice(1);

    USTENSILS.push(`
    <li><a href="#" id="">${ustensil}</a></li>
    `);
  }
  let html = USTENSILS.reduce((a, l) => a + l);
  containerUl.innerHTML = html;
}

function sortUstensils(USTENSILS) {
  const inputSearchUstensils = document.querySelector("#search-ustensiles");

  inputSearchUstensils.addEventListener("input", (e) => {
    let valueInputUstensils = e.target.value;

    if (valueInputUstensils.length >= 3) {
      let inputsUstensils = valueInputUstensils.split(" ");
      let matchedd = [];
      if (valueInputUstensils) {
        USTENSILS.forEach((ustensil) => {
          //

          console.log(ustensil);
          let matched = inputsUstensils.every((input) =>
            searchMatchUstensils(ustensil, input)
          );

          if (matched == true) {
            matchedd.push(ustensil);
          }
        });
        console.log(matchedd); // Occurrence OK
      }
    }
  });
}

//activeUstensils []

function searchMatchUstensils(ustensil, valueInputUstensils) {
  let test = ustensil;

  let regex = new RegExp(valueInputUstensils, "i");

  if (regex.test(test)) return true;

  return false;
}

function displayActiveUstensils() {}

fetchRecipes();

/*


*/
