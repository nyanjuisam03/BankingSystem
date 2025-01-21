import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import accountStore from '../../store/accountStore';
import useTransactionStore from '../../store/useTransactionStore';
import { useNavigate } from 'react-router-dom'

function AccountDetails() {
    const { accountId } = useParams(); 
    const { fetchAccountDetail, account, isLoading, error } = accountStore();
    const { 
        createTransaction, 
        isLoading: transactionLoading, 
        error: transactionError,
    } = useTransactionStore();

    const [showModal, setShowModal] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const navigate=useNavigate()
    useEffect(() => {
        fetchAccountDetail(accountId);
    }, [accountId, fetchAccountDetail]);

    // Reset form helper
    const resetForm = () => {
        setAmount('');
        setDescription('');
        setShowModal(false);
        setTransactionType('');
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        
        try {
            // Validate amount
            if (!amount || parseFloat(amount) <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            // Validate description
            if (!description.trim()) {
                alert('Please enter a description');
                return;
            }

            const result = await createTransaction({
                account_id: accountId,
                type: transactionType,
                amount: parseFloat(amount),
                description: description.trim(),
            });

            // Only proceed if transaction was successful
            if (result) {
                // Reset form and close modal
                resetForm();
                
                // Refresh account details
                await fetchAccountDetail(accountId);
                
                // Show success message
                alert(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to complete transaction.';
            alert(errorMessage);
        }
    };

    const handleDepositClick = () => {
        resetForm(); // Reset form before opening
        setTransactionType('deposit');
        setShowModal(true);
    };

    const handleWithdrawClick = () => {
        resetForm(); // Reset form before opening
        setTransactionType('withdrawal');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        resetForm();
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;



  return (
    <div>
    <h1>Account Details</h1>
    <div>
        <span >Go Back</span>
    </div>
    {account ? (
      <>
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Account Number</th>
              <th className="border px-4 py-2">Account Type</th>
              <th className="border px-4 py-2">Balance</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Initial Deposit</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">{account.id}</td>
              <td className="border px-4 py-2">{account.user_id}</td>
              <td className="border px-4 py-2">{account.account_number}</td>
              <td className="border px-4 py-2">{account.account_type}</td>
              <td className="border px-4 py-2">{account.balance}</td>
              <td className="border px-4 py-2">{account.status}</td>
              <td className="border px-4 py-2">{account.intial_deposit}</td>
              <td className="border px-4 py-2">{new Date(account.created_at).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 flex gap-4">
                        <button
                            onClick={handleDepositClick}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Deposit
                        </button>
                        <button
                            onClick={handleWithdrawClick}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Withdraw
                        </button>
                    </div>

      </>
    ) : (
      <p>No account details found.</p>
    )}

    {/* Transaction Modal */}
    {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <form onSubmit={handleTransactionSubmit}> {/* Wrap in form */}
                            <h2 className="text-xl font-bold mb-4">
                                {transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                            </h2>
                            <div className="mb-4">
                                <label className="block text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    className="w-full border px-3 py-2 rounded"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    className="w-full border px-3 py-2 rounded"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    disabled={transactionLoading}
                                >
                                    {transactionLoading ? 'Processing...' : 'Submit'}
                                </button>
                            </div>
                            {transactionError && (
                                <p className="text-red-500 mt-2">{transactionError}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
  </div>
  )
}

export default AccountDetails
