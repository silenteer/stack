# Frontend rules

1. Framework, next.js is the only option, we don't have any plan to adopt any other framework
2. Translation is upmost important, keep that in mind
3. Test is important and `vitest` is the only option to choose, don't try to adopt any other test framework

## Common rules

- Whatever in `pages` for nextjs is supposed to be stateful. Most components is supposed to be stateless
- Use children prop pattern where possible [ref](https://www.craftvalue.io/blog/react-children-prop-pattern)

## Components, laying out, CSS frameworks

To bring flexibility along with good DX, we are going to use those technologies

- Radix UI, in combination with `shadcn/ui`. Radix UI doesn't come with styling and shadcn/ui is pretty much a pretty setup tailwind components. The combo gives us the control over what provided
- [`cva`](https://cva.style/docs) brings a nice selection to control branch control in styling
- `tailwind` and CSS Module will cover the rest of styling

## Rule of thumb in styling

1. Never pass around tailwind classes for styling. Never accept raw className as component parameter. Props to be exposed should explain what it does
2. In short, tailwind classes appear in only 2 places
   1. Inside the component
   2. Inside layout control component (grid, stack etc)
   3. Worst case scenario, within the `pages` of nextjs
3. Ad-hoc value for tailwind is strictly prohibited in pages, may (or may not) happen within component