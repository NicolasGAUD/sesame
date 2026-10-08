import {menu} from './menu.js';
import {order} from './order.js';
import {categoryLabel, formatPrice} from './utils.js';

//Afin de pouvoir débugguer order.lines dans la console.
window.order = order;

// 📦 1. TOUT LE DOM REGROUPÉ EN HAUT DU FICHIER
// const documentElements = {
//   promoInput: document.querySelector("#promo-code")
// };

const translatedMenu = menu.map(item => {
  return {
    ...item,
    category: categoryLabel(item.category)
  };
});

// "all" par défaut si aucun argument n'est fourni
function renderMenu(categoryValue = "all"){
  const menuSection= document.querySelector("#menu")
  menuSection.textContent = "";
  for (let i = 0; i < translatedMenu.length; i++) {

    const product = translatedMenu[i];
    const expectedTranslatedCategory = categoryLabel(categoryValue);

    if(product.category === expectedTranslatedCategory || categoryValue.toLowerCase() === "all") {
      const card = document.createElement("article");
      translatedMenu[i].available ? card.classList.add("product") : card.classList.add("product", "is-sold-out");

      const category = document.createElement("span");
      category.classList.add("product-category");
      category.textContent = translatedMenu[i].category
      card.appendChild(category);

      const productName = document.createElement("h3");
      productName.classList.add("product-name");
      productName.textContent = translatedMenu[i].name;
      card.appendChild(productName);

      const productPrice = document.createElement("p");
      productPrice.classList.add("product-name");
      productPrice.textContent = formatPrice(translatedMenu[i].price);
      card.appendChild(productPrice);

      const btnAdd = document.createElement("button");
      btnAdd.classList.add("product-add");
      translatedMenu[i].available ? btnAdd.disabled = false : btnAdd.disabled = true;

      btnAdd.addEventListener("click", () => {
        order.add({id: translatedMenu[i].id, name: translatedMenu[i].name, price: translatedMenu[i].price});
        renderTicket();
      });
      btnAdd.textContent = "Ajouter";

      card.appendChild(btnAdd);
      menuSection.appendChild(card);
    }
  }
}

renderMenu();
// === renderMenu("all"); see arg default

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
    // was missing just this line for me to search a long time
    promoMessage.textContent = "";
    return;                                // On arrête la fonction ici
  }

  for (let i = 0; i < order.lines.length; i++) {
    const line = order.lines[i];
    const listElt = document.createElement("li");

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
      order.getReduction();
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
// En HTML, l'événement submit ne se déclenche que sur une balise <form>
// 1. On sélectionne le formulaire global et l'input
const customerForm = document.querySelector("#customer-form");
const customerInput = document.querySelector("#customer-name");
const customerError = document.querySelector("#customer-error");
const ticketTitle = document.querySelector("#ticket-title");

// 2. On écoute le 'submit' sur le FORMULAIRE
customerForm.addEventListener("submit", (e) => {
  // 3. 💡 CRITIQUE : Empêche la page de se recharger et de tout perdre
  e.preventDefault();

  // 4. On récupère la valeur de l'input AU MOMENT du clic de validation
  const customerName = customerInput.value.trim();
  if (customerName === "") {
    customerError.textContent = "Erreur de saisie ! ";
    ticketTitle.textContent = "Ticket"
  }
  else {
    ticketTitle.textContent = `Ticket de ${customerName}`;
  }
});

function checkPromoCode(code){


  // Cas 1 : Le champ est vide
  if (code === "") {
    promoMessage.textContent = "Erreur de saisie !";
    return; // On s'arrête ici
  }

  // Cas 2 : On compare tout en minuscules 💡
  if (code.toLowerCase() !== "barista") {
    promoMessage.textContent = "Code inconnu !";
    return; // On s'arrête ici
  }
  // Cas 3 : Le code est valide !
  promoMessage.textContent = "Code promo appliqué !";
}
// Étape 8 · Le code promo

// 1. Sélection des éléments (vérifiez bien les ID dans votre HTML !)
const promoForm = document.querySelector("#promo-form"); // Corrigé : promo-form
const promoMessage = document.querySelector("#promo-message"); // Corrigé : promo-message
const ticketTotal = document.querySelector("#ticket-total");

// 2. Écoute du 'submit' sur le formulaire
promoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  checkPromoCode(promoInput.value.trim());

  order.getReduction();

  ticketTotal.textContent = formatPrice(Number(order.getSubtotal()) - Number(reductionCentimes));
});


// const promoForm = document.querySelector("#promo-form");
// const promoInput = document.querySelector("#promo-code");
// const promoMessage = document.querySelector("#promo-message");
// const discountLabel = document.querySelector("#ticket-discount");
//
// // 2. On écoute le 'submit' sur le FORMULAIRE
// promoForm.addEventListener("submit", (e) => {
//   // 3. 💡 CRITIQUE : Empêche la page de se recharger et de tout perdre
//   e.preventDefault();
//
//   // 4. On récupère la valeur de l'input AU MOMENT du clic de validation
//   const inputValue = promoInput.value.trim();
//   if (inputValue === "") {
//     promoMessage.textContent = "Erreur de saisie ! ";
//   }
//   else if (inputValue.toLowerCase() !== "BARISTA") {
//     promoMessage.textContent = "Code inconnu ! ";
//   }
//   else {
//     discountLabel.textContent = order.getSubtotal();
//   }
// });

// Bonus
