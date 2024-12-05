import { Card, CardHeader, CardTitle } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { FC } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

interface iAuthScreen {}

const AuthScreen: FC<iAuthScreen> = () => {
    return (
        <div className={'min-h-screen bg-gray-100 flex'}>
            <div className={'w-full'}>
                <Card className={'mx-auto w-full max-w-md p-2 max-h-fit mt-52'}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">Welcome to WeNetwork</CardTitle>
                    </CardHeader>
                    <Tabs defaultValue={'login'}>
                        <TabsList className={'flex justify-center p-2'}>
                            <TabsTrigger className={'w-full'} value={'login'}>
                                Login
                            </TabsTrigger>
                            <TabsTrigger className={'w-full'} value={'register'}>
                                Register
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={'login'}>
                            <LoginScreen />
                        </TabsContent>
                        <TabsContent value={'register'}>
                            <RegisterScreen />
                        </TabsContent>
                    </Tabs>
                </Card>
                
            </div>
        </div>
    );
};

export default AuthScreen;
