import { ProFormSelect } from "@ant-design/pro-form";
import type { ProFormSelectProps } from "@ant-design/pro-form/lib/components/Select";
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from "react";
import { findDepartmentData } from '../../services/wood/api';

export function useFindDepartment(type?: API.LabelType) {
    const [depart, setDepart] = useState<Record<'value' | 'label', string>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            findDepartmentData({ label: type }).then((res) => {
                // eslint-disable-next-line no-underscore-dangle
                const dataOut = (res?.data || []).map((v) => ({ value: v.code!, label: v.deName!, id: v._id! }));
                setDepart(dataOut);
            });
        };
        fetchData()

        return () => { }

    }, []);
    return depart
}

const DepartmentSelect: React.FC<PropsWithChildren<ProFormSelectProps & { type?: API.LabelType }>> = (props) => {
    const { type = 'DEPARTENT', ...rest } = props
    const depart = useFindDepartment(type)
    return (<>
        <ProFormSelect
            {...rest}
            options={depart}

        /></>)
}

export default DepartmentSelect

