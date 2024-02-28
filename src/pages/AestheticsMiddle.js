import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import showToaster from '../utils/showToaster';
import { setAestheticsList, setPromptValue } from '../store/appSlice';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { isEmpty } from 'lodash';

export default function AestheticsMiddle() {
    const dispatch = useDispatch();
    const aestheticsList = useSelector(state => state.app.aestheticsList);
    const promptValue = useSelector(state => state.app.promptValue);
    const selectedSidebar = useSelector(state => state.app.selectedSidebar);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheck = (item) => {
        if (selectedItems.some((i) => i?.id == item?.id)) {
            setSelectedItems(selectedItems.filter(i => i?.id !== item?.id));
            dispatch(setPromptValue({
                ...promptValue,
                aesthetics: selectedItems.filter(i => i !== item),
            }));
        } else {
            setSelectedItems([...selectedItems, item]);
            dispatch(setPromptValue({
                ...promptValue,
                aesthetics: [...selectedItems, item],
            }));
        }
    };

    useEffect(() => {
        axios.post(process.env.REACT_APP_API_URL + '/api/admin/aesthetics-list')
            .then(({ data: response }) => {
                console.log("===aesthetics:", response.aesthetics);
                dispatch(setAestheticsList(response?.aesthetics))
            })
            .catch(err => {
                showToaster(err?.response?.data?.message)
            })
    }, [])

    useEffect(() => {
        if (!isEmpty(aestheticsList) && !isEmpty(promptValue?.aesthetics)) {
            setSelectedItems(promptValue.aesthetics);
        }
    }, [selectedSidebar])

    return (
        <>
            {aestheticsList &&
                <>
                    <div className='mt-4'>
                        <Typography variant="body1" fontWeight="bold" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>Choose from a curated list of styles or themes</Typography>
                        <ImageList variant="masonry" cols={2}>
                            {aestheticsList.map((item) => (
                                <label key={item.id} >
                                    <ImageListItem className='cursor-pointer'>
                                        <img
                                            src={process.env.REACT_APP_API_URL + "/uploads/aesthetics/" + item.img}
                                            alt={item.name}
                                            loading="lazy"
                                            onClick={() => { handleCheck(item) }}
                                        />
                                        <ImageListItemBar
                                            title={item.name}
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                    aria-label={`info about ${item.title}`}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                            }
                                        />
                                        <Checkbox
                                            checked={selectedItems.some((i) => i?.id == item?.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: '0',
                                                '&.Mui-checked': {
                                                    color: 'red',
                                                },
                                            }}
                                        />
                                    </ImageListItem>
                                </label>
                            ))}
                        </ImageList>
                    </div>
                </>
            }
            {!aestheticsList &&
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress color="success" />
                </div>
            }
        </>
    )
}