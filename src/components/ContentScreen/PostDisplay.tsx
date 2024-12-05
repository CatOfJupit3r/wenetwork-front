import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { usePostsContext } from '@context/PostsContext';
import { useUsersContext } from '@context/UsersContext';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { iPost } from '@models/Post';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { FC, useState } from 'react';
import {usePostComments} from "@components/ContentScreen/usePostComments";
import {ButtonWithPromise} from "@components/ui/ButtonWithPromise";

interface iDisplayPosts {
    post: iPost;
}

const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const PostDisplay: FC<iDisplayPosts> = ({ post }) => {
    const { postId, userId, content, createdAt, likes } = post;
    const { comments } = usePostComments(postId);
    
    const [newComment, setNewComment] = useState('');
    const { handleComment, handleLike } = usePostsContext();
    const [showAddComment, setShowAddComment] = useState(false);
    const { users } = useUsersContext();
    const { currentUser } = useCurrentUser();

    return (
        <Card key={postId} className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="mr-2 h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userId}`} />
                            <AvatarFallback>{userId}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{users.find((u) => u.userId === userId)?.profile.name || 'Unknown User'}</CardTitle>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
                </div>
            </CardHeader>
            <CardContent>
                <p
                className={'text-gray-800 text-lg break-words'}
                >{content}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
                <div className="mb-2 flex items-center">
                    <ButtonWithPromise 
                        variant="ghost" 
                        size="sm" 
                        onClickAsync={() => handleLike(postId)}
                        className="mr-2"
                        loader={
                        <>
                            <Heart
                                className={`mr-2 h-4 w-4 animate-pulse fill-gray-500 text-gray-500`}
                            />
                            {likes.length} Likes
                        </>
                        }
                    >
                        <Heart
                            className={`mr-2 h-4 w-4 ${likes.includes(currentUser?.userId || '') ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {likes.length} Likes
                    </ButtonWithPromise>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddComment(true)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {comments.length} Comments
                    </Button>
                </div>
                {showAddComment ? (
                    <div className="flex w-full items-center">
                        <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="mr-2 flex-grow"
                        />
                        <Button
                            onClick={() => {
                                handleComment(newComment, post.postId).finally(() => {
                                    setNewComment('');
                                    setShowAddComment(false);
                                });
                            }}
                        >
                            Post
                        </Button>
                    </div>
                ) : null}
                {comments.length > 0 ? (
                    <AnimatePresence>
                        <div className="mt-2 w-full">
                            <h3 className="mb-1 font-semibold">Comments:</h3>
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.commentId}
                                    className="mb-1 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span className="font-semibold">
                                        {users.find((u) => u.userId === comment.userId)?.profile.name || 'Unknown User'}:
                                    </span>{' '}
                                    {comment.content}
                                    <span className="ml-2 text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                ) : null}
            </CardFooter>
        </Card>
    );
};

export default PostDisplay;
