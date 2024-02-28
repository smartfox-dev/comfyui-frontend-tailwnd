import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function ModelsMiddle({ selectedItem, modelsList, setSelectedItem }) {
    const ModelsAvatar = ({ img }) => {
        return (
            <Stack direction="row" spacing={2}>
                <Avatar variant="rounded" alt="Models Sharp" src={process.env.REACT_APP_API_URL + "/uploads/models/" + img} />
            </Stack>
        )
    };
    
    return (
        <>
            {modelsList &&
                <>
                    {modelsList.map((item, index) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{ background: selectedItem?.id == item?.id ? 'rgba(0, 0, 0, 0.15)' : '' }}
                            onClick={() => { setSelectedItem(item) }}
                        >
                            <ListItemButton>
                                <ListItemIcon >
                                    <ModelsAvatar img={item.img} />
                                </ListItemIcon>
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
                            </ListItemButton>
                        </ListItem>
                    ))}
                </>
            }
            {!modelsList &&
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress color="success" />
                </div>
            }
        </>
    )
}