const container = document.querySelector("#container");

let recipesJson; //

// ================= Fetch ==============================================
async function fetchRecipes() {
  await fetch("json/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      recipesJson = data.recipes;
      displayRecipes(recipesJson);
      sortRecipes();
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
    let valueInput = e.target.value;
    const articlesRecipes = document.querySelector("[data-id]");

    let matched_recipes = []; // tableau vide pour recuperer les recettes ayant le mot correspondant
    if (valueInput.length >= 3) {
      // article.style.display = "none";

      recipesJson.forEach((recipe) => {
        //

        let verifOccurrences = searchMatchRecipe(recipe, valueInput);

        // test occurences des mots dans la description des recettes et l'input

        if (verifOccurrences == true) {
          matched_recipes.push(recipe);
        }
      });
      displayRecipes(matched_recipes);
    } else if (valueInput.length < 3) {
      displayRecipes(recipesJson);
    }
    // fin else
  });
}

function searchMatchRecipe(recipe, valueInput) {
  let { appliance, ustensils, description, ingredients } = recipe;
  let result = description.includes(valueInput);
  return result;
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
const body = document.querySelector("body");
const up = document.querySelector("#i");

btnIngredient.addEventListener("click", () => {
  inputIngredient.style.width = "39%";
  sousMenu.style.display = "block";
  document.getElementById("i").classList.add("fa-chevron-up");
  document.getElementById("i").classList.remove("fa-chevron-down");
  document.querySelector(".search-ingredient").placeholder =
    "Rechercher un ingrédient";
});

fetchRecipes();
