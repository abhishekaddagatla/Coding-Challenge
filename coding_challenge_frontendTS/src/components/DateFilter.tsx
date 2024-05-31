import { ConfigProvider, DatePicker } from 'antd';
import { darkTheme, defaultTheme } from '@ant-design/compatible';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';

interface DateFilterProps {
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
    theme: any;
}

const DateFilter: React.FC<DateFilterProps> = ({ setStartDate, setEndDate, theme }) => {
    const { RangePicker } = DatePicker;
    const [currentTheme, setCurrentTheme] = useState(defaultTheme);

    const toggleTheme = () => {
        setCurrentTheme(currentTheme === darkTheme ? defaultTheme : darkTheme);
    }

    useEffect(() => {
        toggleTheme();
    }, [theme])

    const handleCalendarChange = (dates: any, dateStrings: [string, string]) => {
        setStartDate(dates === null ? null : dates[0].$d.toISOString());
        setEndDate(dates === null ? null : dates[1].$d.toISOString());
    }

    function disabledDate(current: Dayjs) { // Update the type of the 'current' parameter to 'Dayjs'
        return current && current.valueOf() > Date.now();
    }

    return (
        <ConfigProvider theme={currentTheme}>
            <RangePicker allowEmpty={[false, false]} onChange={handleCalendarChange} disabledDate={disabledDate} />
        </ConfigProvider>
    );
}

export default DateFilter;