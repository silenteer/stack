import { User } from "@stack/prisma"
import { Stage, create } from "use-stager"
import { createUser, getUsers, updateUser, deleteUser } from "../resources";

type DefaultContext = {
  users: Array<User>
}

type Stages =
  | Stage<{ stage: 'idle', context: undefined }>
  | Stage<{ stage: 'default', context: DefaultContext & { refetch?: boolean } }>
  | Stage<{ stage: 'creating', context: DefaultContext & { creatingUser: Pick<User, 'username'> } }>
  | Stage<{ stage: 'editing', context: DefaultContext & { editingUser: User } }>
  | Stage<{ stage: 'removing', context: DefaultContext & { deletingUser: User } }>

export const { withStager, useListen, useStage, dispatch, useTransition } = create<Stages>()
  .transition({
    name: 'toDefault',
    from: ['idle', 'default'],
    to: 'default',
    async execution() {
      const users = await getUsers()
      return { stage: 'default', context: { users }}
    }
  })
  .transition({
    name: 'toCreating',
    from: 'default',
    to: 'creating',
    async execution({ context }) {
      return { stage: 'creating', context: { 
        ...context, 
        creatingUser: { username: ''}
      } 
    }}
  })
  .transition({
    name: 'updateCreatingField',
    from: 'creating',
    to: 'creating',
    async execution({ context }, field: keyof Pick<User, 'username'>, value: User[typeof field]) {
      const creatingUser = context.creatingUser
      creatingUser[field] = value

      return { stage: 'creating', context: { ...context, creatingUser}}
    }
  })
  .transition({
    name: 'createUser',
    from: 'creating',
    to: ['creating', 'default'],
    async execution({ context }) {
      if (context.creatingUser.username.trim().length == 0) {
        return { stage: 'creating', context }
      }

      await createUser({ username: context.creatingUser.username})
      return { stage: 'default', context: { users: context.users, refetch: true }}
    }
  })
  .transition({
    name: 'toEditing',
    from: 'default',
    to: 'editing',
    execution({ context }, user: User) {
      return { stage: 'editing', context: { ...context, editingUser: user } }
    }
  })
  .transition({
    name: 'updateEditingField',
    from: 'editing',
    to: 'editing',
    async execution({ context }, field: keyof Pick<User, 'username'>, value: User[typeof field]) {
      const editingUserUser = context.editingUser
      editingUserUser[field] = value

      return { stage: 'editing', context: { ...context, editingUserUser}}
    }
  })
  .transition({
    name: 'updateUser',
    from: 'editing',
    to: ['editing', 'default'],
    async execution({ context }) {
      const updatingUser = context.editingUser
      if (updatingUser.username.trim().length === 0) {
        return { stage: 'editing', context: context }
      }

      // can catch here to display error message, client side validation
      await updateUser(updatingUser)
      // can catch here to display error message, server side validation
      return { stage: 'default', context: { users: context.users, refetch: true }}
    }
  })
  .transition({
    name: 'toRemoving',
    from: 'default',
    to: 'removing',
    execution({ context }, user: User) {
      return { stage: 'removing', context: { ...context, deletingUser: user } }
    }
  })
  .transition({
    name: 'removeUser',
    from: 'removing',
    to: 'default',
    async execution({ context }) {
      await new Promise(resolve => {
        setTimeout(() => { resolve(null) }, 1000)
      })
      
      await deleteUser(context.deletingUser.id)
      return { stage: 'default', context: { users: context.users, refetch: true }}
    }
  })
  .on('idle', async (_, dispatch) => {
    dispatch('toDefault')
  })
  .on('default', async ({ context }) => {
    if (context.refetch) {
      dispatch('toDefault')
    }
  })
  .transition({
    name: 'cancel',
    from: ['creating', 'editing', 'removing'],
    to: 'default',
    execution({ context }) {
      return { stage: 'default', context: context }
    }
  })
  .build({ initialStage: { stage: 'idle', context: undefined } })