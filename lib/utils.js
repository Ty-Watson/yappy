//4:47:19
import { twMerge } from "tailwind-merge"
import clsx from "clsx"

export function chatHrefConstructor(id1, id2) {
    const sortedIds = [id1, id2].sort()
    return `${sortedIds[0]}--${sortedIds[1]}`
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
//pusher does not allow : in request so we are replacing with __
export function toPusherKey(key){
  return key.replace(/:/g, '__')
}