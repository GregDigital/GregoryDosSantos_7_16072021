const container = document.querySelector("#container");

let recipesJson; //
// Ingrédients
let INGREDIENTS = [];
let matchedIngredients = [];
let activeIngredients = [];

// Appliances

let APPLIANCE = [];
let matchedAppliances = [];
let activeAppliances = [];

// Ustensils
let USTENSILS = [];
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

      /*
      TODO : 
      Afficher les ingredients et ajouter un events au click

      */
    })
    .then(() => {
      sortRecipesGlobalSearch(recipesJson);
      sortUstensils(USTENSILS);
      sortAppliances(APPLIANCE);
      sortIngredients(INGREDIENTS);
    });
}

function updateRecipes(recipes) {
  let rlt = sortRecipesGlobalSearch(recipes);
  rlt = sortRecipesByUstensils(rlt);
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

let btnIngredient = document.querySelector(".btn-ingredient");
let inputIngredient = document.querySelector(".search-ingredient");
let sousMenu = document.querySelector(".sous-menu");
let chevronDownI = document.querySelector(".noneIngredients");
let chevronUpI = document.querySelector(".addIngredients");

btnIngredient.addEventListener("click", () => {
  inputIngredient.style.width = "100%";
  sousMenu.style.display = "block";
  chevronDownI.style.display = "none";
  chevronUpI.style.display = "block";
  document.querySelector(".search-ingredient").placeholder =
    "Rechercher un ingrédient";
});

// =========================== Map Ingredients =============================
function getIngredients() {
  let ingredientsMap = recipesJson.map((elt) => elt.ingredients);
  let array = [];
  for (let i = 0; i < ingredientsMap.length; i++) {
    let ingredients = ingredientsMap[i];
    for (let ingredient of ingredients) {
      let selectIngredient = ingredient.ingredient;
      array.push(selectIngredient);
    }
  }
  let arrayIngredients = Array.from(new Set(array));
  INGREDIENTS.push(arrayIngredients);
  displayIngredients(arrayIngredients);
  return arrayIngredients;
}

//============================ Affichage Ingredients ====================================

function displayIngredients(ingredients) {
  let containerHtml = [];
  let containerUl = document.querySelector(".ingredients");
  for (let ingredient of ingredients) {
    containerHtml.push(templateIngredient(ingredient));
  }

  let html = containerHtml.reduce((a, l) => a + l, " ");
  containerUl.innerHTML = html;
  showTagIngredient(ingredients); // a changer
}

// ================================ Template ingredient ===================================

function templateIngredient(ingredient) {
  return `
<li class="valueIngredient"><a href="#">${ingredient}</a></li>
`;
}

// ========= Fonction trier les ingredients =======================================

function sortIngredients(ingredients) {
  const inputSearchIngredients = document.querySelector("#search-ingredient");

  inputSearchIngredients.addEventListener("input", (e) => {
    let valueInputIngredients = e.target.value;

    if (valueInputIngredients.length >= 3) {
      let inputsIngredients = valueInputIngredients.split(" ");
      if (valueInputIngredients) {
        ingredients.forEach((ingredient, index) => {
          //

          let matched = inputsIngredients.every((input) =>
            searchMatchIngredients(ingredient, input)
          );

          if (matched == true) {
            ingredients.splice(index, 1);
            matchedIngredients.push(ingredient);
            sousMenu.style.display = "block";
          }
        });

        // showTag();
        // removeTag();
        console.log(matchedIngredients);
        displayIngredients(matchedIngredients);
        return matchedIngredients;
      }
    } else if (valueInputIngredients == 0) {
      matchedIngredients.forEach((removeIngredient) => {
        ingredients.push(removeIngredient);
      });
      matchedIngredients = [];
      sousMenu.style.display = "none";
      displayIngredients(ingredients);
    }
  });
}
function searchMatchIngredients(ingredient, valueInputIngredients) {
  let test = ingredient;

  let regex = new RegExp(valueInputIngredients, "i");

  if (regex.test(test)) return true;

  return false;
}

// ==================== Affichage tag Ingredient =============================

function showTagIngredient(ingredients) {
  let tagsIngredients = document.querySelectorAll(".valueIngredient");

  tagsIngredients.forEach((tagIngredient) => {
    tagIngredient.addEventListener("click", (e) => {
      let ingredientsTextContent = tagIngredient.textContent;

      ingredients.forEach((ingredient, index) => {
        if (ingredientsTextContent == ingredient) {
          ingredients.splice(index, 1);
          tagIngredient.style.display = "none";
          activeIngredients.push(ingredient);
        }
      });
      console.log(ingredients);
      console.log(activeIngredients);
      tagShowButtonIngredient(e);
      removeTagIngredient(ingredients);
      return ingredients;
    });
  });
}

// ==================== Supprimer tag Ingredient =====================

function removeTagIngredient(ingredient) {
  let btnIngredient = document.querySelectorAll(".btn-ingredient-matched");

  btnIngredient.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let btnTextContent = btn.textContent;
      activeIngredients.forEach((removeIngredient, index) => {
        if (btnTextContent == removeIngredient) {
          activeIngredients.splice(index, 1);
          ingredient.push(removeIngredient);

          btn.style.display = "none";
          displayIngredients(ingredient);
          return ingredient;
        }
      });
    });
  });
}

