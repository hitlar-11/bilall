import React,{useState} from 'react'

function Search() {
    const [search, setSearch] = useState()
    const handleSearchButton = (e) => {
        console.log("search",search);
        e.preventDefault();
    }


  return (
    <div className='items-center mt-5'>
      
            <form class="max-w-md mx-auto">   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input onChange={(e)=>setSearch(e.target.value)} type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search any thing" required />
                    <button onClick={(e)=>handleSearchButton} type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-yellow-300 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-800 dark:hover:bg-green-800 dark:focus:ring-green-800 cursor-pointer">Search</button>
                </div>
            </form>

    </div>
  )
}

export default Search
