const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN



export async function fetchRedis(command, ...args) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
  console.log(commandUrl)

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(data)
  return data.result
}