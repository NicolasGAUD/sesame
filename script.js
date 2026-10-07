import { menu } from './menu.js';

// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function categoryLabel(category){
  // On passe en minuscules une seule fois pour alléger le code
  const lowerCategory = category.toLowerCase();
    if (lowerCategory === "coffee") {
      return "Café";
    }
    if (lowerCategory === "tea") {
      return "Thé & autres";
    }
    if (lowerCategory === "pastry") {
      return "Patisserie";
    }
    return category;
}
const menuTraduit = menu.map(item => {
  return {
    ...item,
    category: categoryLabel(item.category) // Utilisation de votre fonction
  };
});

// Étape 1 · Afficher la carte
const menuSection = document.querySelector("#menu");

function renderMenu(){
  menuSection.textContent = "";
  for (let i = 0; i < menuTraduit.length; i++) {
    const card = document.createElement("article");
    card.classList.add("product");
    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = menuTraduit[i].category
    card.appendChild(category);
    const productName = document.createElement("h3");
    productName.classList.add("product-name");
    productName.textContent = menuTraduit[i].name;
    card.appendChild(productName);
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-name");
    productPrice.textContent = formatPrice(menuTraduit[i].price);
    card.appendChild(productPrice);
    const btnAdd = document.createElement("button");
    btnAdd.classList.add("product-add");
    btnAdd.textContent = "Ajouter";
    card.appendChild(btnAdd);
    menuSection.appendChild(card);
  }
}

renderMenu();




// Étape 2 · Les produits épuisés


// Étape 3 · L'objet order


// Étape 4 · Afficher le ticket


// Étape 5 · Retirer une ligne


// Étape 6 · Filtrer par catégorie


// Étape 7 · Le prénom du client


// Étape 8 · Le code promo


// Bonus
