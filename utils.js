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