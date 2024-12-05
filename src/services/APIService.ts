import { VITE_APP_BACKEND_URL } from '@configs';
import { iPost } from '@models/Post';
import { iUser } from '@models/User';
import AuthManager from '@services/AuthManager';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const ENDPOINTS = {
    LOGIN: `${VITE_APP_BACKEND_URL}/login`,
    REFRESH_TOKEN: `${VITE_APP_BACKEND_URL}/refresh`,
    LOGOUT: `${VITE_APP_BACKEND_URL}/logout`,
};

class APIService {
    private routes = {
        getMostLikedPosts: `${VITE_APP_BACKEND_URL}/posts?limit=10`,
        likePost: (post_id: string) => `${VITE_APP_BACKEND_URL}/posts/:post_id/likes`.replace(':post_id', post_id),
        addCommentToPost: (post_id: string) =>
            `${VITE_APP_BACKEND_URL}/posts/:post_id/comments`.replace(':post_id', post_id),
        users: `${VITE_APP_BACKEND_URL}/users`,
        getUserFeed: `${VITE_APP_BACKEND_URL}/users/me/feed?limit=10`,
        followThisUser: (user_id: string) =>
            `${VITE_APP_BACKEND_URL}/users/:user_id/follow`.replace(':user_id', user_id),
        postComments: (postId: string) => `${VITE_APP_BACKEND_URL}/posts/${postId}/comments`,
    };

    private injectResponseMessageToError = (error: AxiosError) => {
        if (!error.response) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (error.response?.data as any).message;
        if (typeof message === 'string') error.message = message;
    };

