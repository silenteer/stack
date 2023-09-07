import { AlertDialog, Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { withStager, useStage, dispatch, reset, transitioningFrom } from "./users.stager.alt";

export default withStager(function Users() {
  const { stage, context } = useStage()

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
        {stage !== 'idle' && context.users.map(user => <>
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

    <CreateUserDialog />
    <EditUserDialog />
    <RemoveUserDialog />
  </>
})

const CreateUserDialog = () => {
  const { stage, context } = useStage()
  if (stage === 'creating') {
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
                value={context.creatingUser.username}
                onChange={(e) => dispatch('updateCreatingField', 'username', e.target.value)}
                placeholder="Enter username"
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
              Cancel
            </Button>
            <Button
              disabled={transitioningFrom('creating')}
              onClick={() => dispatch('createUser')}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  }
  return null
}

const EditUserDialog = () => {
  const { stage, context } = useStage()

  if (stage === 'editing') {
    return <>
      <Dialog.Root open>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Edit user</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Change information of {context.editingUser.username}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Input
                value={context.editingUser.username}
                onChange={(e) => dispatch('updateEditingField', 'username', e.target.value)}
                placeholder="Enter username"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
              Cancel
            </Button>
            <Button
              disabled={transitioningFrom('editing')}
              onClick={() => dispatch('updateUser')}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  }
  return null
}

const RemoveUserDialog = () => {
  const { stage, context } = useStage()
  if (stage === 'removing') {
    return <AlertDialog.Root open>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Revoke access</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure to remove {context.deletingUser.username}? This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Button onClick={() => dispatch('cancel')} variant="soft" color="gray">
            Cancel
          </Button>
          <Button
            disabled={transitioningFrom('removing')}
            onClick={() => dispatch('removeUser')}
            variant="solid" color="red">
            Remove {context.deletingUser.username}
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  } 
  return null
}