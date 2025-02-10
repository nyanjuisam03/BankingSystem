import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useInventoryStore from '../../../store/assetsStore';
import { useNavigate } from 'react-router-dom';

const ConsumableDetails = () => {
    const { consumableId } = useParams();
    const { selectedConsumable, fetchConsumableById, isLoading, error } = useInventoryStore();

    useEffect(() => {
        if (consumableId) {
            fetchConsumableById(consumableId);
        }
    }, [consumableId]);
    const navigate = useNavigate();
    return (
        <div className="p-6">
            <span  onClick={() => navigate(-1)} className="cursor-pointer">Go Back</span>
            <h2 className="text-2xl font-bold mb-4">Consumable Details</h2>

            {isLoading && <p>Loading consumable details...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {selectedConsumable && (
                <div className="bg-white p-4 shadow rounded">
                    <p><strong>Name:</strong> {selectedConsumable.name}</p>
                    <p><strong>Category:</strong> {selectedConsumable.category}</p>
                    <p><strong>Quantity:</strong> {selectedConsumable.quantity}</p>
                    <p><strong>Quantity Unit:</strong> {selectedConsumable.unit}</p>
                    <p><strong>Reorder Level:</strong> {selectedConsumable.reorder_level}</p>
                    <p><strong>Supplier Name:</strong> {selectedConsumable.supplier_name}</p>
                    <p><strong>Supplier Contract:</strong> {selectedConsumable.supplier_contract}</p>
                    <p><strong>Purchase:</strong> {selectedConsumable.purchase_price}</p>

                </div>
            )}
        </div>
    );
};

export default ConsumableDetails;
