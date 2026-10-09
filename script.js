import {menu} from './menu.js';
import {order, orderElements} from './order.js';
import {categoryLabel, formatPrice} from './utils.js';

//Afin de pouvoir débugger order.lines dans la console.
window.order = order;

const customerElements = {
  customerForm: document.querySelector("#customer-form"),
  customerInput: document.querySelector("#customer-name"),
  customerError: document.querySelector("#customer-error")
};

const promoElements = {
  promoForm: document.querySelector("#promo-form"),
  promoMessage: document.querySelector("#promo-message"),
};

const ticketElements = {
  ticketTitle:  document.querySelector("#ticket-title"),
  ticketTotal: document.querySelector("#ticket-total"),
  ticketEmpty: document.querySelector("#ticket-empty"),
  ticketLines: document.querySelector("#ticket-lines"),
};


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

function renderTicket(){
  ticketElements.ticketEmpty.textContent = "";
  ticketElements.ticketLines.textContent = "";
  ticketElements.ticketTotal.textContent = "0,00 €";

  if (order.lines.length === 0) {
    ticketElements.ticketEmpty.textContent = "Le ticket est vide.";
    // was missing just this line for me to search a long time
    promoElements.promoMessage.textContent = "";
    return;
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

    ticketElements.ticketLines.appendChild(listElt);

    let total = 0;
    // Calcul et affichage du total général de la commande
    if (order.isPromoApplied){
      total = formatPrice(order.getSubtotal() - order.getReduction());
    }
    else{
      total = formatPrice(order.getSubtotal());
    }
    ticketElements.ticketTotal.textContent = `${total}`;
  }
}

function filterByCategory() {
  const categoriesNav = document.querySelector("#categories");
  if (!categoriesNav) return;

  categoriesNav.addEventListener("click", (e) => {
    // IA : Sécurité : on vérifie que l'élément cliqué est bien un <button>
    // Si l'utilisateur clique dans le vide entre deux boutons, on ne fait rien
    if (e.target.tagName !== "BUTTON") return;

    const btnClicked = e.target;
    const categoryValue = btnClicked.value; // Récupère "all", "coffee", "tea" ou "pastry"

    //Gestion des classes : on retire "is-active" de TOUS les boutons de la nav
    const allButtons = categoriesNav.querySelectorAll("button");
    allButtons.forEach(btn => btn.classList.remove("is-active"));

    // On ajoute la classe uniquement sur le bouton cliqué
    btnClicked.classList.add("is-active");

    // On appelle votre fonction d'affichage en lui passant la catégorie à filtrer
    renderMenu(categoryValue);
  });
}

// En HTML, l'événement submit ne se déclenche que sur une balise <form>
// On sélectionne le formulaire global et l'input
// On écoute le 'submit' sur le FORMULAIRE
customerElements.customerForm.addEventListener("submit", (e) => {
  // CRITIQUE : Empêche la page de se recharger et de tout perdre
  e.preventDefault();

  const customerName = customerElements.customerInput.value.trim();
  if (customerName === "") {
    customerElements.customerError.textContent = "Erreur de saisie ! ";
    ticketElements.ticketTitle.textContent = "Ticket"
  }
  else {
    ticketElements.ticketTitle.textContent = `Ticket de ${customerName}`;
  }
});

function checkPromoCode(code){

  if (code === "") {
    promoElements.promoMessage.textContent = "Erreur de saisie !";
    return false; // On s'arrête ici
  }
  if (code.toLowerCase() !== "barista") {
    promoElements.promoMessage.textContent = "Code inconnu !";
    return false;
  }

  promoElements.promoMessage.textContent = "Code promo appliqué !";
  order.isPromoApplied = true;
  return true;
}

promoElements.promoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let reductionCentimes = 0;

  if (checkPromoCode(orderElements.promoInput.value.trim())){
    reductionCentimes = order.getReduction();
  }

  ticketElements.ticketTotal.textContent = formatPrice(Number(order.getSubtotal()) - Number(reductionCentimes));
});



renderMenu();
// === renderMenu("all"); see arg default
filterByCategory();