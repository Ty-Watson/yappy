//4:47:19
export function chatHrefConstructor(id1, id2) {
    const sortedIds = [id1, id2].sort()
    return `${sortedIds[0]}--${sortedIds[1]}`
  }