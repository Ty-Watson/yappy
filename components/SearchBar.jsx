import React from 'react'

const SearchBar = ({searchInput, setSearchInput}) => {
  return (
    <input 
      className='block w-full rounded-full border border-gray-100 bg-gray-100 py-2.5 font-satoshi pl-5 pr-12 text-sm shadow-lg font-medium focus:border-black focus:outline-none focus:ring-0 peer'
      type='text'
      placeholder='Search'
      onChange={(e) => setSearchInput(e.target.value)}
      value={searchInput}
      
      >
      
    </input>
  )
}

export default SearchBar