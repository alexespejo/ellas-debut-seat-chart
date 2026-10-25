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

function LavenderSprig({ mirrored = false }: { mirrored?: boolean }) {
 const buds = Array.from({ length: 20 }, (_, index) => {
  const t = index / 19;
  const side = index % 2 === 0 ? -1 : 1;

  return {
   x: 60 + side * (15 * (1 - t) + 1.5),
   y: 128 - t * 108,
   angle: side * 36 * (1 - t * 0.25),
   scale: 1 - t * 0.32,
  };
 });

 return (
  <svg
   className={`sprig ${mirrored ? "sprig-bottom" : "sprig-top"}`}
   viewBox="0 0 120 280"
   fill="none"
   aria-hidden="true"
  >
   <path
    d="M60 272c-5-50 3-98 0-146"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    opacity="0.45"
   />
   <path
    d="M60 218c-14-5-23-15-27-28 13 3 21 12 27 28Z"
    fill="currentColor"
    opacity="0.22"
   />
   <path
    d="M60 242c15-6 24-16 27-29-13 3-21 12-27 29Z"
    fill="currentColor"
    opacity="0.16"
   />
   {buds.map((bud, index) => (
    <ellipse
     key={`${bud.x}-${bud.y}`}
     rx="4.2"
     ry="7.4"
     fill="currentColor"
     opacity={0.5 + (index / 19) * 0.4}
     transform={`translate(${bud.x.toFixed(2)} ${bud.y.toFixed(2)}) rotate(${bud.angle.toFixed(2)}) scale(${bud.scale.toFixed(3)})`}
    />
   ))}
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
    <div className="panel-art" aria-hidden="true">
     <LavenderSprig />
     <LavenderSprig mirrored />
    </div>
    <div className="panel-inner">
     <header className="masthead">
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
       <p className="empty"></p>
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
