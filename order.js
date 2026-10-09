import {formatPrice} from './utils.js';

export const orderElements = {
    promoInput: document.querySelector("#promo-code"),
    discountLabel: document.querySelector("#ticket-discount")
};

export const order = {
    lines: [],
    isPromoApplied: false,

    add(product) {
        // On cherche si le produit est déjà présent dans le panier
        const existingLine = this.lines.find(line => line.id === product.id);

        if (existingLine) {
            // S'il existe, on augmente sa quantité
            existingLine.quantity++;
        } else {
            // S'il n'existe pas, on l'ajoute en créant une nouvelle ligne propre
            this.lines.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
    },
    getSubtotal() {
        // 0 est la valeur de départ de l'accumulateur
        return this.lines.reduce((total, line) => total + (line.price * line.quantity), 0);
    },
    remove(id) {
        const line = this.lines.find(item => item.id === id);
        if (!line) return;

        if (line.quantity > 1) {
            line.quantity--;
        } else {
            // On reconstruit le tableau sans l'élément qui a une quantité de 1
            this.lines = this.lines.filter(item => item.id !== id);
        }

        // On vérifie SI le panier est vide APRÈS la suppression
        if (this.lines.length === 0) {
            if (orderElements.promoInput) {
                orderElements.promoInput.value = ''; // Vide l'input HTML
            }
            this.isPromoApplied = false; // Désactive la promo
        }
    },
    getReduction(){
        if (this.lines.length > 0 && this.isPromoApplied) {
            const reductionCentimes = Math.round(this.getSubtotal() * 0.10);
            const reductionEuros = formatPrice(reductionCentimes)
            orderElements.discountLabel.textContent = `-${reductionEuros}`;
        }
        else{
            document.querySelector("#ticket-discount").textContent = formatPrice(0);
        }
    }

};