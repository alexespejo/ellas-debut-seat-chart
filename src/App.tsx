import { useEffect, useMemo, useRef, useState } from "react";
import { guests, tableCount } from "./lib/seating";
import { normalizeName, searchGuests } from "./lib/search";
import "./App.css";

const guestCount = guests.length;

function SearchIcon() {
 return (
  <svg
   className="search-icon"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.6"
   strokeLinecap="round"
   aria-hidden="true"
  >
   <circle cx="10.5" cy="10.5" r="6.5" />
   <path d="m15.5 15.5 4.5 4.5" />
  </svg>
 );
}

function App() {
 const [query, setQuery] = useState("");
 const results = useMemo(() => searchGuests(query), [query]);
 const listRef = useRef<HTMLUListElement>(null);
 const trimmedQuery = query.trim();
 const hasSearch = normalizeName(query).length > 0;

 useEffect(() => {
  if (listRef.current) listRef.current.scrollTop = 0;
 }, [query]);

 return (
  <main className="page">
   <div className="panel">
    <div className="panel-inner">
     <header className="masthead">
      <p className="eyebrow">Seating chart</p>
      <h1>Ella Catherine&rsquo;s 18th Birthday Debut</h1>
      <p className="lede">
       Search your name and we&rsquo;ll show you which table you&rsquo;re seated
       at.
      </p>
      <div className="rule" aria-hidden="true" />
     </header>

     <div className="search">
      <label className="sr-only" htmlFor="guest-search">
       Search your name
      </label>
      <SearchIcon />
      <input
       id="guest-search"
       type="search"
       value={query}
       onChange={(event) => setQuery(event.target.value)}
       onKeyDown={(event) => {
        if (event.key === "Escape") setQuery("");
       }}
       placeholder="Type your name"
       autoComplete="off"
       autoCorrect="off"
       spellCheck={false}
       autoFocus
       enterKeyHint="search"
      />
      {query.length > 0 && (
       <button
        type="button"
        className="clear"
        onClick={() => setQuery("")}
        aria-label="Clear search"
       >
        <svg
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinecap="round"
         aria-hidden="true"
        >
         <path d="M7 7l10 10M17 7 7 17" />
        </svg>
       </button>
      )}
     </div>

     <section className="results" aria-live="polite" aria-atomic="true">
      {!hasSearch && trimmedQuery.length === 0 ? (
       <p className="empty">Start typing a first or last name.</p>
      ) : !hasSearch ? (
       <p className="empty">Type a name to search the seating chart.</p>
      ) : results.length === 0 ? (
       <div className="empty">
        <p>
         No seat found for <strong>&ldquo;{trimmedQuery}&rdquo;</strong>.
        </p>
        <p className="empty-hint">
         Try just your first name, or check the spelling.
        </p>
       </div>
      ) : (
       <>
        <p className="results-label">
         {results.length === 1 ? "Your seat" : `${results.length} guests match`}
        </p>
        <ul
         ref={listRef}
         className="seats"
         tabIndex={0}
         aria-label="Seating matches"
        >
         {results.map(({ guest, fullName }, index) => (
          <li
           className="seat-row"
           key={`${fullName}-${guest.table}-${index}`}
           style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
          >
           <span className="seat-name">{fullName}</span>
           <span className="seat-table">
            <span className="seat-table-label">Table</span>
            <span className="seat-table-number">{guest.table}</span>
           </span>
          </li>
         ))}
        </ul>
       </>
      )}
     </section>

     <footer className="panel-footer">
      {guestCount} guests &middot; {tableCount} tables
     </footer>
    </div>
   </div>
  </main>
 );
}

export default App;
