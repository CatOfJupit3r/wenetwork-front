import UserProfile, { UserProfilePlaceholder } from '@components/ui/UserProfile';
import { useUsersContext } from '@context/UsersContext';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { FC, useEffect } from 'react';

interface iUserProfileOnContent {}

const UserProfileOnContent: FC<iUserProfileOnContent> = () => {
    const { users } = useUsersContext();
    const { currentUser, refreshCurrentUser } = useCurrentUser();

    useEffect(() => {
        refreshCurrentUser();
    }, [users]);

    return currentUser ? <UserProfile user={currentUser} /> : <UserProfilePlaceholder />;
};

export default UserProfileOnContent;
