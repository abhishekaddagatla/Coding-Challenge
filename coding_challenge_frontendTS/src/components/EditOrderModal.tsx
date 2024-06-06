import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, TextField, InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';

interface EditOrderForm {
    OrderID: string;
    Customer: string;
    OrderType: number;
    isOpen: boolean;
}

interface EditOrderModalProps {
    fetchWrapper: (url: string, options: RequestInit) => Promise<any>;
    editData: EditOrderForm;
    onClose: () => void;
    refetch: (page: number, pageSize: number) => void;
    page: number;
    pageSize: number;
    user: string;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ fetchWrapper, editData: initialEditData, onClose, refetch, page, pageSize, user }) => {
    const [editData, setEditData] = useState<EditOrderForm>(initialEditData);
    const [customerNameError, setCustomerNameError] = useState(false);

    useEffect(() => {
        setEditData(initialEditData);
    }, [initialEditData.isOpen]);

    const dataChanged = () => {
        return editData !== null && (editData.OrderID !== initialEditData.OrderID || editData.Customer !== initialEditData.Customer || editData.OrderType !== initialEditData.OrderType);
    }

    const handleSave = async () => {
        if (checkEmpty(editData.Customer) || editData.OrderType === -1) {
            setCustomerNameError(true);
            return;
        }
        // makes a put call to the api
        const body = JSON.stringify({
            Id: editData.OrderID,
            Type: editData.OrderType,
            CustomerName: editData.Customer,
            Username: user.split('@')[0]
        });
        console.log(body)
        try {
            await fetchWrapper(`https://coding-challenge-backend.happybush-8600bc6e.northcentralus.azurecontainerapps.io/api/Orders?id=` + encodeURIComponent(editData.OrderID) + "&type=" + encodeURIComponent(editData.OrderType) + "&customerName=" + encodeURIComponent(editData.Customer) + "&username=" + user.split('@')[0], {
                method: 'PUT',
            });
            await refetch(page, pageSize);
        } catch (error) {
            console.error('Error updating order:', error);
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const checkEmpty = (value: string) => {
        return value === '' || value === null;
    }


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
                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                    <TextField label="Order ID" disabled defaultValue={initialEditData.OrderID} sx={{ width: '40ch', mb: 2 }}></TextField>
                    <TextField error={customerNameError} autoFocus label="Customer Name" defaultValue={initialEditData.Customer} sx={{ width: '40ch', mb: 2 }} onChange={handleCustomerChange}></TextField>
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
