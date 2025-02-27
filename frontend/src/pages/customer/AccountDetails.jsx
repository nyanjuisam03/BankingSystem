import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import accountStore from '../../store/accountStore';
import useTransactionStore from '../../store/useTransactionStore';
import { useNavigate } from 'react-router-dom';
import AccountTransactionsTable from '../../components/Tables/AccountTransactionsTable';


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

    const [transactionMethod, setTransactionMethod] = useState("");
    const navigate = useNavigate();

    // Helper function to convert account type number to string
    const getAccountTypeLabel = (typeNumber) => {
        const accountTypes = {
            '1': 'Savings',
            '2': 'Premium Savings',
            '3': 'Student Savings',
            '4': 'Business Savings'
        };
        return accountTypes[typeNumber] || 'Unknown';
    };

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
        e.preventDefault();
        
        try {
            if (!amount || parseFloat(amount) <= 0) {
                alert('Please enter a valid amount');
                return;
            }

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
            console.log(result)
            if (result) {
                resetForm();
                await fetchAccountDetail(accountId);
                alert(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to complete transaction.';
            alert(errorMessage);
           
        }
    };

    const handleDepositClick = () => {
        if (account.status === 'pending' || account.status === 'rejected') {
            alert('Your account status is not eligible for transactions.');
            return;
        }
        resetForm();
        setTransactionType('deposit');
        setShowModal(true);
    };

    const handleWithdrawClick = () => {
        if (account.status === 'pending' || account.status === 'rejected') {
            alert('Your account status is not eligible for transactions.');
            return;
        }
        resetForm();
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
    
            <div>
                <span onClick={() => navigate(-1)} className="cursor-pointer">Go Back</span>
            </div>
            {account ? (
                <>
                <h1 className='text-xl font-bold py-3'>Account Details for {account.account_number}</h1>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                    
                        <table className="table-auto border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Account Number</th>
                                    <th className="border px-4 py-2">Account Type</th>
                                    <th className="border px-4 py-2">Balance (Ksh)</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Initial Deposit</th>
                                    {/* <th className="border px-4 py-2">Created At</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">{account.account_number}</td>
                                    <td className="border px-4 py-2">{getAccountTypeLabel(account.account_type)}</td>
                                    <td className="border px-4 py-2">{account.balance}</td>
                                    <td className="border px-4 py-2">{account.status}</td>
                                    <td className="border px-4 py-2">{account.intial_deposit}</td>
                                    {/* <td className="border px-4 py-2">{new Date(account.created_at).toLocaleString()}</td> */}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={handleDepositClick}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            disabled={account.status === 'pending' || account.status === 'rejected'}
                        >
                            Deposit
                        </button>
                        <button
                            onClick={handleWithdrawClick}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            disabled={account.status === 'pending' || account.status === 'rejected'}
                        >
                            Withdraw
                        </button>
                        <button
        onClick={() => navigate(`/customer/loan/application/${account.account_number}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={account.status !== 'approved'}
    >
        Apply for Loan
    </button>
                    </div>

<div>
    <AccountTransactionsTable accountId={accountId}/>
</div>

                </>
            ) : (
                <p>No account details found.</p>
            )}

{showModal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <form onSubmit={handleTransactionSubmit}>
                <h2 className="text-xl font-bold mb-4">
                    {transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                </h2>

                {/* Deposit/Withdraw Method Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">
                        {transactionType === 'deposit' ? 'Deposit Method' : 'Withdrawal Method'}
                    </label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={transactionMethod}
                        onChange={(e) => setTransactionMethod(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select an option</option>
                        {transactionType === 'deposit' ? (
                            <>
                                <option value="bank-transfer">Bank Transfer</option>
                                <option value="mobile-money">Mobile Money (M-PESA, Airtel Money)</option>
                                <option value="agent-deposit">Agent Deposit</option>
                            </>
                        ) : (
                            <>
                                <option value="withdraw-bank">Withdraw to Bank Account</option>
                                <option value="withdraw-mobile">Withdraw to Mobile Money</option>
                                <option value="withdraw-agent">Withdraw via Agent</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Amount Input */}
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

                {/* Description Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Buttons */}
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

                {/* Error Message */}
                {transactionError && (
                    <p className="text-red-500 mt-2">{transactionError}</p>
                )}
            </form>
        </div>
    </div>
)}

        </div>
    );
}

export default AccountDetails;
