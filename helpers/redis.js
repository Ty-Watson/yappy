const upstashRedisRestUrl = 'https://caring-hen-37009.upstash.io'
const authToken = 'AZCRASQgZjBiZTg1OGMtMTA0My00Y2EyLTg1MmMtZjNkMTk2ZTU0OGUzOTQ2ZTVjOWQyOGYxNGE1NmE3NGJiYWRhY2RiOGE1NzY='



export async function fetchRedis(command, ...args) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
  console.log(commandUrl)

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })

  console.log(`RESPONSE: ${response}`)

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`DATA FROM DATABASE: ${data.result}`)
  return data.result
}