import PostsSection from '@components/ContentScreen/PostsSection';
import UserProfileOnContent from '@components/ContentScreen/UserProfileOnContent';
import UsersToFollow from '@components/ContentScreen/UsersToFollow';
import { Separator } from '@components/ui/separator';
import { PostsContextProvider } from '@context/PostsContext';
import { UsersContextProvider } from '@context/UsersContext';
import { FC } from 'react';

interface iContentScreen {}

const ContentScreen: FC<iContentScreen> = () => {
    return (
        <div className="container mx-auto min-h-screen p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <UsersContextProvider>
                    <PostsContextProvider>
                        <div className={'flex flex-col gap-8 md:col-span-2'}>
                            <UserProfileOnContent />
                            <Separator />
                            <PostsSection />
                        </div>
                    </PostsContextProvider>
                    <UsersToFollow />
                </UsersContextProvider>
            </div>
        </div>
    );
};

export default ContentScreen;
