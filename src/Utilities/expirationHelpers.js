// Checks if an item's expiration date has already passed
export function isExpired(expirationDate) {
  const today = new Date();
  const expDate = new Date(expirationDate);
  return expDate < today;
}

// Checks if an item's expiration date is within 14 days (includes expired)
export function isNearExpiration(expirationDate) {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}
