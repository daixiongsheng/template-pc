import React from 'react'
import { useNavigate } from 'react-router'

export type IndexProps = {}
const Index: React.FC<IndexProps> = () => {
  const navigator = useNavigate()
  return (
    <div
      onClick={(e) => {
        navigator('/home')
      }}
    >
      Index
    </div>
  )
}

export default Index
