import { Stack, Box, SimpleGrid, Grid, GridItem } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../../components'

function SharedLayout({ Sidebar }) {
    return (
        <Stack>
            <Header />

            <Stack
                h={'calc(100% - var(--nav-height))'}
                direction={'row'}
                mt={'0 !important'}
                spacing={0}
            >
                <Box
                    h='full'
                    minW={'250px'}
                    display={{ base: 'none', lg: 'block' }}
                    overflow={'auto'}
                >
                    {Sidebar}
                </Box>

                <Box h='full' w={'full'}>
                    <Outlet />
                </Box>
            </Stack>

        </Stack >
    )
}

export default SharedLayout