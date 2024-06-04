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
    borderRadius: 3,
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

interface CreateOrderModalProps {
    fetchWrapper: (url: string, options: RequestInit) => Promise<any>;
    refetch: (page: number, pageSize: number) => void;
    page: number;
    pageSize: number;
    email: string;
}

export default function CreateOrderModal({ fetchWrapper, refetch, page, pageSize, email }: CreateOrderModalProps) {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState('');
    const [orderType, setOrderType] = useState('');

    const handleOpen = () => {
        setCustomer(''); // Reset customer state
        setOrderType(''); // Reset order type state
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => setCustomer(event.target.value);
    const handleOrderTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => setOrderType(event.target.value);

    function getOrderTypeInt(orderType: string): number {
        const orderTypeMap: { [key: string]: number } = {
            'Standard': 0,
            'SaleOrder': 1,
            'PurchaseOrder': 2,
            'TransferOrder': 3,
            'ReturnOrder': 4
        };

        return orderTypeMap[orderType] ?? -1;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        const user = email.split('@')[0];
        const formData = {
            type: getOrderTypeInt(orderType.replace(/\s/g, '')),
            customerName: customer,
            username: user
        }
        // const queryString = $.param(formData); Serialize formData into a query string
        try {
            await fetchWrapper(`http://localhost:7298/api/Orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
        } catch (error) {
            console.error('Error creating order:', error);
        }
        await refetch(page, pageSize);
        handleClose();
    };

    const isFormValid = customer !== '' && orderType !== '';

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen} sx={{ mr: 2, flexShrink: 0, height: '40px' }}>+ New Order</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5" component="h2" id="modal-modal-title" >
                        <b>Create Order</b>
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            autoFocus
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
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, lineHeight: '28px' }} disabled={!isFormValid}>
                            Submit
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
