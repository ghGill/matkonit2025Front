import './Navbar.css';
import { useLocation } from "wouter";
import { useDeviceResolution } from '../../contents/DeviceResolution';

type navItemPropsType = {
    id: string,
    text: string,
    isCurrent:boolean,
}

function NavBarItem({id, text, isCurrent}:navItemPropsType) {
    const [_, navigate] = useLocation();
    return (
        <div className={`nav-item ${isCurrent ? 'current' : ''}`} onClick={() => {navigate(`/${id}`)}}>
            {text}
        </div>
    )
}

type navBarPropsType = {
    current: string,
}

function NavBar( { current }:navBarPropsType) {
    const navbarOptions = [
        {id:'recipes', text:'מתכונים'},
        {id:'categories', text:'קטגוריות'},
    ];

    const { deviceType } = useDeviceResolution();

    return (
        <div className={`nav-bar ${deviceType}`}>
            <div className='header'>
                <div className={`title ${deviceType}`}>
                    מתכונית 2025
                </div>

                <div className={`nav-logo ${deviceType}`}>
                    <img src='/matkonit-icon.png'></img>
                </div>
            </div>

            <div className='menu'>
                {
                    navbarOptions.map((o:any) => (
                        <NavBarItem key={o.id} id={o.id} text={o.text} isCurrent={current === o.id}/>
                    ))
                }
            </div>
        </div>
    )
}

export default NavBar;
