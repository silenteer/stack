import { Button } from "@frontend/ui/button"

import { Terminal, Waves } from "lucide-react"
 
import { Alert, AlertDescription, AlertTitle } from "@frontend/ui/alert"
 
function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}

export default function Home() {
  return (
    <>
      <AlertDemo />
    </>
  );
}
