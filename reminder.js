// A placer en haut du fichier afin que la méthode addEventListener qui écoute add(product) sur le boutton

// ce que j'ai écris

const order = {
    lines: [],

    add(product) {
        // 1. La boucle compare chaque identifiant
        for (const line of this.lines) {
            if (line.id === product.id) {
                line.quantity++; // Si elle trouve, elle augmente la quantité
                return;          // et s'arrête immédiatement avec return
            }
        }

        // 2. Si la boucle se termine sans rien trouver, c'est qu'il faut ajouter une ligne
        this.lines.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1 // Initialisation de la quantité à 1
        });
    },
    getSubtotal(){
        if (this.lines.length > 0){
            let subTotal = 0;
            for (const line of this.lines) {
                subTotal += line.price * line.quantity;
            }
            return subTotal;
        }
    },
    remove(id){
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].id === id) {
                if (this.lines[i].quantity > 1) {}
                this.lines.quantity--;
            }
            else{
                this.lines.splice(i, 1);
            }
        }
    }
};

// IA generated / helped

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