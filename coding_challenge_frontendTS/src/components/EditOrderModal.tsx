import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, TextField, InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import $ from "jquery";

interface EditOrderForm {
    OrderID: string;
    Customer: string;
    OrderType: number;
    isOpen: boolean;
}

interface EditOrderModalProps {
    editData: EditOrderForm;
    onClose: () => void;
    refetch: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ editData: initialEditData, onClose, refetch }) => {
    const [editData, setEditData] = useState<EditOrderForm>(initialEditData);

    useEffect(() => {
        setEditData(initialEditData);
    }, [initialEditData.isOpen]);

    const dataChanged = () => {
        return editData !== null && (editData.OrderID !== initialEditData.OrderID || editData.Customer !== initialEditData.Customer || editData.OrderType !== initialEditData.OrderType);
    }

    const handleSave = () => {
        // makes a put call to the api
        $.ajax({
            url: "https://localhost:7298/api/Orders?id=" + encodeURIComponent(editData.OrderID) + "&type=" + encodeURIComponent(editData.OrderType) + "&customerName=" + encodeURIComponent(editData.Customer) + "&username=editor",
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                refetch();
            },
            error: function (err) {
                console.log(err);
            }
        });
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
