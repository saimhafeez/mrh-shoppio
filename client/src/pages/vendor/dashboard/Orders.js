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
import { InputCompnent } from '../../../components'

function Orders() {

    const { user, getVendorOrders } = useAppContext()

    const [vendorOrders, setVendorOrders] = useState({
        isLoading: true,
        orders: [],
        searchedOrders: null
    })

    const [filter, setFilter] = useState({
        search: '',
        sort: 'latest',
        status: 'all'
    })


    const init = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const { orders } = await getVendorOrders(user._id, filter.sort, filter.status);
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

    }, [filter.sort, filter.status])


    const handleChanges = (e) => {

        setFilter(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))

        if (e.target.name !== 'search') {
            setVendorOrders(prev => ({
                ...prev,
                isLoading: true,
            }))
        } else {
            if (e.target.value === '') {
                setVendorOrders(prev => ({
                    ...prev,
                    searchedOrders: null
                }))
            }
        }
    }

    const filterbySearch = () => {
        const searchedOrders = [];

        vendorOrders.orders.map((order, index) => {

            // console.log(order)

            if (order._id === filter.search) {
                searchedOrders.push(order)
            }

            searchedOrders.map((o) => {
                if (o._id === order._id) {
                    order.products.map((item, index) => {
                        if (item.product.name.toLowerCase().includes(filter.search.toLowerCase())) {
                            searchedOrders.push(order)
                        }
                    })
                }
            })

        })

        setVendorOrders(prev => ({
            ...prev,
            searchedOrders
        }))

    }

    return (
        <Stack
            p={5}
            spacing={10}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                justifyContent='end'
            >
                {/* <Stack
                    direction='row'
                >
                    <InputCompnent
                        handleChange={handleChanges}
                        name={'search'}
                        minW={{ base: undefined, lg: '360px' }}
                        w={{ base: '100%', lg: '25%' }}
                        placeholder='enter order id or product name'
                    />
                    <Button onClick={filterbySearch}>Go</Button>
                </Stack> */}
                <Stack
                    direction='row'
                >
                    <Select
                        maxW={'200px'}
                        alignSelf='end'
                        onChange={handleChanges}
                        name='sort'
                    >
                        <option value="lastest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </Select>
                    <Select
                        maxW={'200px'}
                        minW={{ base: undefined, lg: '150px' }}
                        alignSelf='end'
                        onChange={handleChanges}
                        name='status'
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="received">Received</option>
                        <option value="returned">Returned</option>
                    </Select>
                </Stack>
            </Stack>
            <Stack
                spacing={7}
            >
                {vendorOrders.isLoading ? <Center>
                    <CircularProgress isIndeterminate color='brand_primary.500' />
                </Center>
                    : vendorOrders.orders.length > 0 ? vendorOrders.orders.map((order, index) => {
                        return <OrderItem key={index} order={order} />
                    }) : <Center>
                        <Text>No Orders</Text>
                    </Center>
                }
            </Stack >
        </Stack>
    )
}

export default Orders