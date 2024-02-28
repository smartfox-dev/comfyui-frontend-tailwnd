import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightStartOnRectangleIcon, UsersIcon, Cog6ToothIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { UsersIcon as UsersIconSolid, Cog6ToothIcon as Cog6ToothIconSolid, TableCellsIcon as TableCellsIconSolid } from '@heroicons/react/24/solid'
import { setUser } from '../store/appSlice'
import setAuthToken from '../utils/setAuthToken'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import LogoutIcon from '@mui/icons-material/Logout';
import { isEmpty } from 'lodash'

export default function Navbar({className}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { pathname } = location;
  const user = useSelector(state => state.app.user);
  console.log("====user", user)
  //const isAdmin = useSelector(state => state.app.user?.role === 'ADMIN')

  const isAuthenticated = useSelector(state => state.app.token)

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" className='flex justify-between w-full'>
            <div className='container flex justify-between items-center text-white py-4'>
              <Link className='text-base sm:text-3xl md:text-4xl cursor-pointer text-gray-900' to='/'>
                {!isEmpty(user) && 
                  <span className='text-2xl'>{user?.email}</span>
                }
              </Link>
            </div>
            <div className='flex gap-2 md:gap-4 items-center'>
              {
                !isAuthenticated &&
                <Link to='/login' className={`rounded-md cursor-pointer h-fit`}>
                  <div>
                    {
                      pathname.startsWith('/login') &&
                      <Stack direction="row" spacing={2}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                      </Stack>
                    }
                    {
                      !pathname.startsWith('/login') &&
                      <Stack direction="row" spacing={2}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                      </Stack>
                    }
                  </div>
                </Link>
              }
              {
                isAuthenticated &&
                <button className='rounded-md cursor-pointer h-fit' onClick={() => {
                  dispatch(setUser(null))
                  setAuthToken(null)
                  navigate('/login')
                }}>
                  <div className='w-6 md:w-8'>
                    <LogoutIcon sx={{color: 'black'}}/>
                  </div>
                </button>
              }
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}