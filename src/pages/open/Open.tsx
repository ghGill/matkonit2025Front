import './Open.css'
import api from '../../api/api'
import { useLocation } from 'wouter'
import { useEffect } from 'react';
import openPic from '../../assets/open.png';
import { useDeviceResolution } from '../../contents/DeviceResolution';

function OpenPage() {
    const [_, navigate ] = useLocation();
    const { deviceType } = useDeviceResolution();

    const pageDelay = async () => {
        const result:any = await api.dbAvailable();

        setTimeout(() => {
            if (result.success) {
                navigate('/recipes');
            }
            else {
                alert(result.message);
            }
        }, 5000)
    }

    useEffect(() => {
        pageDelay();
    }, [])

    return (
        <div className='open-page'>
            <div className={`open-title ${deviceType}`}>
                מתכונית 2025
            </div>
            <div className={`open-picture ${deviceType}`}>
                <img className={`${deviceType}`} src={openPic}></img>
            </div>
            <div className={`open-subtitle ${deviceType}`}>
                אתר שהוא כולו מתכון להצלחה
            </div>
        </div>
    )
}

export default OpenPage;
