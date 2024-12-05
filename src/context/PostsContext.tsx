import { useCurrentUser } from '@hooks/useCurrentUser';
import { iPost } from '@models/Post';
import APIService from '@services/APIService';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface iPostsContext {
    posts: iPost[];
    isLoading: boolean;
    activeTab: string;
    changeActiveTab: (tab: string) => void;
    handleComment: (newComment: string, post_id: string) => Promise<void>;
    handleLike: (post_id: string) => Promise<void>;
    addNewPost: (content: string) => Promise<void>;
}

const PostsContext = createContext<iPostsContext | undefined>(undefined);

export const PostsContextProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useCurrentUser();

    const [posts, setPosts] = useState<iPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('latest');

    const fetchPosts = useCallback(
        async (explicitLoading: boolean = false) => {
            let getFunc: () => Promise<iPost[]>;
            if (explicitLoading) {
                setIsLoading(true);
            }
            if (activeTab === 'latest') {
                if (!currentUser) {
                    if (explicitLoading) {
                        setIsLoading(false);
                    }
                    return;
                }
                getFunc = () => APIService.getUserFeed();
            } else {
                getFunc = () => APIService.getMostLikedPosts();
            }
            try {
                setPosts(await getFunc());
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
            if (explicitLoading) {
                setIsLoading(false);
            }
        },
        [activeTab, currentUser],
    );

    useEffect(() => {
        fetchPosts(true);
    }, [activeTab, currentUser]);

    const handleComment = useCallback(
        async (newComment: string, post_id: string) => {
            if (!newComment.trim() || !currentUser) return;
            await APIService.addCommentToPost(post_id, newComment);
            await fetchPosts(true);
        },
        [currentUser, fetchPosts],
    );

    const handleLike = useCallback(
        async (post_id: string) => {
            if (!currentUser) return;
            await APIService.likePost(post_id);
            await fetchPosts(true);
        },
        [currentUser, fetchPosts],
    );

    const changeActiveTab = useCallback(
        (tab: string) => {
            if (tab === activeTab) return;
            if (['latest', 'popular'].includes(tab)) {
                setActiveTab(tab);
            }
        },
        [activeTab],
    );

    const addNewPost = useCallback(
        async (content: string) => {
            if (!content.trim() || !currentUser) return;
            await APIService.createPost(content);
            await fetchPosts(true);
        },
        [posts],
    );

    return (
        <PostsContext.Provider
            value={{
                posts,
                isLoading,
                activeTab,
                changeActiveTab,
                handleComment,
                handleLike,
                addNewPost,
            }}
        >
            {children}
        </PostsContext.Provider>
    );
};

export const usePostsContext = () => {
    const context = useContext(PostsContext);
    if (context === undefined) {
        throw new Error('usePostsContext must be used within a PostsContextProvider.');
    }
    return context as iPostsContext;
};
