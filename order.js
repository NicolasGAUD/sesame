import {formatPrice} from './utils.js';

const orderElements = {
    promoInput: document.querySelector("#promo-code")
};

export const order = {
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
    remove(id) {
        // 1. On cherche et on met à jour l'élément dans le panier
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].id === id) {
                if (this.lines[i].quantity > 1) {
                    this.lines[i].quantity--;
                } else {
                    this.lines.splice(i, 1);
                }
                // return; // break sort de la boucle, return de la fcontion
                // si return, le code 2. ne serait pas executé.
                break; // On sort de la boucle dès qu'on a trouvé et traité l'élément
            }
        }

        // 2. CORRECTION : On vérifie SI le panier est vide APRÈS la suppression
        if (this.lines.length === 0 && typeof promoInput !== 'undefined') {
            orderElements.promoInput.value = '';
        }
    },
    getReduction(){
        if (this.lines.length > 0) {
            const discountLabel = document.querySelector("#ticket-discount");
            const reductionCentimes = Math.round(this.getSubtotal() * 0.10);
            const reductionEuros = formatPrice(reductionCentimes)
            discountLabel.textContent = `-${reductionEuros}`;
        }
        else{
            document.querySelector("#ticket-discount").textContent = formatPrice(0);
        }
    }
};