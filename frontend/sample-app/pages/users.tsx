import { client } from '@/trpc'

export default function Users() {
  const users = client.user.list.useQuery()

  return <div>{users.data ?? []}</div>
}