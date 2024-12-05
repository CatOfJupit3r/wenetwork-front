import CreatePost from '@components/ContentScreen/CreatePost';
import Loading from '@components/ContentScreen/Loading';
import PostDisplay from '@components/ContentScreen/PostDisplay';
import { Separator } from '@components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { usePostsContext } from '@context/PostsContext';
import { FC, useMemo } from 'react';

interface iPostsSection {}

const PostsSection: FC<iPostsSection> = () => {
    const { posts, isLoading, activeTab, changeActiveTab } = usePostsContext();
    const MemoizedCreatePost = useMemo(() => <CreatePost />, []);

    return (
        <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={changeActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="latest">Latest Posts</TabsTrigger>
                    <TabsTrigger value="popular">Most Liked Posts</TabsTrigger>
                </TabsList>
                <TabsContent value="latest">
                    <h2 className="mb-2 text-xl font-semibold">Latest Posts from Following</h2>
                    <Separator />
                    {MemoizedCreatePost}
                    <Separator />
                    {isLoading && posts ? (
                        <Loading />
                    ) : posts.length === 0 ? (
                        <p>No posts to show</p>
                    ) : (
                        posts.map((post) => <PostDisplay key={post.postId} post={post} />)
                    )}
                </TabsContent>
                <TabsContent value="popular">
                    <h2 className="mb-2 text-xl font-semibold">Most Liked Posts</h2>
                    <Separator />
                    {MemoizedCreatePost}
                    <Separator />
                    {isLoading && posts ? (
                        <Loading />
                    ) : posts.length === 0 ? (
                        <p>No posts to show</p>
                    ) : (
                        posts.map((post) => <PostDisplay key={post.postId} post={post} />)
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PostsSection;
