import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { iUser } from '@models/User';
import { CalendarIcon } from 'lucide-react';
import { FC, useState } from 'react';
import {Skeleton} from "@components/ui/skeleton";

interface UserProfileProps {
    user: iUser;
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
    const [showFullBio, setShowFullBio] = useState(false);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const truncateBio = (bio: string, maxLength: number) => {
        if (bio.length <= maxLength) return bio;
        return `${bio.slice(0, maxLength)}...`;
    };

    return (
        <div className="mx-auto w-full">
            <div className="relative">
                <img
                    src={user.profile.cover || 'https://api.dicebear.com/6.x/initials/svg?height=200&width=600'}
                    alt="Cover"
                    className="h-48 w-full object-cover"
                />
                <Avatar className="absolute bottom-0 left-4 h-32 w-32 translate-y-1/2 transform border-4 border-white">
                    <AvatarImage
                        src={user.profile.avatar || 'https://api.dicebear.com/6.x/initials/svg?height=128&width=128'}
                        alt={user.profile.name}
                    />
                    <AvatarFallback>{user.profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="mt-16 px-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{user.profile.name}</h1>
                        <p className="text-gray-600">@{user.profile.handle}</p>
                    </div>
                </div>
                <p className="mt-4">
                    {showFullBio ? user.profile.bio : truncateBio(user.profile.bio, 100)}
                    {user.profile.bio.length > 100 && (
                        <button
                            onClick={() => setShowFullBio(!showFullBio)}
                            className="ml-1 text-blue-500 hover:underline"
                        >
                            {showFullBio ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </p>
                <div className="mt-4 flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        Joined {formatDate(user.createdAt)}
                    </span>
                </div>
                <div className="mt-4 flex space-x-4">
                    <span className="font-semibold">
                        {user.profile.following.length} <span className="font-normal text-gray-600">Following</span>
                    </span>
                    <span className="font-semibold">
                        {user.profile.followers} <span className="font-normal text-gray-600">Followers</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

interface iUserProfilePlaceholderProps {
    className?: string;
}


const UserProfilePlaceholder: FC<iUserProfilePlaceholderProps> = ({ className }) => {
    return (
        <div className={className}>
            <div className="relative">
                <Skeleton className="h-48 w-full" />
                <Avatar className="absolute bottom-0 left-4 h-32 w-32 translate-y-1/2 transform border-4 border-white">
                    <AvatarFallback>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="mt-16 px-4">
                <div className="flex items-start justify-between">
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                </div>
                <div className="mt-4">
                    <Skeleton className="h-4 w-72" />
                    <div className="mt-2">
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="mt-4 flex space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
};

export { UserProfilePlaceholder };

export default UserProfile;
