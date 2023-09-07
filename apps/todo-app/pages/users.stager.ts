import { User } from "@stack/prisma"
import { Stage, create } from "use-stager"

type Stages =
  | Stage<{ stage: 'default', context: undefined | { refetch: true } }>
  | Stage<{ stage: 'creating', context: undefined }>
  | Stage<{ stage: 'editing', context: { editingUser: User } }>
  | Stage<{ stage: 'removing', context: { deletingUser: User } }>

export const { withStager, useListen, useStage, dispatch } = create<Stages>()
  .transition({
    name: 'toCreating',
    from: 'default',
    to: 'creating',
    execution() {
      return { stage: 'creating', context: undefined }
    }
  })
  .transition({
    name: 'toEditing',
    from: 'default',
    to: 'editing',
    execution(ctx, user: User) {
      return { stage: 'editing', context: { editingUser: user } }
    }
  })
  .transition({
    name: 'toRemoving',
    from: 'default',
    to: 'removing',
    execution(ctx, user: User) {
      return { stage: 'removing', context: { deletingUser: user } }
    }
  })
  .transition({
    name: 'finish',
    from: ['creating', 'editing', 'removing'],
    to: 'default',
    execution(ctx) {
      return { stage: 'default', context: { refetch: true } }
    }
  })
  .transition({
    name: 'cancel',
    from: ['creating', 'editing', 'removing'],
    to: 'default',
    execution(ctx) {
      return { stage: 'default', context: undefined }
    }
  })
  .on(['default', 'creating', 'removing', 'editing'], (stage) => console.log(stage))
  .build({ initialStage: { stage: 'default', context: undefined } })