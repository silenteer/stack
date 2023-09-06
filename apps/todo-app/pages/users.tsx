import { AlertDialog, Button, Dialog, Flex, Switch, Table, Text, TextField } from "@radix-ui/themes";
import type { User } from "@stack/prisma";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { createUser, getUsers, updateUser, deleteUser } from "../resources";

import { useStage, dispatch, useListen } from "./users.stager";

export default function Users() {
  const getUsersQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getUsers
  })

  const { stage, context } = useStage()
  useListen('default', ({ context }) => {
    if (context?.refetch) getUsersQuery.refetch()
  })

  return <>
    <Flex direction="row-reverse">
      <Button onClick={() => dispatch('toCreating')}>Create user</Button>
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
          && getUsersQuery.data.map(user => <>
            <Table.Row key={user.id}>
              <Table.RowHeaderCell>{user.id}</Table.RowHeaderCell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button
                    variant="outline"
                    color="blue"
                    onClick={(e) => {
                      dispatch('toEditing', user)
                    }}
                  >Edit</Button>
                  {!user.isDeteled && <Button
                    variant="outline"
                    color="red"
                    onClick={(e) => {
                      dispatch('toRemoving', user)
                    }}
                  >Delete</Button>}
                </Flex>
              </Table.Cell>
            </Table.Row>
          </>)}
      </Table.Body>
    </Table.Root>

    {stage === 'creating' && <CreateUserDialog />}
    {stage === 'editing' && <EditUserDialog {...context.editingUser} />}
    {stage === 'removing' && <RemoveUserDialog {...context.deletingUser} />}
  </>
}

const CreateUserDialog = () => {
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (r) => { await dispatch('finish') }
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
          <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
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
  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (r) => { await dispatch('finish') }
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
          <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
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
  const removeUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await dispatch('finish')
    }
  })

  return <AlertDialog.Root open>
    <AlertDialog.Content style={{ maxWidth: 450 }}>
      <AlertDialog.Title>Revoke access</AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure to remove {user.username}? This action cannot be undone.
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
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