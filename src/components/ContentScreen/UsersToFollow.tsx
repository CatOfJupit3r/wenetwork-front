import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';
import { useUsersContext } from '@context/UsersContext';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { UserCheck, UserPlus } from 'lucide-react';
import { FC, useCallback } from 'react';

interface iUserstoFollow {}

const UsersToFollow: FC<iUserstoFollow> = () => {
    const { users, followUser } = useUsersContext();
    const { currentUser } = useCurrentUser();

    const handleFollow = useCallback(
        (userToFollow: string) => {
            if (!currentUser) return;
            console.log('Following user:', userToFollow);
            followUser(userToFollow, currentUser.userId);
        },
        [followUser, currentUser],
    );

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Users to Follow</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[620px]">
                        {users.map((user, index) => (
                            <div key={index} className="mb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Avatar className="mr-2 h-8 w-8">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.profile.name}`}
                                        />
                                        <AvatarFallback>{user.profile.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">
                                            {user.profile.name} ({user.profile.followers})
                                        </p>
                                        <p className="text-sm text-gray-500">{user.profile.bio}</p>
                                    </div>
                                </div>
                                {currentUser?.profile.following.includes(user.userId) || user.userId === currentUser?.userId ? (
                                    <Button size="sm" variant="outline" disabled>
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Following
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={() => handleFollow(user.userId)}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Follow
                                    </Button>
                                )}
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersToFollow;
