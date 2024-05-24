import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, TextField, InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';

interface EditOrderForm {
    OrderID: string;
    Customer: string;
    OrderType: number;
    isOpen: boolean;
}

interface EditOrderModalProps {
    editData: EditOrderForm;
    onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ editData: initialEditData, onClose }) => {
    const [editData, setEditData] = useState<EditOrderForm>(initialEditData);

    useEffect(() => {
        setEditData(initialEditData);
    }, [initialEditData.isOpen]);

    const dataChanged = () => {
        return editData !== null && (editData.OrderID !== initialEditData.OrderID || editData.Customer !== initialEditData.Customer || editData.OrderType !== initialEditData.OrderType);
    }

    const handleSave = () => {
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };


    const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setEditData(prev => ({ ...prev, Customer: newVal }))
    }

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        const newVal = Number(event.target.value); // Cast the value to number
        console.log(newVal);
        setEditData(prev => ({ ...prev, OrderType: newVal }))
    }

    return (
        <Modal open={initialEditData.isOpen} onClose={handleCancel}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 425,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    outline: 'none',
                }}
            >
                <h2 style={{ marginTop: 0 }}>Edit Order</h2>
                {/* A text field to edit Customer and a dropdown to edit OrderType*/}
                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                    <TextField label="Order ID" disabled defaultValue={initialEditData.OrderID} sx={{ width: '40ch', mb: 2 }}></TextField>
                    <TextField label="Customer Name" defaultValue={initialEditData.Customer} sx={{ width: '40ch', mb: 2 }} onChange={handleCustomerChange}></TextField>
                    <FormControl variant="standard" sx={{ width: '40ch', height: "100%" }}>
                        <InputLabel id="demo-simple-select-standard-label">Order Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Order Type"
                            defaultValue={initialEditData.OrderType}
                            onChange={handleTypeChange}
                        >
                            <MenuItem value={0}>Standard</MenuItem>
                            <MenuItem value={1}>Sale Order</MenuItem>
                            <MenuItem value={2}>Purchase Order</MenuItem>
                            <MenuItem value={3}>Transfer Order</MenuItem>
                            <MenuItem value={4}>Return Order</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ display: "flex", marginTop: '1.5em' }}>
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={!dataChanged()}>
                        Save
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditOrderModal;
