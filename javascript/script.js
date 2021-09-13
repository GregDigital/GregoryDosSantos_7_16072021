const container = document.querySelector("#container");

let recipesJson; //

let INGREDIENTS = [];
let USTENSILS = [];

let APPLIANCE = [];

let activeIngredients = [];
let matchedUstensils = []; // recherche dans la barre de recherche ustensiles si true
let activeUstensils = []; // tableau vide ou les ustensiles selectionnés par l'utilisateur se mettront

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
      displayActiveUstensils(USTENSILS);
      /*
      TODO : 
      Afficher les ingredients et ajouter un events au click

      */
    })
    .then(() => {
      sortRecipesGlobalSearch(recipesJson);
      sortUstensils(USTENSILS);
      showTag(USTENSILS);
    });
}
//console.log(USTENSILS);
/*
function updateRecipes(recipes) {
  let rlt = sortRecipesGlobalSearch(recipes);
  rlt = sortUstensils(rlt);
  rlt = sortRecipesByIngredients(rlt);
  rlt = sortRecipesByAppliances(rlt);
  displayRecipes(rlt);
}

function sortRecipesByIngredients(recipes) {
  if (activeIngredients == []) return recipes;

  let rlt = recipes.filter((recipe) => {
    // ma recette contient tous les ingrédients sélectionnés par l'utilisateur
    // return true si c'est vrai sinon return false
    ustensilActive.every((ustensil) => {
      recipe.ustensils.include(ustensil);
    });
  });
  return rlt;
}
*/
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

function sortRecipesGlobalSearch(recipes) {
  const inputSearch = document.querySelector('input[type="search"]');
  let notFound = document.querySelector("#recipes-no-found");
  inputSearch.addEventListener("input", (e) => {
    let valueInput = e.target.value; // mettre en minuscule

    if (valueInput.length >= 3) {
      let inputs = valueInput.split(" ");

      let matched_recipes = [];
      if (valueInput) {
        recipes.forEach((recipe) => {
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
      displayRecipes(recipes);
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
  // document.getElementById("i").classList.add("fa-chevron-up");
  // document.getElementById("i").classList.remove("fa-chevron-down");
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
  //document.getElementById("i").classList.add("fa-chevron-up");
  // document.getElementById("i").classList.remove("fa-chevron-down");
  document.getElementById("search-appareil").placeholder =
    "Rechercher un appareil";
});

function getAppliance() {
  let appliances = recipesJson.map((elt) => elt.appliance).flat();

  let arrayAppliances = Array.from(new Set(appliances));
}

// ===========================  Button ustensiles ================================================

let btnUstensile = document.querySelector(".btn-ustensiles");
let inputUstensile = document.querySelector(".search-ustensiles");
let sousMenuUstensile = document.querySelector(".sous-menu-ustensiles");
let chevronDown = document.querySelector(".none");
let chevronUp = document.querySelector(".add");
let closeBtn = document.querySelector(".add");

btnUstensile.addEventListener("click", () => {
  inputUstensile.style.width = "130%";
  sousMenuUstensile.style.display = "block";
  chevronDown.style.display = "none";
  chevronUp.style.display = "block";
  document.getElementById("search-ustensiles").placeholder =
    "Rechercher un Ustensiles";
});

let inputUstensil = document.querySelector(".search-ustensiles");
let sousMenuUstensil = document.querySelector(".sous-menu-ustensiles");
let chevronDow = document.querySelector(".none");
let chevronU = document.querySelector(".add");
let hello = document.querySelector(".noneSS");

closeBtn.addEventListener("click", () => {
  hello.style.display = "none";
});

// ============================ Map Ustensils =============================

function getUstensils() {
  // let ustensilsJson = recipesJson.map((recipe) => recipe.ustensils); // recette avec les ustensiles
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

  let html = containerHtml.reduce((a, l) => a + l, " ");
  containerUl.innerHTML = html;
}

// ================================ Template ustensiles ===================================

function templateUstensils(ustensil) {
  return `
<li class="value"><a href="#">${ustensil}</a></li>
`;
}

// ========= Fonction trier les ustensiles =======================================

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
            ustensils.splice(index, 1);
            matchedUstensils.push(ustensil);
            sousMenuUstensile.style.display = "block";
          }
        });

        // showTag();
        // removeTag();
        displayUstensils(matchedUstensils);
        //return matchedUstensils;
      }
    } else if (valueInputUstensils == 0) {
      matchedUstensils.forEach((removeUstensil) => {
        ustensils.push(removeUstensil);
      });
      matchedUstensils = [];
      sousMenuUstensile.style.display = "none";
      displayUstensils(ustensils);
      console.log(ustensils);
      console.log(activeUstensils);
    }
  });
}
function searchMatchUstensils(ustensil, valueInputUstensils) {
  let test = ustensil;

  let regex = new RegExp(valueInputUstensils, "i");

  if (regex.test(test)) return true;

  return false;
}

function showTag(value) {
  console.log(value);
  let valueTags = document.querySelectorAll(".value");

  valueTags.forEach((valuetag, index) => {
    valuetag.addEventListener("click", (e) => {
      let ustensilName = valuetag.textContent;
      console.log(ustensilName);
      console.log(value);
      for (let i = 0; i < value.length; i++) {
        let elt = value[i];
        if (ustensilName == elt) {
          valuetag.style.display = "none";
          value.pop(elt);
          value.slice(index, 1);
          activeUstensils.push(elt);
          console.log(value);
          console.log(activeUstensils);

          removeTag(elt);
        }
      }
      tagShowButton(e);
      displayActiveUstensils(value);
      return value;
    });
  });
}

function removeTag() {
  let btnUstensil = document.querySelectorAll(".btn-ustensils-matched");

  btnUstensil.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let btnValue = btn.textContent;
      console.log(btnValue);
      index = 0;
      for (let i = 0; i < activeUstensils.length; i++) {
        let z = activeUstensils[i];
        if (value == z) {
          console.log("true");
          USTENSILS.push(z);
          activeUstensils.pop(z);
          btn.style.display = "none";
          console.log(USTENSILS);
          console.log(activeUstensils);
        }
        break;
      }
    });
  });
}

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

// ======================== On affiche les ustensiles qui match avec la saisie utilisateur ======

fetchRecipes();

/*




let valueTag = document.querySelectorAll(".value");
valueTag.forEach((value) => {
  value.addEventListener("click", (e) => {
    tagActive.push(value.textContent);
    value.remove();
    tagShowButton(e);
    //up recipe
    console.log(tagActive);
  });
});

function remove() {
  let tags = document.querySelectorAll(".btn-ustensils-matched");

  tags.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      let tagValue = tag.textContent;

      activeUstensils.forEach((valueArrayUstensils, index) => {
        if (tagValue == valueArrayUstensils || tagValue == tag) {
          //ustensils.push(tagValue);

          activeUstensils.pop(valueArrayUstensils);
          tag.style.display = "none";
          console.log(activeUstensils);
          console.log(true);
        } else {
          console.log(false);
        }
      });
    });
  });
}
*/
