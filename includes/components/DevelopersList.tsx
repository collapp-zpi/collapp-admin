import React from 'react'
import { DeveloperUser } from '@prisma/client'
import Link from 'next/link'

const DevelopersList = ({ developers }: { developers: DeveloperUser[] }) => (
  <div className="m-auto bg-gray-50 shadow-2xl p-8 rounded-2xl">
    <table className="text-center mx-auto">
      <thead>
        <tr>
          <th className="px-2 py-4"></th>
          <th className="px-8 py-4">Name</th>
          <th className="px-8 py-4">Email</th>
        </tr>
      </thead>
      <tbody>
        {developers.map((developer: DeveloperUser) => (
          <Link key={developer.id} href={`/panel/developers/${developer.id}`}>
            <tr style={{ cursor: 'pointer' }} className="hover:bg-gray-200">
              <td className="px-2 py-2">
                <img
                  src={developer.image || ''}
                  alt=""
                  className="w-32 h-32 rounded-full border-2 border-gray-300"
                />
              </td>
              <td className="px-8 py-2">{developer.name}</td>
              <td className="px-8 py-2">
                {!developer.email ? '-' : developer.email}
              </td>
            </tr>
          </Link>
        ))}
      </tbody>
    </table>
  </div>
)

export default DevelopersList
