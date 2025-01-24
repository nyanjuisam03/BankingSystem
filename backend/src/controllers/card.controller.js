const db = require('../config/database');
const { generateCardNumber, generateCVV, generateExpiryDate }=require('../utils/CardUtils')


exports.createCard = async (req, res) => {
  const { userId, cardType, initialDeposit } = req.body;

  try {
    // Validate inputs
    const validCardTypes = ['debit', 'credit'];
    if (!validCardTypes.includes(cardType)) {
      return res.status(400).json({ error: 'Invalid card type' });
    }
    
    const balance = parseFloat(initialDeposit);
    if (isNaN(balance)) {
      return res.status(400).json({ error: 'Invalid initial deposit' });
    }

    // Prepare query values
    const expiryDate = generateExpiryDate();
    console.log('Inserting card with:', {
      userId,
      cardNumber: generateCardNumber(),
      cvv: generateCVV(),
      expiryDate,
      cardType,
      initialDeposit: balance
    });

    // Execute query
    const [cardResult] = await db.execute(
      'INSERT INTO cards (user_id, card_number, cvv, expiry_date, card_type, status, balance, initial_deposit) VALUES (?, ?, ?, ?, ?, "ACTIVE", ?, ?)',
      [
        userId,
        generateCardNumber(),
        generateCVV(),
        expiryDate,
        cardType,
        balance,
        balance
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      cardId: cardResult.insertId
    });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.getUserCards = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = `
    SELECT * FROM cards
    WHERE user_id = ?
    ORDER BY card_number DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Error fetching cards',
        error: err
      });
    }

    res.status(200).json({
      message: 'Cards retrieved successfully',
      data: results
    });
  });
};

