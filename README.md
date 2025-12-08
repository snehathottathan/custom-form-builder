This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
# or
bun install
bun dev

```
Open http://localhost:3000 in your browser. The page will auto-update as you edit files.


## Project Structure

app/ – Next.js App Router pages and components.

components/ – React components for the form builder, including:

FieldWrapper – Wraps each form field with drag-and-drop and remove functionality.

SortableFieldItem – Handles sortable behavior for fields.

FieldToolbar, FieldConfigPanel, LivePreview – UI panels for editing and previewing forms.

redux/ – Redux slices and store for managing form builder state.

hooks/ – Custom hooks, e.g., useLocalStorage for saving forms.

styles/ – SCSS modules for styling the builder UI.

## Features

Drag-and-drop form fields to reorder dynamically using @dnd-kit.

Select a field to configure its label, type, and options.

Lazy-loading of complex components for performance.

Preview form live as you build it.

Persist form schema in local storage.

Remove fields with confirmation prompts.

## Technologies used

Next.js
 – React framework for production.

React Redux
 – State management.

@dnd-kit
 – Drag-and-drop functionality.

SCSS Modules
 – Component-level styling.

React Lazy + Suspense
 – Code splitting for performance.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# custom-form-builder
