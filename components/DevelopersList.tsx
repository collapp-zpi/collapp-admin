import React from 'react'
import { DeveloperUser } from '@prisma/client'

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
          <tr>
            <td>
              <img src={developer.image || ''} alt="" />
            </td>
            <td>{developer.name}</td>
            <td>{developer.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default DevelopersList
