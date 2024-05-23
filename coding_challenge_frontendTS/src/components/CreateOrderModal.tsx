import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const orderTypes = [
    { value: 'Standard', label: 'Standard' },
    { value: 'SaleOrder', label: 'Sale Order' },
    { value: 'PurchaseOrder', label: 'Purchase Order' },
    { value: 'TransferOrder', label: 'Transfer Order' },
    { value: 'ReturnOrder', label: 'Return Order' },
];

export default function BasicModal() {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState('');
    const [orderType, setOrderType] = useState('');

    const handleOpen = () => {
      setOpen(true)
      
    };
    const handleClose = () => setOpen(false);
    const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => setCustomer(event.target.value);
    const handleOrderTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => setOrderType(event.target.value);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Customer:', customer);
        console.log('Order Type:', orderType);
        handleClose();
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen} sx={{ mr: 2, flexShrink: 0 }}>+ New Order</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2" id="modal-modal-title">
                        Create Order
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Customer"
                            id='customerField'
                            value={customer}
                            onChange={handleCustomerChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            select
                            label="Order Type"
                            id='orderField'
                            value={orderType}
                            onChange={handleOrderTypeChange}
                        >
                            {orderTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Submit
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
