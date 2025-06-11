import React, { useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Form from '@/pages/FormPost/Form'
import Layout from '@/pages/components/Layout'

function CreatePost() {
     const { data: session } = useSession()
     const router = useRouter()
     useEffect(() => {
          if (!session) {
               router.push("/");
          }
     }, [session, router]);
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80">
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <h1 className="text-4xl font-bold text-[#008000] mb-8 text-center">إنشاء منشور جديد</h1>
            <Form/>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default CreatePost
