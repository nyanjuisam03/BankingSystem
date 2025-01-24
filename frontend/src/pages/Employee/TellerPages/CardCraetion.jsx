import React, { useState } from 'react';
import useCardStore from '../../../store/cardStore';

function CardCraetion() {
  const { createCard, loading } = useCardStore(); // Destructure from Zustand store

  const [userId, setUserId] = useState('');
  const [cardType, setCardType] = useState('debit');
  const [initialDeposit, setInitialDeposit] = useState('');

  const handleSubmit = async () => {
    await createCard({
      userId: parseInt(userId, 10),
      cardType,
      initialDeposit: parseFloat(initialDeposit),
    });
    setUserId('');
    setCardType('debit');
    setInitialDeposit('');
  };

  return (
    <form>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="cardType">Card Type:</label>
        <select
          id="cardType"
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          required
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </div>
      <div>
        <label htmlFor="initialDeposit">Initial Deposit:</label>
        <input
          id="initialDeposit"
          type="number"
          step="0.01"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(e.target.value)}
          required
        />
      </div>
      <button type="button" onClick={handleSubmit}>
        {loading ? 'Creating...' : 'Create Card'}
      </button>
    </form>
  );
}

export default CardCraetion;
