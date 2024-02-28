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
import { setClothingList, setGeneratedImg, setLoadingFlag, setPromptValue } from '../store/appSlice';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { isEmpty } from 'lodash';
import LoadingButton from './LoadingButton';
import Button from '@mui/material/Button'

export const ImageDownload = ({ imageUrl, disabled }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            const imageName = imageUrl.split('/').pop();
            link.download = imageName;

            document.body.appendChild(link);

            link.click();
            // Clean up
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error during download:', error);
        }
    }
    return (
        <div className="flex items-center">
            <Button variant="contained" disabled={disabled} onClick={handleDownload}>DOWNLOAD</Button>
        </div>
    );
};

export default function GeneratePage() {
    const dispatch = useDispatch();
    const clothingList = useSelector(state => state.app.clothingList);
    const selectedSidebar = useSelector(state => state.app.selectedSidebar);
    const promptValue = useSelector(state => state.app.promptValue);
    const loadingFlag = useSelector(state => state.app.loadingFlag);
    const generatedImg = useSelector(state => state.app.generatedImg)

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

    const generateImage = async () => {
        dispatch(setLoadingFlag(true));
        console.log("Prompt_value:", promptValue)
        let promptAttributes = [];
        if (!isEmpty(promptValue?.models)) {
            promptAttributes = [
                ...promptAttributes,
                `(${promptValue?.models?.name})`,
                `(${promptValue?.models?.prompt})`
            ]
        }
        if (!isEmpty(promptValue?.brands)) {
            promptAttributes = [
                ...promptAttributes,
                `(${promptValue?.brands?.name})`
            ]
        }
        if (!isEmpty(promptValue?.aesthetics)) {
            const aesthetics_result = promptValue?.aesthetics.map(item => `${item.name} ${item.attribute}`).join('\n');
            promptAttributes = [
                ...promptAttributes,
                `(${aesthetics_result})`
            ]
        }
        if (!isEmpty(promptValue?.clothing)) {
            const clothing_result = promptValue?.clothing.map(item => `${item.name}`).join('\n');
            promptAttributes = [
                ...promptAttributes,
                `(${clothing_result})`
            ]
        }
        promptAttributes = [
            ...promptAttributes,
            `(High resolution)`
        ]
        console.log("====promptAttributes:", promptAttributes)
        await axios.post(process.env.REACT_APP_API_URL + '/api/admin/image-generate', { prompt: promptAttributes, img_name: promptValue?.models?.img })
            .then(({ data: response }) => {
                console.log("===response:", response.image)
                dispatch(setLoadingFlag(false));
                dispatch(setGeneratedImg(response.image))
            })
            .catch(err => {
                showToaster(err?.response?.data?.message)
            })
    }

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
        if (!isEmpty(clothingList) && !isEmpty(promptValue?.clothing)) {
            setSelectedItems(promptValue.clothing);
        }
    }, [selectedSidebar])

    return (
        <div className='w-full'>
            <div className='flex justify-between mt-24 ml-10 mr-10 justify-end'>
                <LoadingButton loading={loadingFlag} onClick={generateImage} />
                <ImageDownload imageUrl={process.env.REACT_APP_API_URL + "/uploads/output/" + generatedImg} disabled={!generatedImg} />
            </div>
            {isEmpty(generatedImg) && loadingFlag &&
                <Box component="main" sx={{ flexGrow: 1, display: 'flex' }}>
                    <div className="flex justify-center items-center h-screen w-full">
                        <CircularProgress color="success" />
                    </div>
                </Box>
            }
            {!isEmpty(generatedImg) &&
                <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
                    <div className='flex-1'>
                        <Box component="div" sx={{ display: 'inline' }}>
                            <img className='mx-auto' style={{ borderRadius: '50px', maxHeight: '100vh' }} src={process.env.REACT_APP_API_URL + "/uploads/output/" + generatedImg} />
                        </Box>
                    </div>
                </Box>
            }
        </div>
    )
}