import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { Stack } from '@chakra-ui/react'

function SiteSharedLayout() {
    return (
        <Stack
            direction={'column'}
            spacing={0}
        >
            <Header />

            <Outlet />

        </Stack>
    )
}

export default SiteSharedLayout