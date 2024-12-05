import { paths } from '@configs';
import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const AuthScreen = lazy(() => import('@components/AuthScreen'));
const ContentScreen = lazy(() => import('@components/ContentScreen'));
const AuthPage = lazy(() => import('@components/AuthPage'));

function App() {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path={paths.auth} element={<AuthScreen />} />
                    <Route
                        path={paths.index}
                        element={
                            <AuthPage>
                                <ContentScreen />
                            </AuthPage>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
