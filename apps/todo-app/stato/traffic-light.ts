import { createMachine, create, State } from "@silenteer/stato"

const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

export type Stages =
  | State<{ name: 'red', context: undefined }>
  | State<{ name: 'yellow', context: { next: 'red' | 'green' } }>
  | State<{ name: 'green', context: undefined }>

const trafficLightTemplate = create<Stages>()
  .params<{ delay: number }>()
  .transition({
    name: 'to-yellow',
    from: ['red', 'green'],
    to: 'yellow',
    async execution({ params, name }) {
      return { name: 'yellow', context: { next: name === 'red' ? 'green' : 'red' } }
    }
  })
  .transition({
    name: 'to-red-or-green',
    from: 'yellow',
    to: ['red', 'green'],
    async execution({ params, context }) {
      return { name: context.next, context: undefined }
    }
  })
  .on(['green', 'red', 'yellow'], async ({ name, params }, dispatch) => {
    await sleep(params.delay)
    if (name === 'yellow') {
      dispatch('to-red-or-green')
    } else {
      dispatch('to-yellow')
    }
  })
  .build()

export const trafficLightMachine = createMachine(trafficLightTemplate)