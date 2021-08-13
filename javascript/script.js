const container = document.querySelector("#container");

let recipesJson; //

// ================= Fetch ==============================================
async function fetchRecipes() {
  await fetch("json/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      recipesJson = data.recipes;
      displayRecipes(recipesJson);
      inputSearch();
    });
}

// ================= fonction qui permet de générer le contenu des recettes=============
function displayRecipes() {
  let containerRecipes = [];
  for (let recipe of recipesJson) {
    containerRecipes.push(templateRecipe(recipe));
  }
  let html = containerRecipes.reduce((a, l) => a + l);
  container.innerHTML = html;
}
// ===================== Input principal de recherche ===================

function inputSearch() {
  const inputSearch = document.querySelector('input[type="search"]');

  inputSearch.addEventListener("input", (e) => {
    const dataId = document.querySelectorAll("[data-id]");

    let valueInput = e.target.value;

    if (valueInput.length >= 3) {
      let value = Object.keys(recipesJson);

      for (let i = 0; i < value.length; i++) {
        let description = recipesJson[value[i]].description;
        let verifOccurrences = description.includes(valueInput); // test occurences des mots dans la description des recettes et l'input
        let matched_recipes = []; // tableau vide pour recuperer les recettes ayant le mot correspondant
        let index = 0;
        if (verifOccurrences == true) {
          index++;
          matched_recipes.push(index);
          console.log(matched_recipes);
        }
      }
    }
  });
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
