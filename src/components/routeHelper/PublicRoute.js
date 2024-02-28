import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PublicRoute({ children }) {
  const isAuthenticated = useSelector(state => state.app.token)
  if (isAuthenticated) {
    return (
      <Navigate to="/" />
    )
  }
  return (
    <>
      {children}
    </>
  )
}