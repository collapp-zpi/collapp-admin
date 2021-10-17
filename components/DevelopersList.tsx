import React from 'react'
import { DeveloperUser } from '@prisma/client'
import Link from 'next/link'

const DevelopersList = ({ developers }: { developers: DeveloperUser[] }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {developers.map((developer: DeveloperUser) => (
          <Link href={`/panel/developers/${developer.id}`}>
            <tr style={{ cursor: 'pointer' }}>
              <td>
                <img src={developer.image || ''} alt="" />
              </td>
              <td>{developer.name}</td>
              <td>{developer.email}</td>
            </tr>
          </Link>
        ))}
      </tbody>
    </table>
  </div>
)

export default DevelopersList
