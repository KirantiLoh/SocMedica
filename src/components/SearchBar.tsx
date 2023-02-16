import { useRouter } from 'next/router';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';

const SearchBar = () => {

  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!query || query.length <= 2) return;
    router.push(`/search?q=${query}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex-1 sm:min-w-[300px]">
        <input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder='Search' className='w-full outline-none bg-primary-900 rounded-full px-3 py-2 placeholder:text-white placeholder:text-opacity-80 focus:outline-primary' />    
    </form>
  )
}

export default SearchBar