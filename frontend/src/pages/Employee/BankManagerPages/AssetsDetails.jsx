import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useInventoryStore from '../../../store/assetsStore';

const AssetDetails = () => {
    const { assetId } = useParams();
    const { selectedAsset, fetchAssetById, isLoading, error } = useInventoryStore();

    useEffect(() => {
        if (assetId) {
            fetchAssetById(assetId);
        }
    }, [assetId]);
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Asset Details</h2>
     <span onClick={() => navigate(-1)} className="cursor-pointer">Go Back</span>
            {isLoading && <p>Loading asset details...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {selectedAsset && (
                <div className="bg-white p-4 shadow rounded">
                    <p><strong>Name:</strong> {selectedAsset.name}</p>
                    <p><strong>Category:</strong> {selectedAsset.category}</p>
                    <p><strong>Location:</strong> {selectedAsset.location}</p>
                    <p><strong>Model:</strong> {selectedAsset.model}</p>
                    <p><strong>Serial Number:</strong> {selectedAsset.serial_number}</p>
                    <p><strong>Purchase Date:</strong> {selectedAsset.purchase_date}</p>
                    <p><strong>Purchase price:</strong>Ksh  {selectedAsset.purchase_price}</p>
                    <p><strong>Assigned To:</strong> {selectedAsset.assigned_to}</p>
                    <p><strong>Status:</strong> {selectedAsset.status}</p>

                </div>
            )}
        </div>
    );
};

export default AssetDetails;
