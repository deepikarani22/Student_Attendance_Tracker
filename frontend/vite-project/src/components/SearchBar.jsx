import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <div className="flex items-center bg-white/6 rounded-full px-3 py-2 w-64">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-transparent text-sm placeholder:text-gray-400 text-white flex-1"
      />
      <button
        onClick={() => alert(`Searching for: ${query || "nothing"}`)}
        className="text-sm bg-white/8 px-3 py-1 rounded-full hover:bg-white/12 transition"
      >
        Go
      </button>
    </div>
  );
}

export default SearchBar;


/*import React, { useState } from "react";

function SearchBar(){
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
        console.log("Searching for:", e.target.value);
    };

    return(
        <div>
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}/>
            <button onClick={() => alert(query)}>Go</button>
        </div>
    )
}
export default SearchBar;*/