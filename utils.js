export function categoryLabel(category){
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

// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier
export function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}