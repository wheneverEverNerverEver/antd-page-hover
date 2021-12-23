import { debounce } from 'lodash';

export default function asyncDebounce(func: (...args: any) => Promise<any>, wait: number) {
    const debounced = debounce(async (resolve, reject, bindSelf, args) => {
        try {
            const result = await func.bind(bindSelf)(...args);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }, wait);

    // This is the function that will be bound by the caller, so it must contain the `function` keyword.
    function returnFunc(...args: any) {
        return new Promise((resolve, reject) => {
            debounced(resolve, reject, this, args);
        });
    }

    return returnFunc;
}