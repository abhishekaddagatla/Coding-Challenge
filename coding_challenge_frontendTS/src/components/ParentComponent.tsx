import { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Searchbar from './Searchbar';
import DisplayTable from './DisplayTable';
import CreateOrderModal from './CreateOrderModal';
import Button from '@mui/material/Button';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import EditOrderModal from './EditOrderModal';
import * as $ from "jquery";


export interface Order {
    id: string,
    type: EnumsOrdersOrderType,
    customerName: string,
    createdDate: string,
    createdByUsername: string
}

export enum EnumsOrdersOrderType {
    Standard = 'Standard',
    SalesOrder = 'Sales Order',
    PurchaseOrder = 'Purchase Order',
    TransferOrder = 'Transfer Order',
    ReturnOrder = 'Return Order'
}

const enumValues = [
    EnumsOrdersOrderType.Standard,
    EnumsOrdersOrderType.SalesOrder,
    EnumsOrdersOrderType.PurchaseOrder,
    EnumsOrdersOrderType.TransferOrder,
    EnumsOrdersOrderType.ReturnOrder
];

function getEnumValueFromInt(intValue: number): EnumsOrdersOrderType | undefined {
    return enumValues[intValue];
}

export default function ParentComponent() {
    const [data, setData] = useState<Order[]>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const [editModal, setEditModal] = useState({ OrderID: "", Customer: "", OrderType: -1, isOpen: false });

    const handleEditModalClose = () => {
        setEditModal({ OrderID: "", Customer: "", OrderType: -1, isOpen: false });
    }

    const handleEditModalOpen = (id: string, customer: string, type: number) => {
        const modalData = { OrderID: id, Customer: customer, OrderType: type, isOpen: true };
        setEditModal(modalData);
        console.log(modalData)
    }

    const fetchSearchedData = async (searchTerm: string) => {
        try {
            const response = await fetch("https://localhost:7298/api/Orders/SearchOrders/" + searchTerm);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            data.forEach((row: any) => {
                row.type = getEnumValueFromInt(row.type);
                const date = new Date(row.createdDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                row.createdDate = formattedDate;
            });

            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchFilteredData = async (type: number) => {
        try {
            const response = await fetch("https://localhost:7298/api/Orders/ByType/" + type);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            data.forEach((row: any) => {
                row.type = getEnumValueFromInt(row.type);
                const date = new Date(row.createdDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                row.createdDate = formattedDate;
            });

            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:7298/api/Orders");
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            data.forEach((row: any) => {
                row.type = getEnumValueFromInt(row.type);
                const date = new Date(row.createdDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                row.createdDate = formattedDate;
            });

            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //call for data
    useEffect(() => {
        fetchData();
    }, []);

    const deleteRows = () => {
        // delete the rows
        const rowIds = selectionModel.join(",");
        $.ajax({
            type: "POST",
            url: "https://localhost:7298/api/Orders/Delete/" + rowIds,
            success: function (jqXHR: JQuery.jqXHR<any>) {
                if (jqXHR.status === 204) {
                    // Handle success
                    fetchData();
                } else {
                    // Handle other status codes
                }
            }
        })
    }



    return (
        <>
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <Searchbar fetchSearchedData={fetchSearchedData} fetchAllData={fetchData} />
                <CreateOrderModal refetch={fetchData} />
                <Button variant="outlined" sx={{ mr: 2, flexShrink: 0 }} onClick={deleteRows} color="error" disabled={selectionModel.length == 0}>Delete Selected</Button>
                <Dropdown fetchFilteredData={fetchFilteredData} fetchAllData={fetchData} />
            </div>
            <div>
                <DisplayTable data={data} changeSelection={setSelectionModel} openEditModal={handleEditModalOpen} />
                <EditOrderModal editData={editModal} onClose={handleEditModalClose}></EditOrderModal>
            </div>
        </>
    );
}