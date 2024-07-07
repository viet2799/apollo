import { Fragment } from "react";
import "./App.css";

function App() {
  return (
    <Fragment>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <a href={`/Person`}>Person</a>
            </li>
            <li>
              <a href={`/Job`}>Job</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail"></div>
    </Fragment>
  );
}

export default App;
