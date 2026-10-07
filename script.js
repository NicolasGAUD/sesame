import { menu } from './menu.js';

const order = {
  lines: [],

  add(product) {
    // 1. On cherche si le produit est déjà présent dans le panier
    const existingLine = this.lines.find(line => line.id === product.id);

    if (existingLine) {
      // 2. S'il existe, on augmente sa quantité
      existingLine.quantity++;
    } else {
      // 3. S'il n'existe pas, on l'ajoute en créant une nouvelle ligne propre
      this.lines.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1 // Initialisation à 1
      });
    }
  },
  getSubtotal() {
    // 0 est la valeur de départ de l'accumulateur
    return this.lines.reduce((total, line) => total + (line.price * line.quantity), 0);
  },
  // Étape 5 · Retirer une ligne
  remove(id) {
    for (let i = 0; i < this.lines.length; i++) {
      // 1. On cherche l'élément correspondant à l'ID
      if (this.lines[i].id === id) {

        // 2. Si la quantité est supérieure à 1, on décrémente uniquement
        if (this.lines[i].quantity > 1) {
          this.lines[i].quantity--; // Correction ici : lines[i]
        } else {
          // 3. Sinon (quantité égale à 1), on retire complètement la ligne
          this.lines.splice(i, 1);
        }

        // 4. On arrête immédiatement la fonction
        return;
      }
    }
  }
};




//Afin de pouvoir débugguer order.lines dans la console.
window.order = order;

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

// "all" par défaut si aucun argument n'est fourni
function renderMenu(categoryValue = "all"){
  menuSection.textContent = "";
  for (let i = 0; i < menuTraduit.length; i++) {
    const product = menuTraduit[i];
    // On trouve la traduction attendue pour la comparaison
    // const expectedTranslatedCategory = equivalences[categoryValue];
    const expectedTranslatedCategory = categoryLabel(categoryValue);
    if(product.category === expectedTranslatedCategory || categoryValue.toLowerCase() === "all") {
      const card = document.createElement("article");
      menuTraduit[i].available ? card.classList.add("product") : card.classList.add("product", "is-sold-out");
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
      menuTraduit[i].available ? btnAdd.disabled = false : btnAdd.disabled = true;
      // Au clic, on appelle la méthode de l'objet
      btnAdd.addEventListener("click", () => {
        order.add({id: menuTraduit[i].id, name: menuTraduit[i].name, price: menuTraduit[i].price});
        renderTicket();
      });
      btnAdd.textContent = "Ajouter";
      card.appendChild(btnAdd);
      menuSection.appendChild(card);
    }
  }
}

renderMenu("all");

// Étape 4 · Afficher le ticket

function renderTicket(){
  const ticketEmpty = document.querySelector("#ticket-empty");
  const ticketLines = document.querySelector("#ticket-lines");
  const ticketTotal = document.querySelector("#ticket-total");

  ticketEmpty.textContent = "";
  ticketLines.textContent = "";
  ticketTotal.textContent = "0,00 €";

  if (order.lines.length === 0) {     // On vide la liste des produits
    ticketEmpty.textContent = "Le ticket est vide."; // On écrit le texte
    return;                                // On arrête la fonction ici
  }

  for (let i = 0; i < order.lines.length; i++) {
    const line = order.lines[i];
    const listElt = document.createElement("li");
    const linePriceEuros = formatPrice(line.price * line.quantity);

    const lineName = document.createElement("span");
    lineName.classList.add("line-name");
    lineName.textContent = line.name;
    const lineQty = document.createElement("span");
    lineQty.classList.add("line-qty");
    lineQty.textContent = ` x ${line.quantity} `;
    const linePrice = document.createElement("span");
    linePrice.classList.add("line-price");
    linePrice.textContent = formatPrice(line.price * line.quantity);
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("line-remove");
    btnRemove.ariaLabel = `Retirer un ${line.name}`;
    btnRemove.textContent = " - ";
    btnRemove.addEventListener("click", () => {
      order.remove(line.id);
      renderTicket();
    });
    listElt.appendChild(lineName);
    listElt.appendChild(lineQty);
    listElt.appendChild(linePrice);
    listElt.appendChild(btnRemove);

    // Ajout à la liste HTML
    ticketLines.appendChild(listElt);

    // Calcul et affichage du total général de la commande
    const total = formatPrice(order.getSubtotal());
    ticketTotal.textContent = `${total}`;

  }
}


// Étape 6 · Filtrer par catégorie

function filterByCategory() {
  const categoriesNav = document.querySelector("#categories");
  if (!categoriesNav) return;

  categoriesNav.addEventListener("click", (e) => {
    // 1. Sécurité : on vérifie que l'élément cliqué est bien un <button>
    // Si l'utilisateur clique dans le vide entre deux boutons, on ne fait rien
    if (e.target.tagName !== "BUTTON") return;

    const btnClicked = e.target;
    const categoryValue = btnClicked.value; // Récupère "all", "coffee", "tea" ou "pastry"

    // 2. Gestion des classes : on retire "is-active" de TOUS les boutons de la nav
    const allButtons = categoriesNav.querySelectorAll("button");
    allButtons.forEach(btn => btn.classList.remove("is-active"));

    // 3. On ajoute la classe uniquement sur le bouton cliqué
    btnClicked.classList.add("is-active");

    // 4. On appelle votre fonction d'affichage en lui passant la catégorie à filtrer
    renderMenu(categoryValue);
  });
}
// ⚠️ N'oubliez pas d'appeler cette fonction une fois au démarrage de votre script !
filterByCategory();


// Étape 7 · Le prénom du client



// Étape 8 · Le code promo


// Bonus
