import { client } from '@/trpc'

export default function Users() {
  const users = client.user.list.useQuery()

  return <div>{JSON.stringify(users.data) ?? []}</div>
}