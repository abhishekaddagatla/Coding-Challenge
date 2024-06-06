import { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Searchbar from './Searchbar';
import DisplayTable from './DisplayTable';
import CreateOrderModal from './CreateOrderModal';
import Button from '@mui/material/Button';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import EditOrderModal from './EditOrderModal';
import { useSession } from '../SessionContext';
import DateFilter from './DateFilter';
import CircularProgress from '@mui/material/CircularProgress';
import ThemeSwitch from './ThemeSwitch';
import Alert from './Alert';
import '../assets/parentStyles.css'

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
    const [pageSize, setPageSize] = useState(12);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [firstLoadFinished, setFirstLoadFinished] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const { profile, signOut } = useSession();

    const handleEditModalClose = () => {
        setAlertMessage('Order Updated Successfully');
        setAlertOpen(true);
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
            if (startDate != null && endDate != null) {
                filters += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await fetchWrapper(`https://coding-challenge-backend.happybush-8600bc6e.northcentralus.azurecontainerapps.io/api/Orders${filters}`, { method: 'GET' });

            const TotalCount = response.totalCount;
            const Orders = response.orders;
            setRowCount(TotalCount);

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
            setFirstLoadFinished(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(page, pageSize);
    }, [page, pageSize]);

    useEffect(() => {
        setPage(0);
        fetchData(page, pageSize);
    }, [type, startDate, endDate]);

    // call for data when search term changes with a delay of 1 second
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(0);
            fetchData(page, pageSize);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const deleteRows = async () => {
        // delete the rows
        const rowIds = selectionModel.map((row) => row.toString());
        try {
            await fetchWrapper(`https://coding-challenge-backend.happybush-8600bc6e.northcentralus.azurecontainerapps.io/api/Orders/Delete/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: rowIds })
            });
        } catch (error) {
            console.error('Error deleting rows:', error);
        }
        await fetchData(page, pageSize);
        setAlertMessage(selectionModel.length > 1 ? `${selectionModel.length} Orders Deleted` : `${selectionModel.length} Order Deleted`);
        setAlertOpen(true);
    };

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/';
    };

    return (
        <>
            {data.length === 0 && !firstLoadFinished ? <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} /> :
                <div id='wrapper' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }}>
                    <div className='OuterHeader' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className='InnerHeader' style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
                            <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <CreateOrderModal setAlertMessage={setAlertMessage} setAlertOpen={setAlertOpen} fetchWrapper={fetchWrapper} refetch={fetchData} page={page} pageSize={pageSize} email={profile?.email ?? ''} />
                            <Button variant="outlined" sx={{ mr: 2, flexShrink: 0, lineHeight: '28px' }} onClick={deleteRows} color="error" disabled={selectionModel.length == 0}>Delete Selected</Button>
                            <Dropdown fetchAllData={fetchData} type={type} setType={setType} page={page} pageSize={pageSize} />
                            <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} theme={theme} />
                        </div>
                        <div style={{ height: '40px' }}>
                            <ThemeSwitch toggleTheme={toggleTheme} />
                        </div>
                    </div>
                    <div>
                        <DisplayTable
                            theme={theme}
                            data={data}
                            changeSelection={setSelectionModel}
                            openEditModal={handleEditModalOpen}
                            rowCount={rowCount}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                        />
                        <EditOrderModal fetchWrapper={fetchWrapper} editData={editModal} onClose={handleEditModalClose} refetch={fetchData} page={page} pageSize={pageSize} user={profile?.email ?? ''} />
                        <Alert open={alertOpen} setOpen={setAlertOpen} message={alertMessage} />
                    </div>
                    <div id='footer' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <p>© 2024 - All rights reserved</p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <p style={{ marginBottom: 0 }}>Logged in as <i><b>{profile?.email.split('@')[0]}</b></i></p>
                            <Button variant="text" size="small" color="error" sx={{ flexShrink: 0 }} onClick={handleLogout}>Logout</Button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

async function fetchWrapper(url: string, options: RequestInit) {
    const bearerToken = JSON.parse(localStorage.getItem('sb-bgjzrqctvozmutgbmgqy-auth-token') ?? '').access_token;
    options['headers'] = {
        ...options.headers,
        "Authorization": `Bearer ${bearerToken}`
    }

    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}