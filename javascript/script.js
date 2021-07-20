const container = document.querySelector("#container");
console.log(container);

let t = [];

async function fetchRecipes() {
  await fetch("json/recipes.json")
    .then((res) => res.json())
    .then((data) => console.log(data)((t = recipes(data))));
}

function recipes(res) {
  let containerRecipes = [];
  for (let recipe of res.recipes) {
    containerRecipes.push(recipesDislay(recipe));
  }
  let html = containerRecipes.reduce((a, l) => a + l);
  container.innerHTML = html;
}

function recipesDislay(recipe) {
  return `
        
      <article class="recipes-container">
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
           
              <li>Lait de coco : <span>80 g</span></li>
              <li>Jus de citron : <span>2</span></li>
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

fetchRecipes();
