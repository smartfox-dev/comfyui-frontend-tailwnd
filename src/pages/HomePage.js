import React, { useEffect, useRef, useLayoutEffect, useState, useMemo } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addMessage, setMessages, setModelsList, setPromptValue, setSegment, setSetting, setWidgetbotIndex, shiftMessage } from '../store/appSlice'
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import showToaster from '../utils/showToaster'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BrandsSVG from '../assets/images/brands.svg';
import Sidebar from '../components/Sidebar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'
import ModelsMiddle from './ModelsMiddle'
import BrandsMiddle from './BrandsMiddle'
import AestheticsMiddle from './AestheticsMiddle'
import ClothingMiddle from './ClothingMiddle'
import { isEmpty } from 'lodash'
import GeneratePage from './GeneratePage'

export default function HomePage() {

  const ModelsAvatar = ({ img }) => {
    return (
      <Stack direction="row" spacing={2}>
        <Avatar variant="rounded" alt="Models Sharp" src={process.env.REACT_APP_API_URL + "/uploads/models/" + img} />
      </Stack>
    )
  };

  const dispatch = useDispatch();
  const widgetbotIndex = useSelector(state => state.app.widgetbotIndex)
  const modelsList = useSelector(state => state.app.modelsList);
  const selectedSidebar = useSelector(state => state.app.selectedSidebar);
  const promptValue = useSelector(state => state.app.promptValue);
  const [windowsWidth, setWindowsWidth] = useState(window.innerWidth)
  const [selectedItem, setSelectedItem] = useState('');

  useLayoutEffect(() => {
    function updateSize() {
      setWindowsWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    axios.post(process.env.REACT_APP_API_URL + '/api/admin/models-list')
      .then(({ data: response }) => {
        console.log("===modelsList:", response.models);
        setSelectedItem(response?.models[0]);
        dispatch(setModelsList(response?.models));
        dispatch(setPromptValue({
          ...promptValue,
          models: response?.models[0],
        }));
      })
      .catch(err => {
        showToaster(err?.response?.data?.message)
      })
  }, [])

  const handleClick = (item) => {
    setSelectedItem(item)
    dispatch(setPromptValue({
      ...promptValue,
      models: item,
    }));
  }

  useEffect(() => {
    console.log("===promptValue:", promptValue)
    if (!isEmpty(modelsList) && !isEmpty(promptValue?.models)) {
      //const selectedItem = modelsList.find((item) => item.id == promptValue.models.id);
      setSelectedItem(promptValue.models);
    }
  }, [selectedSidebar])

  return (
    <>
      {selectedSidebar !== "Generate" &&
        <Box component="main" className="flex-grow p-12 flex mt-20">
          <List className='my-middle-list' sx={{ overflowY: 'auto', width: '400px', height: '100vh', paddingBottom: '150px' }}>
            {selectedSidebar == "Models" &&
              <ModelsMiddle modelsList={modelsList} selectedItem={selectedItem} setSelectedItem={handleClick} />
            }
            {selectedSidebar == "Brands" &&
              <BrandsMiddle />
            }
            {selectedSidebar == "Aesthetics" &&
              <AestheticsMiddle />
            }
            {selectedSidebar == "Clothing" &&
              <ClothingMiddle />
            }
          </List>
          <div className='flex-1'>
            <Box component="div" sx={{ display: 'inline' }}>
              <img className='mx-auto' style={{ borderRadius: '50px', maxHeight: '100vh' }} src={process.env.REACT_APP_API_URL + "/uploads/models/" + selectedItem?.img} />
            </Box>
          </div>
        </Box>
      }
      {selectedSidebar == "Generate" && 
        <GeneratePage />
      }
    </>
  )
}