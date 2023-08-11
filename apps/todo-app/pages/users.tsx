import { AlertDialog, Button, Dialog, Flex, Switch, Table, Text, TextField } from "@radix-ui/themes";
import type { User } from "@stack/prisma";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { createUser, getUsers, updateUser, deleteUser } from "../resources";

type ScreenState =
  | { state: 'default' }
  | { state: 'creating' }
  | { state: 'editing', user: User }
  | { state: 'removing', user: User }

type Controller = {
  state: ScreenState
  toCreate: () => void
  toEdit: (user: User) => void
  toDefault: (param: { refetch?: boolean }) => void
  toRemove: (user: User) => void
}

const ControllerContext = React.createContext<Controller>({} as any)

export default function Users() {
  const getUsersQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getUsers
  })

  const [screenState, setScreenState] = useState<ScreenState>({ state: 'default' })


  return <>
    <ControllerContext.Provider value={{
      state: screenState,
      toCreate: () => setScreenState({ state: 'creating' }),
      toEdit: (user) => setScreenState({ state: 'editing', user }),
      toDefault: ({ refetch }) => {
        setScreenState({ state: 'default' })
        refetch && getUsersQuery.refetch()
      },
      toRemove: (user) => {
        setScreenState({ state: 'removing', user })
      }
    }}>
      <ControllerContext.Consumer>
        {({ state, toCreate, toEdit, toRemove }) => <>
          <Flex direction="row-reverse">
            <Button onClick={() => toCreate()}>Create user</Button>
          </Flex>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>username</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {getUsersQuery.isSuccess
                ? getUsersQuery.data.map(user => <>
                  <Table.Row key={user.id}>
                    <Table.RowHeaderCell>{user.id}</Table.RowHeaderCell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>
                      <Flex gap="2">
                      <Button 
                        variant="outline" 
                        color="blue"
                        onClick={(e) => {
                          toEdit(user)
                        }}
                      >Edit</Button>
                      {!user.isDeteled && <Button 
                        variant="outline" 
                        color="red"
                        onClick={(e) => {
                          toRemove(user)
                        }}
                      >Delete</Button>}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                </>)
                : undefined}
            </Table.Body>
          </Table.Root>

          {screenState.state === 'creating' && <CreateUserDialog />}
          {screenState.state === 'editing' && <EditUserDialog {...screenState.user} />}
          {screenState.state === 'removing' && <RemoveUserDialog {...screenState.user} />}
        </>}
      </ControllerContext.Consumer>
    </ControllerContext.Provider>
  </>
}

const CreateUserDialog = () => {
  const controller = useContext(ControllerContext)

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (r) => {
      controller.toDefault({ refetch: true })
    }
  })

  const [username, setUsername] = useState<string>("")

  return <>
    <Dialog.Root open={true}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Create user</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create your first user
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </label>
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Button onClick={() => controller.toDefault({ refetch: false })} variant="soft" color="gray">
            Cancel
          </Button>
          <Button
            disabled={createUserMutation.isLoading}
            onClick={() => createUserMutation.mutate({ username })}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  </>
}

const EditUserDialog = (user: User) => {
  const controller = useContext(ControllerContext)

  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (r) => {
      controller.toDefault({ refetch: true })
    }
  })

  const [username, setUsername] = useState<string>(user.username)

  return <>
    <Dialog.Root open>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit user</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Change information of {user.username}
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Button onClick={() => controller.toDefault({ refetch: false })} variant="soft" color="gray">
            Cancel
          </Button>
          <Button
            disabled={editUserMutation.isLoading}
            onClick={() => editUserMutation.mutate({ ...user, username })}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  </>
}

const RemoveUserDialog = (user: User) => {
  const controller = useContext(ControllerContext)
  const removeUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      controller.toDefault({ refetch: true })
    }
  })

  return <AlertDialog.Root open>
    <AlertDialog.Content style={{ maxWidth: 450 }}>
      <AlertDialog.Title>Revoke access</AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure to remove {user.username}? This action cannot be undone.
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <Button onClick={() => controller.toDefault({ refetch: false })} variant="soft" color="gray">
          Cancel
        </Button>
        <Button 
          disabled={removeUserMutation.isLoading} 
          onClick={() => removeUserMutation.mutate(user.id)}
          variant="solid" color="red">
          Remove {user.username}
        </Button>
      </Flex>
    </AlertDialog.Content>
  </AlertDialog.Root>
}