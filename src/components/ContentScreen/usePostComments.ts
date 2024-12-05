import { iPost } from '@models/Post';
import APIService from '@services/APIService';
import { useCallback, useEffect, useState } from 'react';

export const usePostComments = (postId: iPost['postId']) => {
    const [comments, setComments] = useState<iPost['comments']>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        const resp = await APIService.getPostComments(postId);
        setComments(resp);
        setLoading(false);
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return { comments, loading };
};
