import { iUser } from '@models/User';

export interface iComment {
    commentId: string;
    userId: iUser['userId'];
    content: string;
    createdAt: Date;
}

type CommentSection = Array<iComment>;

export interface iPost {
    postId: string;
    userId: iUser['userId'];
    content: string;
    likes: string[];
    comments: CommentSection;
    createdAt: Date;
}
