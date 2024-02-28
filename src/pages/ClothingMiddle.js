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
import { setClothingList, setPromptValue } from '../store/appSlice';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { isEmpty } from 'lodash';

export default function ClothingMiddle() {
    const dispatch = useDispatch();
    const clothingList = useSelector(state => state.app.clothingList);
    const selectedSidebar = useSelector(state => state.app.selectedSidebar);
    const promptValue = useSelector(state => state.app.promptValue);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClothings, setFilteredClothings] = useState(clothingList);
    const handleCheck = (item) => {
        if (selectedItems.some((i) => i?.id == item?.id)) {
            setSelectedItems(selectedItems.filter(i => i?.id !== item?.id));
            dispatch(setPromptValue({
                ...promptValue,
                clothing: selectedItems.filter(i => i !== item),
            }));
        } else {
            setSelectedItems([...selectedItems, item]);
            dispatch(setPromptValue({
                ...promptValue,
                clothing: [...selectedItems, item],
            }));
        }

    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredList = clothingList.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        ); 
        setFilteredClothings(filteredList);
    };

    useEffect(() => {
        axios.post(process.env.REACT_APP_API_URL + '/api/admin/clothing-list')
            .then(({ data: response }) => {
                setFilteredClothings(response?.clothing)
                dispatch(setClothingList(response?.clothing))
            })
            .catch(err => {
                showToaster(err?.response?.data?.message)
            })
    }, [])
    
    useEffect(() => {
        if(!isEmpty(clothingList) && !isEmpty(promptValue?.clothing)){
            setSelectedItems(promptValue.clothing);
        }
    }, [selectedSidebar])

    return (
        <>
            {filteredClothings &&
                <>
                    <Typography variant="body1" fontWeight="bold" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>Choose your favorite brands</Typography>
                    <TextField
                        className='w-full'
                        label="Search"
                        sx={{ paddingRight: '1rem' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        onChange={(event) => handleSearch(event.target.value)}
                        autoComplete='off'
                        name='clothing-name'
                    />
                    <div className='mt-4'>
                        {filteredClothings.map((item, index) => (
                            <ListItem key={item.id} disablePadding>
                                <ListItemButton onClick={() => { handleCheck(item) }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" noWrap component="div" sx={{ display: 'grid' }}>
                                                <div style={{ display: 'inline-block', maxWidth: '100%' }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ display: 'inline-block', maxWidth: '100%', fontSize: '13px', color: 'grey' }}>
                                                    {item.attribute}
                                                </div>
                                            </Typography>
                                        }
                                    />
                                    <Checkbox
                                        checked={selectedItems.some((i) => i?.id == item.id)}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>
                </>
            }
            {!filteredClothings &&
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress color="success" />
                </div>
            }
        </>
    )
}