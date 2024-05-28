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
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState('')
    const [rowCount, setRowCount] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handleEditModalClose = () => {
        setEditModal({ OrderID: "", Customer: "", OrderType: -1, isOpen: false });
    }

    const handleEditModalOpen = (id: string, customer: string, type: number) => {
        const modalData = { OrderID: id, Customer: customer, OrderType: type, isOpen: true };
        setEditModal(modalData);
        console.log(modalData)
    }

    const fetchData = async (page: number, pageSize: number) => {
        try {
            let filters = `/Filter?page=${page + 1}&pageSize=${pageSize}`;
            if (searchTerm !== '') {
                filters += `&customerQuery=${searchTerm}`;
            }
            if (type !== '') {
                filters += `&type=${type}`;
            }
            const response = await fetch(`https://localhost:7298/api/Orders${filters}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
            setRowCount(totalCount);

            const formattedData = data.map((row: any) => {
                return {
                    ...row,
                    type: getEnumValueFromInt(row.type),
                    createdDate: new Date(row.createdDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })
                };
            });

            setData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(page, pageSize);
    }, [, page, pageSize, searchTerm, type]);

    // call for data when search term changes with a delay of 1 second
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData(page, pageSize);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const deleteRows = () => {
        // delete the rows
        const rowIds = selectionModel.join(",");
        $.ajax({
            type: "POST",
            url: "https://localhost:7298/api/Orders/Delete/" + rowIds,
            success: function (data, textStatus, jqXHR) {
                if (jqXHR && jqXHR.status === 204) {
                    // Handle success
                    fetchData();
                } else {
                    // Handle other status codes or undefined jqXHR
                    console.error("Unexpected response:", jqXHR);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error deleting rows:", errorThrown);
            }
        });
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <CreateOrderModal refetch={fetchData} page={page} pageSize={pageSize} />
                <Button variant="outlined" sx={{ mr: 2, flexShrink: 0 }} onClick={deleteRows} color="error" disabled={selectionModel.length == 0}>Delete Selected</Button>
                <Dropdown fetchAllData={fetchData} type={type} setType={setType} page={page} pageSize={pageSize} />
            </div>
            <div>
                <DisplayTable
                    data={data}
                    changeSelection={getSelection}
                    openEditModal={handleEditModalOpen}
                    rowCount={rowCount}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />
                <EditOrderModal editData={editModal} onClose={handleEditModalClose} refetch={fetchData} page={page} pageSize={pageSize}></EditOrderModal>
            </div>
        </>
    );
}