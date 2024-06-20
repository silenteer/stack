import { Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Stages, trafficLightMachine } from "~/stato/traffic-light";

export default function Page() {
  const [startWith, setStartWith] = useState<Stages>({
    name: 'red',
    context: undefined
  })

  return <>
    <TrafficLightContainer startWith={startWith} />
    <Flex gap="2" mt="4">
      <Button onClick={() => setStartWith({
        name: 'yellow',
        context: { next: 'red' }
      })}>yellow to red</Button>

      <Button onClick={() => setStartWith({
        name: 'green',
        context: undefined
      })}>Green</Button>
    </Flex>
  </>
}

function TrafficLightContainer({ startWith }: { startWith: Stages }) {
  return <trafficLightMachine.Provider
    initialState={startWith}
    params={{
      delay: 1000
    }}
  >
    <TrafficLight />
  </trafficLightMachine.Provider>
}

function TrafficLight() {
  const currentState = trafficLightMachine.useCurrentState()
  const transition = trafficLightMachine.useTransitioning()
  const dispatch = trafficLightMachine.useDispatch()
  const dispatchTarget = currentState.name !== 'yellow' ? 'to-yellow' : 'to-red-or-green'

  return <>
    {transition && <div>Transitioning</div>}
    <div>
      <Button onClick={() => dispatch(dispatchTarget)}>{currentState.name} {"->"}</Button>
    </div>
  </>
}

