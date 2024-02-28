import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setUser } from '../store/appSlice'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import showToaster from '../utils/showToaster'
import convertJoiErrors2Errors from '../utils/convertJoiErrors2Errors'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState(null)

  const handleLogin = async (e) => {
    e?.preventDefault()
    dispatch(setLoading(true))
    try {
      const { data: { token }} = await axios.post(process.env.REACT_APP_API_URL + '/api/auth/login', {email, password})
      setAuthToken(token)
      const {data: user} = await axios.get(process.env.REACT_APP_API_URL + '/api/auth/me')
      dispatch(setUser(user))
      navigate('/')
      showToaster({success: 'Logged in successfully'})
    } catch (err) {
      showToaster(err?.response?.data?.message || {error: 'Please try again later'})
      if (err?.response?.data?.isJoi) {
        setErrors(convertJoiErrors2Errors(err.response.data.errors))
      } else {
        setErrors(err?.response?.data?.errors)
      }
    }
    dispatch(setLoading(false))
  }

  return (
    <>
      <div className='w-full py-6 px-6 h-full flex justify-center items-center'>
        <div className='w-[500px] max-w-full border-2 rounded border-[#ee484d] py-12 px-4 space-y-4'>
          <p className="mb-8 font-bold text-2xl text-center text-[#ee484d]">Log In</p>
          <div>
            <label className='text-gray-700 font-medium'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='w-full border-gray-300 border rounded-md px-3 py-2 focus:outline-none focus:border-[#ee484d]'
              placeholder='example@example.com'
              required
            />
            {errors?.email && <label className='block text-rose-700 font-medium'>{errors?.email}</label>}
          </div>
          <div>
            <label className='text-gray-700 font-medium'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              className='w-full border-gray-300 border rounded-md px-3 py-2 focus:outline-none focus:border-[#ee484d]'
              required
            />
            {errors?.password && <label className='block text-rose-700 font-medium'>{errors?.password}</label>}
          </div>
          <div>
            <button className='bg-[#ee484d] text-white w-full py-2 px-4 rounded-full hover:bg-[#ee484d] mt-6' onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  )
}