import { useState, useEffect, SetStateAction } from 'react';
import Dropdown from './Dropdown';
import Searchbar from './Searchbar';
import DisplayTable from './DisplayTable';
import CreateOrderModal from './CreateOrderModal';
import Button from '@mui/material/Button';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import EditOrderModal from './EditOrderModal';
import * as $ from "jquery";
import { useSession } from '../SessionContext';
import ToggleThemeIcon from './toggleThemeIcon';

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

interface ParentComponentProps {
    toggleTheme: () => void;
    theme: any;
}

export default function ParentComponent({ toggleTheme, theme }: ParentComponentProps) {
    const [data, setData] = useState<Order[]>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const [editModal, setEditModal] = useState({ OrderID: "", Customer: "", OrderType: -1, isOpen: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState('')
    const [rowCount, setRowCount] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const { profile, signOut } = useSession();

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

            const result = await response.json();
            // console.log(result)
            const TotalCount = result.totalCount;
            const Orders = result.orders;
            setRowCount(TotalCount);
            // console.log("TotalCount: ", TotalCount);

            const formattedData = Orders.map((row: any) => ({
                ...row,
                type: getEnumValueFromInt(row.type),
                createdDate: new Date(row.createdDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }));

            setData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(page, pageSize);
        //console.log("Page: ", page, "PageSize: ", pageSize, "Type: ", type, "SearchTerm: ", searchTerm)
    }, [page, pageSize, type]);

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
                    fetchData(page, pageSize);
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

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/';
    };

    return (
        <>
            <div id='header' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <CreateOrderModal refetch={fetchData} page={page} pageSize={pageSize} email={profile?.email ?? ''} />
                    <Button variant="outlined" sx={{ mr: 2, flexShrink: 0 }} onClick={deleteRows} color="error" disabled={selectionModel.length == 0}>Delete Selected</Button>
                    <Dropdown fetchAllData={fetchData} type={type} setType={setType} page={page} pageSize={pageSize} />
                </div>
                <Button variant="text" size="small" onClick={toggleTheme}><ToggleThemeIcon theme={theme} /></Button>
            </div>
            <div>
                <DisplayTable
                    data={data}
                    changeSelection={setSelectionModel}
                    openEditModal={handleEditModalOpen}
                    rowCount={rowCount}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />
                <EditOrderModal editData={editModal} onClose={handleEditModalClose} refetch={fetchData} page={page} pageSize={pageSize}></EditOrderModal>
            </div>
            <div id='footer' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <p>© 2024 - All rights reserved</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <p style={{ marginBottom: 0 }}>Logged in as <i><b>{profile?.email.split('@')[0]}</b></i></p>
                    <Button variant="text" size="small" color="error" sx={{ flexShrink: 0 }} onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </>
    );
}