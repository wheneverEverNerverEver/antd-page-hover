import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import proxy from './../../config/proxy';
import { useInterval } from 'react-use';

const baseTime = 10;

export function DownloadComponent(props: {
    fileName?: string,
}) {
    const { fileName } = props;
    const [tick, setTick] = useState<number>(baseTime)

    useEffect(() => {
        setTick(baseTime)
    }, [fileName])

    useInterval(
        () => {
            setTick(tick - 1);
        },
        tick > 0 && fileName ? 1000 : null
    );
    const downloadUrl = useMemo(() => {
        const env = process.env.NODE_ENV;
        const hrefPre = env === 'development' ? proxy.dev['/api/'].target : `//${window.location.host}/`;
        return hrefPre;
    }, []);
    return (
        <>
            {fileName && tick > 0 && (
                <a
                    href={`${downloadUrl}${fileName}`}
                    style={{ display: 'block', padding: '0 5%', boxSizing: 'border-box' }}
                >
                    <Button
                        type="primary"
                        danger
                        style={{ width: '100%', margin: '5px auto' }}
                        size="large"
                    >
                        下载转换后的文件 （{tick}s 后请重新上传后下载）
                    </Button>
                </a>
            )}
        </>
    )
}