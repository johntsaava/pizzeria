import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "~/styles/index.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
      rel: "stylesheet",
    },
  ];
};

export default function App() {
  return (
    <html lang="en" className="flex min-h-full flex-col">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-grow flex-col text-purple-800 antialiased">
        <header className="p-4">
          <h1 className="text-center text-4xl font-bold">Pizzeria</h1>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
