import { Box } from '@chakra-ui/react'
import React from 'react'
import NavLinks from './NavLinks';

function Sidebar() {

    const toggleSidebar = (e) => {
        console.log('clicked');
    }

    return (
        <Box w={'95%'}>
            <NavLinks toggleSidebar={toggleSidebar} />
        </Box>
    )
}

export default Sidebar