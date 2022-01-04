export const tagLabel: API.TagLable = {
    'CLASS': {
        color: 'purple',
        label: '来源平台',
    },
    'DISTRICT': {
        color: 'cyan',
        label: '单据经手人',
    },
    'DEPARTENT': {
        color: 'magenta',
        label: '单据部门',
    },
    'STAFF': {
        color: 'deepSkyBlue',
        label: '默认业务员',
    }, 'BELONG': {
        color: 'orange',
        label: '所属店铺',
    },
    'WAREHOUSE': {
        color: 'lightgreen',
        label: '仓库',
    }

}
export const labelItem: {
    label: string,
    value: API.LabelType
}[] = [
        {
            label: '单据部门',
            value: 'DEPARTENT',
        },
        {
            label: '来源平台',
            value: 'CLASS',
        }, {
            label: '默认业务员',
            value: 'STAFF',
        }, {
            label: '单据经手人',
            value: 'DISTRICT',
        }, {
            label: '所属店铺',
            value: 'BELONG',
        }, {
            label: '仓库',
            value: 'WAREHOUSE',
        },
    ]
// '3_OWE' | '1_SERIOUS_DELAY' | '2_HIGH_DELAY'
export const stateColor: API.ColorAndLabel<API.StatusBill> = {
    '2_HIGH_DELAY': {
        color: '#ec911f',
        label: '延期七天内'
    },
    '3_OWE': {
        color: 'rgb(195 189 38)',
        label: '延期三天内'
    },
    '1_SERIOUS_DELAY': {
        color: '#f50',
        label: '延期超七天'
    },
}

export const stateSelect: API.ValueAndLabel<API.StatusBill> = [
    {
        label: '延期三天内',
        value: '3_OWE',
    }, {
        label: '延期七天内',
        value: '2_HIGH_DELAY',
    }, {
        label: '延期超七天',
        value: '1_SERIOUS_DELAY',
    }
]