import { Button, Dialog, Flex, Select, Table, TextField, Text, Checkbox } from "@radix-ui/themes";
import { addTodo, getTodos, getUsers, updateTodo } from "../resources";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

type TodosController = {
  addElementToSidebar: (element: ReactNode) => void
  removeElementFromSidebar: (element: ReactNode) => void
}

const todosContext = createContext<TodosController>({} as any)

export default function Todos() {
  const [userId, setUserId] = useState<string>('')
  const [extraElements, setExtraElements] = useState<ReactNode[]>([])
  const getUsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  return <>
    <todosContext.Provider value={{
      addElementToSidebar: (element) => {
        setExtraElements((elements) => [...elements, element])
      },
      removeElementFromSidebar: (element) => {
        setExtraElements((elements) => elements.filter(e => e !== element))
      }
    }}>
      <Flex justify='between'>
        <Select.Root onValueChange={setUserId}>
          <Select.Trigger placeholder="Select user" />
          <Select.Content>
            <Select.Item value={''}>Unselect</Select.Item>
            {getUsersQuery.isSuccess &&
              getUsersQuery.data.map(user => {
                return <Select.Item key={user.id} value={user.id}>{user.username}</Select.Item>
              })}
          </Select.Content>
        </Select.Root>
        <Flex>
          {extraElements}
        </Flex>
      </Flex>
      {userId !== '' && <TodoList userId={userId} />}
    </todosContext.Provider>
  </>
}

type ScreenState =
  | { state: 'default', userId: string }
  | { state: 'adding', userId: string }
  | { state: 'editting', userId: string, todoId: string }

type Controller = {
  toDefault: (opts?: { refetch: boolean }) => void
  toAdding: (userId?: string) => void
}

const TodoListContext = createContext<{ screenState: ScreenState, controller: Controller }>({} as any)

const TodoList = ({ userId }: { userId: string }) => {
  const { addElementToSidebar, removeElementFromSidebar } = useContext(todosContext)

  const [screenState, setScreenState] = useState<ScreenState>({ state: 'default', userId })
  const controller = {
    toAdding: (userId) => {
      if (userId) setScreenState({ state: 'adding', userId })
    },
    toDefault: (opts) => {
      setScreenState((state) => {
        return { ...state, state: 'default' }
      })
      opts?.refetch && getTodosQuery.refetch()
    }
  } satisfies Controller

  const getTodosQuery = useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      return await getTodos(userId)
    }
  })

  useEffect(() => {
    const AddButton = <Button onClick={() => controller.toAdding(userId)}>Add</Button>
    addElementToSidebar(AddButton)

    return () => removeElementFromSidebar(AddButton)
  }, [])

  const markTodoDonessMutation = useMutation({
    mutationFn: async ({ userId, todoId, done }: { userId: string, todoId: string, done: boolean }) => {
      return await updateTodo(userId, {
        todoId, done
      })
    },
    onSuccess: (r) => {
      console.log(r)
      getTodosQuery.refetch()
    },
    onError: (e) => console.log(e)
  })

  return <>
    <TodoListContext.Provider value={{ screenState, controller }}>
      {screenState.state === 'adding' && <AddTodoDialog userId={userId} />}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>done</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>content</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {getTodosQuery.isSuccess && getTodosQuery.data.map(todo =>
            <Table.Row key={todo.id}>
              <Table.RowHeaderCell>{todo.id}</Table.RowHeaderCell>
              <Table.Cell>
                <Checkbox
                  mr="1"
                  value={String(todo.done)}
                  onCheckedChange={() => {
                    markTodoDonessMutation.mutate({
                      userId: userId,
                      done: !!!todo.done,
                      todoId: todo.id
                    })
                  }}
                  defaultChecked={!!todo.done}
                /></Table.Cell>
              <Table.Cell>{todo.content}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </TodoListContext.Provider>
  </>
}

const AddTodoDialog = ({ userId }: { userId: string }) => {
  const { controller } = useContext(TodoListContext)

  const addTodoMutation = useMutation({
    mutationFn: async ({ userId, content }: { userId: string, content: string }) => {
      return await addTodo(userId, content)
    },
    onSuccess: async (r) => {
      controller.toDefault({ refetch: true })
    }
  })

  const [content, setContent] = useState<string>("")

  return <>
    <Dialog.Root open={true}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Add an todo item</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Here goes your todo
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter username"
            />
          </label>
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Button onClick={() => controller.toDefault({ refetch: false })} variant="soft" color="gray">
            Cancel
          </Button>
          <Button
            disabled={addTodoMutation.isLoading}
            onClick={() => addTodoMutation.mutate({ userId, content })}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  </>
}