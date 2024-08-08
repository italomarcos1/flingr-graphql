import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import { apolloClient } from './lib/apollo.ts'

import { Home } from './pages/Home.tsx';
import { Match } from './pages/Match.tsx';
import { Chat } from './pages/Chat.tsx';

import { AuthProvider } from './context/auth.tsx';
import { NotificationProvider } from './context/notification.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <></>,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "match/:id",
    element: <Match />,
  },
  {
    path: "chat/:id",
    element: <Chat />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
