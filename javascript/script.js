const container = document.querySelector("#container");
let matched_recipes = [];

// ================= Fetch ==============================================
fetch("json/recipes.json")
  .then((res) => res.json())
  .then((data) => recipes(data));

// ===================== Input principal de recherche ===================

const inputSearch = document.querySelector('input[type="search"]');

inputSearch.addEventListener("input", (e) => {
  //e.preventDefault();

  if (e.target.value.length >= 3) {
    console.log(e.target.value);
  }
});

// ================= fonction qui permet de générer le contenu des recettes=============
function recipes(res) {
  let containerRecipes = [];
  for (let recipe of res.recipes) {
    containerRecipes.push(recipesDislay(recipe));
  }
  let html = containerRecipes.reduce((a, l) => a + l);
  container.innerHTML = html;
}

// ==================== fonction qui permet de générer les ingredients dans le li =======

function generateIngredients(ingredients) {
  let acc = [];
  for (let ingredient of ingredients) {
    console.log(ingredient.ingredient + " : " + ingredient.quantity);
    acc.push(
      ` <li>${ingredient.ingredient} : <span>${ingredient.quantity}</span></li>`
    );
  }
  let html = acc.reduce((a, l) => a + l);
  return html;
}

// ========================= fonction qui permet d'afficher contenu des recettes =========

function recipesDislay(recipe) {
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
/*

var chaine = "1 2 6 8 2 1 6 9 8 2 4 2 3 6 2";
alert(
  "le nombre 2 est présent " +
    (chaine.split("2").length - 1 + " fois dans la chaine")
);
*/