    private fetch = async ({
        url,
        method,
        data,
        _retry,
    }: {
        url: string;
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        data?: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [_: string]: any;
        };
        _retry?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }): Promise<{ [key: string]: any }> => {
        console.log('Checking token expiration');
        if (AuthManager.isAccessTokenExpired()) {
            console.log('Token is expired');
            await this.tryRefreshingTokenOrLogoutAndThrow();
        }
        try {
            console.log('Fetching the API...', url);
            const result = await axios(url, {
                method,
                headers: {
                    ...(AuthManager.authHeader() || {}),
                },
                data,
            });
            console.log('Fetch succeeded', url);
            return result.data;
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) throw error;
            if (error.response && error.response.status === 401) {
                console.log('Received Unauthorized error from server');
                if (_retry) {
                    console.log('The request has already been retried, so we logout');
                    await this.logout();
                    throw new Error('errors:token_expired');
                } else {
                    console.log('Trying to refresh the access token');
                    await this.tryRefreshingTokenOrLogoutAndThrow();
                    console.log('Retrying original request with new access token', url);
                    const retryData = await this.fetch({
                        url,
                        method,
                        data,
                        _retry: true,
                    });

                    console.log('Retry succeeded!', url);
                    return retryData;
                }
            } else {
                this.injectResponseMessageToError(error);
                throw error;
            }
        }
    };

    private tryRefreshingTokenOrLogoutAndThrow = async () => {
        try {
            console.log('Refreshing token');
            await this.refreshToken();
            console.log('Token successfully refreshed');
        } catch (error) {
            console.log('Error refreshing token', error);
            console.log('Logging out user.');
            // error refreshing token
            await this.logout();
            throw new Error('errors:token_expired');
        }
    };

    public refreshToken = async () => {
        const refreshToken = AuthManager.getRefreshToken();
        const {
            data: { accessToken },
        } = await axios({
            url: ENDPOINTS.REFRESH_TOKEN,
            method: 'post',
            data: { token: refreshToken },
        });
        AuthManager.setAccessToken(accessToken);
    };

    public logout = async () => {
        AuthManager.logout();
        const refreshToken = AuthManager.getRefreshToken();
        if (refreshToken) {
            return axios({
                url: ENDPOINTS.LOGOUT,
                method: 'post',
                data: { token: refreshToken },
            });
        }
        return null;
    };

    public login = async (handle: string, password: string) => {
        const response = await axios.post(ENDPOINTS.LOGIN, { handle, password });
        const { accessToken, refreshToken, message } = response.data;
        toast(message, { type: 'success' });
        AuthManager.login({ accessToken, refreshToken });
    };

    public register = async (handle: string, password: string, email: string) => {
        const response = await axios.post(`${VITE_APP_BACKEND_URL}/register`, { handle, password, email });
        const { accessToken, refreshToken, message } = response.data;
        toast(message, { type: 'success' });
        AuthManager.login({ accessToken, refreshToken });
    };

    public getUserInfo = async (): Promise<iUser> => {
        const { profile } = await this.fetch({
            url: `${VITE_APP_BACKEND_URL}/users/me`,
            method: 'get',
        });
        return this.processUser(profile);
    };

    public async getUsers(): Promise<Array<iUser>> {
        const { users } = await this.fetch({
            url: this.routes.users,
            method: 'get',
        });
        if (users instanceof Array) {
            return users.map((user: unknown) => this.processUser(user));
        }
        return [];
    }

    public async getMostLikedPosts(
        limit: number = 10,
        skip: number = 0,
        period: 'day' | 'week' | 'month' | 'year' = 'day',
    ): Promise<Array<iPost>> {
        const { posts } = await this.fetch({
            url: this.routes.getMostLikedPosts,
            method: 'get',
            data: {
                limit,
                skip,
                period,
            },
        });
        if (posts instanceof Array) {
            return posts.map((post: unknown) => this.processPost(post));
        }
        return [];
    }

    public async getUserFeed(): Promise<Array<iPost>> {
        const { posts } = await this.fetch({
            url: this.routes.getUserFeed,
            method: 'get',
        });
        if (posts instanceof Array) {
            return posts.map((post: unknown) => this.processPost(post));
        }
        return [];
    }

    public async followUser(userToFollow: string): Promise<void> {
        try {
            const { message } = await this.fetch({
                url: this.routes.followThisUser(userToFollow),
                method: 'post',
            });

            toast(message, { type: 'success' });
        } catch (error: any) {
            toast(error?.message || 'Failed to follow user', { type: 'error' });
            throw error;
        }
    }

    public async likePost(postId: string): Promise<iPost['likes']> {
        try {
            const { likes, message } = await this.fetch({
                url: this.routes.likePost(postId),
                method: 'post',
            });
            toast(message, { type: 'success' });
            return likes;
        } catch (error: any) {
            toast(error?.message || 'Failed to like post', { type: 'error' });
            throw error;
        }
    }

    public async addCommentToPost(post_id: string, content: string): Promise<void> {
        try {
            const { message } = await this.fetch({
                url: this.routes.addCommentToPost(post_id),
                method: 'post',
                data: { content },
            });
            toast(message, { type: 'success' });
        } catch (error: any) {
            toast(error?.message || 'Failed to add comment', { type: 'error' });
            throw error;
        }
    }

    public async createPost(content: string): Promise<void> {
        try {
            const { message } = await this.fetch({
                url: `${VITE_APP_BACKEND_URL}/posts`,
                method: 'post',
                data: { content },
            });
            toast(message, { type: 'success' });
        } catch (error: any) {
            toast(error?.message || 'Failed to create post', { type: 'error' });
            throw error;
        }
    }

    public async getPostComments(postId: string): Promise<iPost['comments']> {
        try {
            const { comments } = await this.fetch({
                url: this.routes.postComments(postId),
                method: 'get',
            });
            return comments.map((comment: unknown) => this.processComment(comment)) ?? [];
        } catch (error: any) {
            toast(error?.message || 'Failed to get comments', { type: 'error' });
            throw error;
        }
    }

    private processComment(comment: any) {
        return {
            ...comment,
            createdAt: new Date(comment.createdAt),
        };
    }

    private processPost(post: any): iPost {
        return {
            ...post,
            createdAt: new Date(post.createdAt),
            comments: post.comments.map((comment: any) => this.processComment(comment)),
        };
    }

    private processUser(user: any) {
        return {
            ...user,
            createdAt: new Date(user.createdAt),
        };
    }
}

export default new APIService();
