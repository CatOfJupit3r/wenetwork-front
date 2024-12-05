export interface iUserProfile {
    handle: string
    email: string
    name: string
    bio: string
    following: string[]
    followers: number
    saved: string[]
    birthdate: Date
    avatar: string
    cover: string
}

export interface iUser {
    userId: string
    createdAt: Date
    profile: iUserProfile
}
