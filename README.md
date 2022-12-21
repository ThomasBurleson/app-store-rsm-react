# React + Zustand

Visually this SPA is NOT exciting!

Instead, the focus is on the implmentation of Zustand reactive stores within a React application.

## App-Store

The store itself is implemented with Zustand and middleware.

> Middleware is used for devTools, persistence, and computed properties.

- Changes to store state will trigger hooks to remit
  - Supported for both SSR and CSR
  - Selectors will optimize when state changes trigger UI re-renders
- Bi-directional sync to URL (for bookmarks)
- Zustand Middleware:
  - Persists to localstorage
  - Immutable store using ImmerJS
  - Support for Redux Dev Tools

<br/>

## UI Components

<img width="1121" alt="image" src="https://user-images.githubusercontent.com/210413/208952862-ec3debdd-a51f-4af5-9de8-10c20826b894.png">

<br/>

## Zustand Store

<img width="736" alt="image" src="https://user-images.githubusercontent.com/210413/208953646-d8f08102-cd5e-4655-8360-116ddb45f6bd.png">
