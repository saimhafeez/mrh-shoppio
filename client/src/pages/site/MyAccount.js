import { Box, Grid, GridItem, Image, Stack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React from 'react'

import userSideBarLinks from '../../utils/user_sidebar_links'
import { MyOrders } from '../../components/user'

function MyAccount() {

    const active_section = window.location.href.split('/')[window.location.href.split('/').length - 1]


    return (
        <Tabs
            orientation={'horizontal'}
            w='100%'
            maxW='1000px'
            alignSelf='center'
            padding='1rem'
        >
            <TabList justifyContent='center'>
                {userSideBarLinks.map((item, index) => {
                    return <Tab>
                        <Stack
                            direction='row'
                            bg='#edf2f7'
                            color='brand_primary.500'
                            borderRadius='12px'
                            alignItems='center'
                            padding='1rem'
                            w='100%'
                        >
                            <Box>
                                {item.icon}
                            </Box>

                            <Text
                                display={{ base: 'none', lg: 'initial' }}
                            >
                                {item.text}
                            </Text>
                        </Stack>
                    </Tab>
                })}
            </TabList>

            <TabPanels marginTop='12px' borderRadius='10px'>
                <TabPanel>
                    <MyOrders />
                </TabPanel>
            </TabPanels>
        </Tabs >
    )
}

export default MyAccount