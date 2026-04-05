import { useState, useEffect, useRef } from 'react';

export const useDetectOutsideClick = (initialState) => {
    const [isActive, setIsActive] = useState(initialState);
    const nodeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nodeRef.current && !nodeRef.current.contains(event.target)) {
                setIsActive(false);
            }
        };

        if (isActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActive]);

    return [isActive, setIsActive, nodeRef];
};