//=====================  tag Ingredient ===============================

function tagShowButtonIngredient(e) {
  console.log(e.target);
  let valueText = e.target.innerText;
  let divMatchedButton = document.querySelector(".add-matchedButton");
  let btn = document.createElement("button");
  btn.classList.add("btn-ingredient-matched");

  let addText = document.createTextNode(valueText); // Créer un noeud textuel
  btn.appendChild(addText); // Ajouter le texte au bouton
  let test = document.createElement("i");
  test.classList.add("far", "fa-times-circle");
  btn.insertAdjacentElement("beforeend", test);
  divMatchedButton.appendChild(btn);
}

// ===========================  Button Appareil  ======================

let btnAppareil = document.querySelector(".btn-appareil");
let inputAppareil = document.querySelector(".search-appareil");
let sousMenuAppareil = document.querySelector(".sous-menu-appareil");
let chevronDownA = document.querySelector(".noneAppareils");
let chevronUpA = document.querySelector(".addAppareils");

btnAppareil.addEventListener("click", () => {
  inputAppareil.style.width = "130%";
  sousMenuAppareil.style.display = "block";
  // document.getElementById("i").classList.add("fa-chevron-up");
  //document.getElementById("i").classList.remove("fa-chevron-down");
  chevronDownA.style.display = "none";
  chevronUpA.style.display = "block";
  document.getElementById("search-appareil").placeholder =
    "Rechercher un appareil";
});

// ============================ Map Appliances =============================

function getAppliance() {
  let appliances = recipesJson.map((recipe) => recipe.appliance).flat();
  let arrayAppliances = Array.from(new Set(appliances));
  APPLIANCE.push(arrayAppliances);
  displayAppliances(arrayAppliances);
  return arrayAppliances;
}

//============================ Affichage appliances ====================================

function displayAppliances(appliances) {
  let containerHtml = [];
  let containerUl = document.querySelector(".appareil");
  for (let appliance of appliances) {
    containerHtml.push(templateAppliance(appliance));
  }

  let html = containerHtml.reduce((a, l) => a + l, " ");
  containerUl.innerHTML = html;
  showTagAppliance(appliances);
}

// ================================ Template appliance ===================================

function templateAppliance(appliance) {
  return `
<li class="valueAppliance"><a href="#">${appliance}</a></li>
`;
}

// ========= Fonction trier les appareils =======================================

function sortAppliances(appliances) {
  const inputSearchAppliances = document.querySelector("#search-appareil");

  inputSearchAppliances.addEventListener("input", (e) => {
    let valueInputAppliances = e.target.value;

    if (valueInputAppliances.length >= 3) {
      let inputsAppliances = valueInputAppliances.split(" ");
      if (valueInputAppliances) {
        appliances.forEach((appliance, index) => {
          //

          let matched = inputsAppliances.every((input) =>
            searchMatchAppliances(appliance, input)
          );

          if (matched == true) {
            appliances.splice(index, 1);
            matchedAppliances.push(appliance);
            sousMenuAppareil.style.display = "block";
          }
        });

        console.log(matchedAppliances);
        displayAppliances(matchedAppliances);
        return matchedAppliances;
      }
    } else if (valueInputAppliances == 0) {
      matchedAppliances.forEach((removeAppliance) => {
        appliances.push(removeAppliance);
      });
      matchedAppliances = [];
      sousMenuAppareil.style.display = "none";
      displayAppliances(appliances);
    }
  });
}
function searchMatchAppliances(appliance, valueInputAppliances) {
  let test = appliance;

  let regex = new RegExp(valueInputAppliances, "i");

  if (regex.test(test)) return true;

  return false;
}

// ==================== Affichage tag appareil =============================

function showTagAppliance(appliances) {
  let tagsIngredients = document.querySelectorAll(".valueAppliance");

  tagsIngredients.forEach((tagIngredient) => {
    tagIngredient.addEventListener("click", (e) => {
      let applianceTextContent = tagIngredient.textContent;

      appliances.forEach((appliance, index) => {
        if (applianceTextContent == appliance) {
          appliances.splice(index, 1);
          tagIngredient.style.display = "none";
          activeAppliances.push(appliance);
        }
      });
      console.log(appliances);
      console.log(activeAppliances);
      tagShowButtonAppliance(e);
      removeTagAppliance(appliances);
      return appliances;
    });
  });
}

// ==================== Supprimer tag appareil =====================

