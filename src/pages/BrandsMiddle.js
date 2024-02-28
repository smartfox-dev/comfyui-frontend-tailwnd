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
import { setBrandsList, setPromptValue } from '../store/appSlice';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio';
import CircularProgress from '@mui/material/CircularProgress';
import { isEmpty } from 'lodash';

export default function BrandsMiddle() {
    const dispatch = useDispatch();
    const brandsList = useSelector(state => state.app.brandsList);
    const selectedSidebar = useSelector(state => state.app.selectedSidebar);
    const promptValue = useSelector(state => state.app.promptValue);

    const [selectedItem, setSelectedItem] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBrands, setFilteredBrands] = useState(brandsList);

    const handleCheck = (item) => {
        setSelectedItem(item);
        dispatch(setPromptValue({
            ...promptValue,
            brands: item,
        }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredList = brandsList.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredBrands(filteredList);
    };

    useEffect(() => {
        axios.post(process.env.REACT_APP_API_URL + '/api/admin/brands-list')
            .then(({ data: response }) => {
                setFilteredBrands(response?.brands)
                dispatch(setBrandsList(response?.brands))
            })
            .catch(err => {
                showToaster(err?.response?.data?.message)
            })
    }, [])

    useEffect(() => {
        if(!isEmpty(brandsList) && !isEmpty(promptValue?.brands)){
            setSelectedItem(promptValue?.brands);
        }
    }, [selectedSidebar])

    return (
        <>
            {filteredBrands &&
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
                        name='brands-name'
                    />
                    <div className='mt-4'>
                        {filteredBrands.map((item, index) => (
                            <ListItem key={item.id} disablePadding>
                                <ListItemButton onClick={() => { handleCheck(item) }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" noWrap component="div" sx={{ display: 'grid' }}>
                                                <div style={{ display: 'inline-block', maxWidth: '100%' }}>
                                                    {item.name}
                                                </div>
                                            </Typography>
                                        }
                                    />
                                    <Radio
                                        checked={selectedItem?.id === item?.id}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>
                </>
            }
            {!filteredBrands &&
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress color="success" />
                </div>
            }
        </>
    )
}