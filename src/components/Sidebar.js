import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import { ReactComponent as BrandsSVG } from '../assets/images/brands.svg';

import { ReactComponent as ShirtSVG } from '../assets/images/shirt.svg';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { setSelectedSidebar } from '../store/appSlice';
import { useDispatch, useSelector } from 'react-redux';

const drawerWidth = 300;

export default function Sidebar() {
    const dispatch = useDispatch();  
    const selectedSidebar = useSelector(state => state.app.selectedSidebar)  
    const SidebarIcon = ({ icon }) => {
        switch (icon) {
            case "Models":
                return <PersonIcon style={{fontSize: '35px'}}/>;
            case "Brands":
                return <BrandsSVG />;
            case "Aesthetics":
                return <PaletteIcon style={{fontSize: '32px'}}/>;
            case "Clothing":
                return <ShirtSVG />;
            case "Generate":
                return <CameraAltIcon style={{fontSize: '32px'}}/>;
                
          default:
            return null; // Return null if no matching icon is found
        }
    };
    
    const handleClick = (item) => {
        dispatch(setSelectedSidebar(item));
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <Stack direction="row" spacing={2} sx={{ margin: '15px 30px', paddingTop: '30px', display: 'flex', alignItems: 'center' }}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Typography variant="body1" fontWeight="bold">Choose a modal</Typography>
                    </Stack>
                    <div className='mt-8'>
                        {['Models', 'Brands', 'Aesthetics', 'Clothing', 'Generate'].map((text, index) => (
                            <ListItem 
                                key={text} 
                                disablePadding 
                                sx={{ background: selectedSidebar == text ? '#E6195E': '', color: selectedSidebar == text ? 'white' : 'black'}} 
                                onClick={() => {handleClick(text)}}
                            >
                                <ListItemButton sx={{padding: '15px 30px'}}>
                                    <ListItemIcon>
                                        <SidebarIcon icon={text}/>
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>
                </List>
            </Box>
        </Drawer>
  );
}