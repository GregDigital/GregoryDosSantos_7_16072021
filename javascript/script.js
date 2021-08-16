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

// ================= fonction qui permet de générer le contenu des recettes=============

// ===================== Input principal de recherche ===================
const inputSearch = document.querySelector('input[type="search"]');

function sortRecipes() {
  inputSearch.addEventListener("input", (e) => {
    let valueInput = e.target.value;
    const dataId = document.querySelectorAll("[data-id]");
    console.log(dataId);
    if (valueInput.length >= 3) {
      dataId.forEach((element) => {
        element.style.visibility = "hidden";
      });
      //
      let value = Object.keys(recipesJson);
      for (let i = 0; i < value.length; i++) {
        let description = recipesJson[value[i]].description;
        let verifOccurrences = description.includes(valueInput); // test occurences des mots dans la description des recettes et l'input
        let matched_recipes = []; // tableau vide pour recuperer les recettes ayant le mot correspondant
        let index = 0;
        let id = recipesJson[value[i]].id;
        if (verifOccurrences == true) {
          let arrayId = id++;
          console.log(arrayId);

          matched_recipes.push(arrayId);
          console.log(matched_recipes);
        }

        //displayRecipes(matched_recipes);
      }
    } else {
      dataId.forEach((element) => {
        element.style.visibility = "visible";
      });
    }
  });
}

function displayRecipes() {
  let containerRecipes = [];
  for (let recipe of recipesJson) {
    containerRecipes.push(templateRecipe(recipe));
  }
  let html = containerRecipes.reduce((a, l) => a + l);
  container.innerHTML = html;
}

/*function inputSearch() {
  // la variable devrait être accessible gloabalement, tu vas vouloir la réutiliser plusieurs fois
  // aussi attention au nommage, ici la variable a le mm nom que la fonction, c'est un peu confusant
  const inputSearch = document.querySelector('input[type="search"]');

  inputSearch.addEventListener("input", (e) => {
    const dataId = document.querySelectorAll("[data-id]"); // on parle bien des 4 champs de recherche ?

    let valueInput = e.target.value;

    if (valueInput.length >= 3) {
      // utilise la fonction forEach() pour itérer sur les recettes, ce sera plus court à écrire et l'intention plus explicite
      let value = Object.keys(recipesJson);

      for (let i = 0; i < value.length; i++) {
        let description = recipesJson[value[i]].description;
        let verifOccurrences = description.includes(valueInput); // test occurences des mots dans la description des recettes et l'input
        let matched_recipes = []; // tableau vide pour recuperer les recettes ayant le mot correspondant
        // attention l'index ne correspond pas à l'id d'une recette, il ne te permettra pas de retrouver une recette
        let index = 0; data-id
        if (verifOccurrences == true) {
          index++;
          // au lieu de push() l'index push directement la recette : matched_recipes.push(value[i])
          matched_recipes.push(index);
          console.log(matched_recipes);
        }
        // il reste à afficher les recettes : displayRecipes(matched_recipes)
      }
    }
  });
}*/

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
