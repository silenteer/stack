## Todo example

The todo example demonstrates few patterns

### Type discrimination
How to take advantage of Typescript type discrimination to avoid impossible states.

### react-query
How to use react-query to reduce amount of useEffect with most of its extra functionalities.
The goal is to organize codes, make it effective and slight cleaner

### context to serve you
In a medium complexity, it is quite usual to have interaction between screen and its nested.
Depends on the situation, the context usage can reduce the code verbosity

## FAQ
In a few places, it seems like the component is unnecessary extracted?
- The type discrimination doesn't work all the time, sometime it is more verbose to get the type right

Isn't it more complicated to test using Context?
- There's no perfect setting to test React Components (with remote server access) at the time being. The use of Context and React-Query is actually helping the testing a little bit, thought, the best way to test is trying our best to separate between logic and UI

## How to get started?

- `docker run -ti -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust --restart unless-stopped -d postgres:alpine` The config is set by default for this running
- `yarn install`
- `yarn workspace @stack/prisma generate`
- `yarn workspace @stack/prisma migrate:dev`
- `yarn workspace todo-app dev` then the server should be started at port 3000