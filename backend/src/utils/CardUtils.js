/**
 * Generates a unique 16-digit card number.
 * @returns {string} - A 16-digit card number.
 */
function generateCardNumber() {
  let cardNumber = '';
  for (let i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  return cardNumber;
}

/**
 * Generates a 3-digit CVV code.
 * @returns {string} - A 3-digit CVV code.
 */
function generateCVV() {
  let cvv = '';
  for (let i = 0; i < 3; i++) {
    cvv += Math.floor(Math.random() * 10);
  }
  return cvv;
}

/**
 * Generates a 3-year expiry date in 'YYYY-MM-DD' format.
 * @returns {string} - A formatted expiry date.
 */
function generateExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  // Ensure it's formatted as YYYY-MM-DD
  return expiryDate.toISOString().split('T')[0]; // Formats date to 'YYYY-MM-DD'
}

module.exports = {
  generateCardNumber,
  generateCVV,
  generateExpiryDate,
};