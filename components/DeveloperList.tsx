import React from 'react'
import { DeveloperUser } from '@prisma/client'

const DeveloperList = ({ developers }: { developers: DeveloperUser[] }) => (
  <div>
    <table>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Email</th>
      </tr>
      {developers.map((developer: DeveloperUser) => (
        <tr>
          <td>
            <img src={developer.image || ''} alt="" />
          </td>
          <td>{developer.name}</td>
          <td>{developer.email}</td>
        </tr>
      ))}
    </table>
  </div>
)

export default DeveloperList
