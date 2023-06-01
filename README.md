# Garrio Calendar

This is the monorepository for Garrio Calendar

# Tooling

## Monorepository
Garrio Calendar utilize `yarn` to manage its mono repo

Projects within `backend`, `frontend` and `shared` will be automically added to workspace

## Common rule

- Frontend code, add to `frontend`
- Backend code, add to `backend`
- Shared utilites like `utilities`, `typescript typing`, `tsconfig` etc should be added in `shared` in its corresponding project

## Naming convention and project layout

- Package name (whatever defined in package.json) should be follow format `@<area>/<name>` where area is `backend`, `frontend` etc
- Write a short, good name to reflect what is the library about
- Don't expose multiple entries in a library, it'd rather have multiple directory. For example, `@shared/utils` is not cool. Maybe `@shared/translation` is better
- Shared is normally for cross backend/frontend; as a rule of thumb. Nothing stops you from adding `@backend/utils` and `@frontend/utils`, but you can also add to `shared`, don't too worry about where should it goes
- As we are using `typescript` directly, please NEVER add source under `src` dir, that'll mess up the directory structure on reference

## Power of readme

- README should be kept up-to-date
- README should be added where it is needed. Feel free to add README to projects

## Commits

Please refer to [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
Try to group commit in a meaningful way, and not to mix up intention. For example, feature generally should not including refactoring/chore. Bugfix should not include new feature etc

Rule of thumb
- `feat: [Ticket refer] description of feature goes here` 
- `fix: [Ticket refer] description of bugfix goes here`
- `chore: [Ticket refer] update CI/CD, docs etc` 