import {FormEvent, useState} from 'react'
import { ButtonWithPromise } from "@components/ui/ButtonWithPromise"
import { Textarea } from "@components/ui/textarea"
import { Avatar, AvatarFallback } from "@components/ui/avatar"
import APIService from "@services/APIService";
import {usePostsContext} from "@context/PostsContext";

const CreatePost = () => {
    const [content, setContent] = useState('')
    const {addNewPost} = usePostsContext()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        await addNewPost(content)
        setContent('')
    }

    return (
        <div className="p-4 flex gap-2 flex-col">
            <h2 className="text-xl font-semibold">Create a post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Textarea
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 resize-none border-none bg-background focus-visible:ring-0"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end">
                    <ButtonWithPromise
                        type="submit"
                        onClickAsync={handleSubmit}
                        disabled={!content.trim()}
                        className="px-6"
                    >
                        Post
                    </ButtonWithPromise>
                </div>
            </form>
        </div>
    )
}

export default CreatePost