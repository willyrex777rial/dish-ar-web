'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

type Dish = {
  id: string
  name: string
  usdz_url: string
  created_at: string
}

export default function AdminPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDishes() {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setDishes(data)
      }
      setLoading(false)
    }

    fetchDishes()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dish Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dishes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No dishes scanned yet.
                  </td>
                </tr>
              ) : (
                dishes.map((dish) => {
                  // Change the domain as needed, here we use window.location.origin but since it's SSR/CSR
                  // we'll just construct a relative path or use a placeholder domain for the QR
                  const dishUrl = typeof window !== 'undefined' 
                    ? `${window.location.origin}/dish/${dish.id}`
                    : `https://yourapp.vercel.app/dish/${dish.id}`

                  return (
                    <tr key={dish.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dish.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(dish.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-white p-2 inline-block border border-gray-200 rounded">
                          <QRCodeSVG value={dishUrl} size={100} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/dish/${dish.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Link
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
