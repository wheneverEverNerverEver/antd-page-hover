
import request from 'umi-request';
import { history } from 'umi';


export function gotToken() {
    return localStorage.getItem('USER_TOKEN');
}

// request interceptor, change url or options.
request.interceptors.request.use((url, options) => {
    const tokenJO = localStorage.getItem('USER_TOKEN');
    let headerRem = {}

    if (tokenJO) {
        headerRem = {
            'x-csrf-token': `${localStorage.getItem('USER_TOKEN')}`,
        };
    }
    return {
        url,
        options: {
            ...options,
            headers: {
                ...options.headers,
                ...headerRem
            }
        },
    };
});
// { global: true }





// clone response in response interceptor
request.interceptors.response.use(async (response, options) => {
    if (options?.responseType === 'blob') {
        return response;
    }
    const { url, headers } = response;
    const tokenGot = headers?.get('token');
    const isLogin = /\/api\/login\/account/.test(url)

    const tokenGotF = localStorage.getItem('USER_TOKEN')
    if (isLogin && tokenGot) {
        localStorage.setItem('USER_TOKEN', tokenGot);
    }

    if (`${response.status}` === '407' || (!isLogin && !tokenGotF)) {
        localStorage.removeItem('USER_TOKEN');
        history.push(`/user/login`, '_self');
        throw Error('请登录后进行操作');
    }
    if (`${response.status}` === '403') {
        throw Error('你没有该权限，请联系管理员');
    }
    if (/\/api\/logout\/account/.test(url)) {
        localStorage.removeItem('USER_TOKEN');
    }

    return response;
});

export default request

