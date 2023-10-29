import {
  Form, Link,
  Links,
  LiveReload,
  Meta, NavLink, Outlet,
  Scripts,
  ScrollRestoration, useLoaderData, useNavigation,
} from "@remix-run/react";

import appStylesHref from './app.css'
import {ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect} from "@remix-run/node";

import {createEmptyContact, getContacts} from './data'
import {useEffect} from "react";

export const links:LinksFunction = () =>{
  return [
    { rel: "stylesheet", href: appStylesHref },
  ]
}

export const loader = async ({request}:LoaderFunctionArgs) => {

  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const contacts = await getContacts(q)
  return json({contacts, q})
}

export const action = async ({context, params}:ActionFunctionArgs) => {
  const contact = await createEmptyContact()
  console.log("################# ", contact, params)
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function App() {

  const { contacts, q } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  useEffect(() => {

    const qEl = document.getElementById("q")
    if(qEl instanceof HTMLInputElement) {
      qEl.value = q || ''
    }


  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <Form role={'test'}>
          </Form>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                defaultValue={q || ''}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                      <li key={contact.id}>
                        <NavLink
                            className={({isActive, isPending})=> isActive?'active':isPending?'pending':''}
                            to={`contacts/${contact.id}`}>
                          {contact.first || contact.last ? (
                              <>
                                {contact.first} {contact.last}
                              </>
                          ) : (
                              <i>No Name</i>
                          )}{" "}
                          {contact.favorite ? (
                              <span>★</span>
                          ) : null}
                        </NavLink>
                      </li>
                  ))}
                </ul>
            ) : (
                <p>
                  <i>No contacts</i>
                </p>
            )}
          </nav>
        </div>
        <div id="detail" className={navigation.state === 'loading'? 'loading':''}>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
