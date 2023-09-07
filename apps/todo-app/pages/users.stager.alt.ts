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

export const { useLifecycle, useListen, useStage, dispatch, reset, transitioningFrom } = create<Stages>()
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
    async execution(ctx) {
      return { stage: 'creating', context: { 
        ...ctx.stage.context, 
        creatingUser: { username: ''}
      } 
    }}
  })
  .transition({
    name: 'updateCreatingField',
    from: 'creating',
    to: 'creating',
    async execution(ctx, field: keyof Pick<User, 'username'>, value: User[typeof field]) {
      const creatingUser = ctx.stage.context.creatingUser
      creatingUser[field] = value

      return { stage: 'creating', context: { ...ctx.stage.context, creatingUser}}
    }
  })
  .transition({
    name: 'createUser',
    from: 'creating',
    to: ['creating', 'default'],
    async execution(ctx) {
      if (ctx.stage.context.creatingUser.username.trim().length == 0) {
        return { stage: 'creating', context: ctx.stage.context }
      }

      await createUser({ username: ctx.stage.context.creatingUser.username})
      return { stage: 'default', context: { users: ctx.stage.context.users, refetch: true }}
    }
  })
  .transition({
    name: 'toEditing',
    from: 'default',
    to: 'editing',
    execution(ctx, user: User) {
      return { stage: 'editing', context: { ...ctx.stage.context, editingUser: user } }
    }
  })
  .transition({
    name: 'updateEditingField',
    from: 'editing',
    to: 'editing',
    async execution(ctx, field: keyof Pick<User, 'username'>, value: User[typeof field]) {
      const editingUserUser = ctx.stage.context.editingUser
      editingUserUser[field] = value

      return { stage: 'editing', context: { ...ctx.stage.context, editingUserUser}}
    }
  })
  .transition({
    name: 'updateUser',
    from: 'editing',
    to: ['editing', 'default'],
    async execution(ctx) {
      const updatingUser = ctx.stage.context.editingUser
      if (updatingUser.username.trim().length === 0) {
        return { stage: 'editing', context: ctx.stage.context }
      }

      // can catch here to display error message, client side validation
      await updateUser(updatingUser)
      // can catch here to display error message, server side validation
      return { stage: 'default', context: { users: ctx.stage.context.users, refetch: true }}
    }
  })
  .transition({
    name: 'toRemoving',
    from: 'default',
    to: 'removing',
    execution(ctx, user: User) {
      return { stage: 'removing', context: { ...ctx.stage.context, deletingUser: user } }
    }
  })
  .transition({
    name: 'removeUser',
    from: 'removing',
    to: 'default',
    async execution(ctx) {
      await new Promise(resolve => {
        setTimeout(() => { resolve(null) }, 1000)
      })
      
      await deleteUser(ctx.stage.context.deletingUser.id)
      return { stage: 'default', context: { users: ctx.stage.context.users, refetch: true }}
    }
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
    execution(ctx) {
      return { stage: 'default', context: ctx.stage.context }
    }
  })
  .build({ initialStage: { stage: 'idle', context: undefined } })