import { fetchRedis } from "./redis"
//4:31:52
export const getFriendsByUserId = async (userId) => {
    //retrieve friends for current user
    const friendIds = await fetchRedis('smembers', `user:${userId}:friends`)

    const friends = await Promise.all(
        friendIds.map(async (friendId) => {
            const friend = await fetchRedis('get', `user:${friendId}`)
            const parsedFriend = JSON.parse(friend)
            return parsedFriend
        })
    )

    return friends;
}