const db = require('../config/database');

// Get all assets
exports.getAssets = (req, res) => {
    const query = `
      SELECT * FROM assets 
      ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching assets',
                error: err
            });
        }

        res.status(200).json({
            message: 'Assets retrieved successfully',
            data: results
        });
    });
};

// Get asset details by ID
exports.getAssetDetails = (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT 
        a.asset_id, a.name, a.category, a.model, a.serial_number, a.purchase_date, 
        a.purchase_price, a.assigned_to, a.location, a.status, a.warranty_expiry
      FROM assets a
      WHERE a.asset_id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching asset details',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            message: 'Asset details retrieved successfully',
            data: results[0]
        });
    });
};

// Get all consumables
exports.getConsumables = (req, res) => {
    const query = `
      SELECT * FROM consumables 
      ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching consumables',
                error: err
            });
        }

        res.status(200).json({
            message: 'Consumables retrieved successfully',
            data: results
        });
    });
};

// Get consumable details by ID
exports.getConsumableDetails = (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT 
        c.consumable_id, c.name, c.category, c.unit, c.quantity, 
        c.reorder_level, c.supplier_name, c.supplier_contact, 
        c.purchase_price, c.last_restocked
      FROM consumables c
      WHERE c.consumable_id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching consumable details',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Consumable not found'
            });
        }

        res.status(200).json({
            message: 'Consumable details retrieved successfully',
            data: results[0]
        });
    });
};


// Add a new asset
exports.addAsset = (req, res) => {
    const {
        name, category, model, serial_number, purchase_date, purchase_price,
        assigned_to, location, status, warranty_expiry
    } = req.body;

    const query = `
      INSERT INTO assets (name, category, model, serial_number, purchase_date, 
        purchase_price, assigned_to, location, status, warranty_expiry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, category, model, serial_number, purchase_date, 
        purchase_price, assigned_to, location, status, warranty_expiry], 
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error adding asset',
                    error: err
                });
            }

            res.status(201).json({
                message: 'Asset added successfully',
                asset_id: results.insertId
            });
    });
};

// Add a new consumable
exports.addConsumable = (req, res) => {
    const {
        name, category, unit, quantity, reorder_level, 
        supplier_name, supplier_contact, purchase_price, last_restocked
    } = req.body;

    const query = `
      INSERT INTO consumables (name, category, unit, quantity, reorder_level, 
        supplier_name, supplier_contact, purchase_price, last_restocked) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, category, unit, quantity, reorder_level, 
        supplier_name, supplier_contact, purchase_price, last_restocked], 
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error adding consumable',
                    error: err
                });
            }

            res.status(201).json({
                message: 'Consumable added successfully',
                consumable_id: results.insertId
            });
    });
};