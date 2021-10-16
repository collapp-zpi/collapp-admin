import React from 'react'
import { DeveloperUser } from '@prisma/client'

// interface Props {
//   image?: string;
//   name?: string;
//   email?: string;
// }

const Developer = (developer: DeveloperUser) => (
  <tr>
    <td>
      <img src={developer.image || ''} alt="" />
    </td>
    <td>{developer.name}</td>
    <td>{developer.email}</td>
  </tr>
)

export default Developer