function removeTagAppliance(appliance) {
  let btnAppliance = document.querySelectorAll(".btn-appliance-matched");

  btnAppliance.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let btnTextContent = btn.textContent;
      activeAppliances.forEach((removeAppliance, index) => {
        if (btnTextContent == removeAppliance) {
          activeAppliances.splice(index, 1);
          appliance.push(removeAppliance);

          btn.style.display = "none";
          displayAppliances(appliance);
          return appliance;
        }
      });
    });
  });
}

//=====================  tag appareil ===============================

function tagShowButtonAppliance(e) {
  console.log(e.target);
  let valueText = e.target.innerText;
  let divMatchedButton = document.querySelector(".add-matchedButton");
  let btn = document.createElement("button");
  btn.classList.add("btn-appliance-matched");

  let addText = document.createTextNode(valueText); // Créer un noeud textuel
  btn.appendChild(addText); // Ajouter le texte au bouton
  let test = document.createElement("i");
  test.classList.add("far", "fa-times-circle");
  btn.insertAdjacentElement("beforeend", test);
  divMatchedButton.appendChild(btn);
}

// ===========================  Button ustensiles ================================================

let btnUstensile = document.querySelector(".btn-ustensiles");
let inputUstensile = document.querySelector(".search-ustensiles");
let sousMenuUstensile = document.querySelector(".sous-menu-ustensiles");
let chevronDown = document.querySelector(".noneUstensiles");
let chevronUp = document.querySelector(".addUstensiles");

btnUstensile.addEventListener("click", () => {
  inputUstensile.style.width = "130%";
  sousMenuUstensile.style.display = "block";
  // document.getElementById("i").classList.add("fa-chevron-up");
  //document.getElementById("i").classList.remove("fa-chevron-down");
  chevronDown.style.display = "none";
  chevronUp.style.display = "block";
  document.getElementById("search-ustensiles").placeholder =
    "Rechercher un Ustensiles";
});

function gestionnaireDeClic(e) {
  if (e.target.classList.contains("closeUstensils")) {
    inputUstensile.style.width = "44%";
    sousMenuUstensile.style.display = "none";
    chevronDown.style.display = "block";
    chevronUp.style.display = "none";
    document.getElementById("search-ustensiles").placeholder = "Ustensiles";
  }

  if (e.target.classList.contains("closeAppareils")) {
    inputAppareil.style.width = "44%";
    sousMenuAppareil.style.display = "none";
    chevronDownA.style.display = "block";
    chevronUpA.style.display = "none";
    document.getElementById("search-appareil").placeholder = "Appareil";
  }

  if (e.target.classList.contains("closeIngredients")) {
    inputIngredient.style.width = "44%";
    sousMenu.style.display = "none";
    chevronDownI.style.display = "block";
    chevronUpI.style.display = "none";
    document.getElementById("search-ingredient").placeholder = "Ingredient";
  }
}
document
  .querySelector("body")
  .addEventListener("click", gestionnaireDeClic, false);

// ============================ Map Ustensils =============================

function getUstensils() {
  // let ustensilsJson = recipesJson.map((recipe) => recipe.ustensils); // recette avec les ustensiles
  let ustensils = recipesJson.map((recipe) => recipe.ustensils).flat();
  let arrayUstensils = Array.from(new Set(ustensils)); // tri des ustensiles et des doublons
  USTENSILS.push(arrayUstensils); // USTENSILS = variable globale accessible

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
  showTag(ustensils);
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
        console.log(matchedUstensils);
        displayUstensils(matchedUstensils);
        return matchedUstensils;
      }
    } else if (valueInputUstensils == 0) {
      matchedUstensils.forEach((removeUstensil) => {
        ustensils.push(removeUstensil);
      });
      matchedUstensils = [];
      sousMenuUstensile.style.display = "none";
      displayUstensils(ustensils);
    }
  });
}
function searchMatchUstensils(ustensil, valueInputUstensils) {
  let test = ustensil;

  let regex = new RegExp(valueInputUstensils, "i");

  if (regex.test(test)) return true;

  return false;
}

function showTag(ustensils) {
  let tagsUstensils = document.querySelectorAll(".value");

  tagsUstensils.forEach((tagUstensil) => {
    tagUstensil.addEventListener("click", (e) => {
      let ustensilTextContent = tagUstensil.textContent;

      ustensils.forEach((ustensil, index) => {
        if (ustensilTextContent == ustensil) {
          ustensils.splice(index, 1);
          tagUstensil.style.display = "none";
          activeUstensils.push(ustensil);
        }
      });
      console.log(ustensils);
      console.log(activeUstensils);
      tagShowButton(e);
      removeTag(ustensils);
      return ustensils;
    });
  });
}

function removeTag(ustensil) {
  let btnUstensil = document.querySelectorAll(".btn-ustensils-matched");

  btnUstensil.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let btnTextContent = btn.textContent;
      activeUstensils.forEach((removeUstensil, index) => {
        if (btnTextContent == removeUstensil) {
          activeUstensils.splice(index, 1);
          ustensil.push(removeUstensil);
          console.log(ustensil);
          btn.style.display = "none";
          displayUstensils(ustensil);
          return ustensil;
        }
      });
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
