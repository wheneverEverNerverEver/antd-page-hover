
import { Button } from 'antd';

const CoverImage = ({ imageSrc, onClickDo }: { imageSrc?: string, onClickDo?: () => void }) => {
    return (

        <div style={{
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000000,

            width: '100%',
            height: '100%'
        }}>
            <Button
                type="primary"
                danger
                onClick={() => {
                    onClickDo?.()
                }} style={{
                    color: '#ffffff',
                    position: 'absolute',
                    right: '0px',
                    top: '30px',
                    paddingRight: '50px'
                }}>CLOSE</Button>
            <div style={{
                margin: '50px auto',
                maxWidth: '900px',
                overflowY: 'scroll',
            }} >
                <img src={imageSrc} style={{
                    margin: '0 auto',
                    maxWidth: '900px',
                    display: 'block'
                }} />
            </div>
        </div>
    )
}


export default CoverImage;
