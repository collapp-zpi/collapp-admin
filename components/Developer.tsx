import React from 'react'
import { DeveloperUser } from '@prisma/client'

// interface Props {
//   image?: string;
//   name?: string;
//   email?: string;
// }

const Developer = (developer: DeveloperUser) => (
  <div>
    <img src={developer.image || ''} alt="" />
    <h1>{developer.name}</h1>
  </div>
)

export default Developer
