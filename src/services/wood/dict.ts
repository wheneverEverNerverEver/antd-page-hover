export const tagLabel: API.TagLable = {
    'CLASS': {
        color: 'purple',
        label: '类别',
    },
    'DISTRICT': {
        color: 'cyan',
        label: '地区',
    },
    'DEPARTENT': {
        color: 'magenta',
        label: '部门',
    },
    'STAFF': {
        color: 'green',
        label: '操作人',
    }, 'BELONG': {
        color: 'orange',
        label: '所属店铺',
    },

}
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