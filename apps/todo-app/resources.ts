import type { Todo, User } from "@stack/prisma"

export const createUser = async (user: Pick<User, 'username'>) => {
  return await fetch('/api/users', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(user)
  }).then(async r => await r.json() as User)
}

export const updateUser = async (user: User) => {
  return await fetch('/api/users', {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(user)
  }).then(async r => await r.json() as User)
}

export const deleteUser = async (userId: string) => {
  return await fetch('/api/users', {
    method: "DELETE",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ userId })
  }).then(async r => await r.json() as User)
}

export const getUsers = async () => {
  return await fetch('/api/users', {
    headers: {
      "content-type": "application/json"
    }
  })
    .then(async r => await r.json() as User[])
}

export const getTodos = async (userId: string) => {
  return await fetch(`/api/todos?userId=${userId}`, {
    headers: {
      "content-type": "application/json"
    }
  })
  .then(async r => await r.json() as Todo[])
}

export const addTodo = async (userId: string, content: string) => {
  return await fetch('/api/todos', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ userId, content })
  })
}

export const updateTodo = async (userId: string, { todoId, content, done }: {
  todoId: string,
  content?: string,
  done?: boolean
}) => {
  return await fetch('/api/todos', {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ 
      userId, 
      todoId,
      done, 
      content 
    })
  })
}