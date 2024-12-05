import useIsLoggedIn from '@hooks/useIsLoggedIn';
import { iUser } from '@models/User';
import APIService from '@services/APIService';
import { useCallback, useEffect, useState } from 'react';

export const useCurrentUser = () => {
    const { isLoggedIn } = useIsLoggedIn();
    const [currentUser, setCurrentUser] = useState<iUser | null>(null);

    const refreshCurrentUser = useCallback(async () => {
        if (isLoggedIn) {
            setCurrentUser(null);
        }
        let user = null;
        try {
            user = await APIService.getUserInfo();
        } catch (e) {
            console.error(e);
        }
        setCurrentUser(user);
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            refreshCurrentUser().then();
        } else {
            setCurrentUser(null);
        }
    }, [isLoggedIn, refreshCurrentUser]);

    return {
        currentUser,
        refreshCurrentUser,
    };
};
