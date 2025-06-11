import React from 'react'
import { HiOutlineLogin } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import Navbar from './Navbar'
function Header() {
  const router = useRouter()

    const { data: session } = useSession()
  return (
    <div className='flex justify-between  p-4'>
      
      <img  width={130} src="/images/Hezbollah_logo.jpg"   />

      <div className='flex items-center gap-3'>
        <button onClick={()=>router.push("/")} className='bg-orange-400 p-3 rounded-full text-black'><span className='hidden sm:block'>home</span> <HiOutlinePencilAlt className='block sm:hidden'/> </button>

        {!session?<button onClick={()=>signIn()} className='bg-black p-3 rounded-full text-white'> <span className='hidden sm:block'>Sign In </span> <HiOutlineLogin className='block sm:hidden'/> 
        </button>:<button onClick={()=>signOut()} className='bg-black p-3 rounded-full text-white'> <span className='hidden sm:block'>Sign Out</span> <HiOutlineLogout className='block sm:hidden'/> </button>}

        <button onClick={()=>router.push("/create-post")} className='bg-orange-400 p-3 rounded-full text-black'><span className='hidden sm:block'>Create Post</span> <HiOutlinePencilAlt className='block sm:hidden'/> </button>

        <img className='rounded-full cursor-pointer' width={50}   height={50} src={session?.user?.image || "/images/Hezbollah_logo.jpg"} />
        <Navbar/>
      </div>
    
    
    
    
    </div>
    
    
  )
}

export default Header
