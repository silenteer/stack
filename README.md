# Silenteer stack

This repository is the mono repository for the Silentium node.js stack.

# Tooling

## Monorepository
Stack utilizes `yarn` to manage its mono repo and [taskdev](https://taskfile.dev/) to organize operations

Projects within `backend`, `frontend`, and `shared` will be automatically added to the workspace.

## Common rule

- Frontend code, add to `frontend`
- Backend code, add to `backend`
- Shared utilities like `utilities`, `typescript typing`, `tsconfig` etc. should be added in `shared` in its corresponding project

## Naming convention and project layout

- Package name (whatever defined in package.json) should follow format `@<area>/<name>` where area is `backend`, `frontend` etc
- Write a short, good name to reflect what the library is about
- Don't expose multiple entries in a library; it'd rather have multiple directories. For example, `@shared/utils` is not cool. Maybe `@shared/translation` is better
- Shared is normally for cross backend/frontend; as a rule of thumb. Nothing stops you from adding `@backend/utils` and `@frontend/utils`, but you can also add to `shared`, don't too worry about where should it goes
- As we are using `typescript` directly, please NEVER add source under `src` dir; that'll mess up the directory structure on reference

## Power of README

- README should be kept up-to-date
- README should be added where it is needed. Feel free to add README to projects

## Commits

Please refer to [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
Try to group commits meaningfully and not mix up the intention. For example, features generally should not include refactoring/chores. Bugfix should not include new features etc

Rule of thumb
- `feat: [Ticket refer] description of feature goes here` 
- `fix: [Ticket refer] description of bugfix goes here`
- `chore: [Ticket refer] update CI/CD, docs etc` 

# Getting started

## Install necessary tools

- Install vscode
- Install taskfile
- Install nodejs version >= 16
- Yarn 2 is needed
- Install docker and docker compose

## Start dev flow

- `yarn install`
- `task dev:prep` to install yarn and run upfront tasks
- `task dev:up` to start development