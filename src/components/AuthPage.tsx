import React, {FC} from 'react';
import useIsLoggedIn from "@hooks/useIsLoggedIn";
import {Navigate} from "react-router-dom";
import {paths} from "@configs";

interface iAuthPage {
    children: React.ReactNode;
}

const AuthPage: FC<iAuthPage> = ({ children }) => {
    const { isLoggedIn } = useIsLoggedIn();
    console.log('isLoggedIn', isLoggedIn);

    if (isLoggedIn) {
        return <>{children}</>;
    } else {
        return <Navigate to={paths.auth} relative={'path'} />;
    }
};

export default AuthPage;