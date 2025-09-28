import { createContext, useState, useEffect, useContext } from "react";
import { useMediaQuery } from 'react-responsive';

export const DeviceResolution = createContext<dsOutputType | null>(null);

export type dsOutputType = {
    isDesktop: boolean,
    isTablet: boolean,
    isMobile: boolean,
    deviceType?: string
}

export function DeviceResolutionProvider({ children }: any) {
    const isMobile = useMediaQuery({ maxWidth: 600 });
    const isTablet = useMediaQuery({ minWidth: 601, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });

    const [resolutions, setResolutions] = useState<dsOutputType>({ isDesktop, isTablet, isMobile, deviceType: '' });

    useEffect(() => {
        setResolutions({ isDesktop, isTablet, isMobile, deviceType: (isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop') });

    }, [isDesktop, isTablet, isMobile]);

    return (
        <DeviceResolution.Provider value={resolutions} >
            {children}
        </DeviceResolution.Provider>
    )
}

export const useDeviceResolution = () => {
    const ctx = useContext(DeviceResolution);
    if (!ctx) {
        throw new Error("useDeviceResolution must be used within a DeviceResolutionProvider");
    }
    return ctx;
};
