
// 文件流下载
export function downloadFromSTream(blob0, fileName) {
    const blob = new Blob([blob0]);
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.className = Date.now();
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);// 释放URL 对象
        document.body.removeChild(elink);
    } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
    }
}