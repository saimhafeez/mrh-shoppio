import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/appContext'

import {
    Box, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Button, Stack, Card, Badge, Tabs, Tab, TabList, TabPanels, TabPanel, IconButton, Menu, MenuButton, MenuList, MenuItem, Stat, StatLabel, StatHelpText, StatNumber, Flex, Table, TableContainer, Tbody, Tr, Td, useDisclosure, Spinner, Center, Image, Text, Kbd, Wrap, Input,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Skeleton,
    Thead,
    Th,
    CircularProgress,
    Heading,
    Select,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Divider
} from '@chakra-ui/react'

import { AiFillCaretDown } from 'react-icons/ai'

import { PriceComponent } from '../../../components/site'

import { orderStatusList } from '../../../utils/OrderStatusList'
import OrderItem from '../../../components/vendor/OrderItem'

function Orders() {

    const { user, getVendorOrders } = useAppContext()

    const [vendorOrders, setVendorOrders] = useState({
        isLoading: true,
        orders: []
    })


    const init = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const { orders } = await getVendorOrders(user._id);
                resolve(orders);
            } catch (error) {
                reject(error)
            }
        })

    }

    useEffect(() => {

        init().then((orders) => {
            setVendorOrders({
                isLoading: false,
                orders
            })
            console.log(orders)
        }).catch((error) => {
            console.log(error)
        })

    }, [])

    return (
        <Stack
            p={5}
        >
            {vendorOrders.isLoading ? <Center>
                <CircularProgress isIndeterminate color='brand_primary.500' />
            </Center>
                : vendorOrders.orders.map((order, index) => {
                    return <OrderItem key={index} order={order} />
                })
            }
        </Stack >
    )
}

/*
    
    Pending: Light gray (#CCCCCC) or pale yellow (#FFFACD)
    Shipped: Green (#008000) or light blue (#ADD8E6)
    Received: Dark blue (#00008B) or deep purple (#800080)
    Returned: Orange (#FFA500) or dark red (#8B0000)

    Light color of pale yellow (#FFFDE7)
    Light color of light blue (#BFEFFF)
    Light color of deep purple (#A984FF)
    Light color of dark red (#FF5F5F)
    
    */

export default Orders