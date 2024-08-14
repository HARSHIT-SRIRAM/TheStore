import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchResults, setSearchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};
