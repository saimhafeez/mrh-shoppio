import React, { useEffect, useState } from 'react'

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
import { orderStatusList } from '../../utils/OrderStatusList'
import { PriceComponent } from '../site'
import { useAppContext } from '../../context/appContext'

function OrderItem({ order }) {

    const { updateOrderStatus } = useAppContext();

    const [statusListComponent, setStatusListComponent] = useState({
        isLoading: false,
        expandStatusList: false,
        label: order.status
    })

    const [orderUpdatedDate, setOrderUpdatedDate] = useState(order.updatedAt)

    const getDateAndTime = (timeStamp, isShort) => {
        const date = new Date(timeStamp);

        const _month = isShort ? "short" : "long";
        const _day = isShort ? "2-digit" : "numeric";
        const _year = isShort ? "2-digit" : "numeric";

        const day = date.toLocaleString("en-us", { weekday: 'long' });
        const dateStr = date.toLocaleDateString("en-us", { month: _month, day: _day, year: _year });
        const timeStr = date.toLocaleTimeString("en-us", { hour: "numeric", minute: "numeric", second: "numeric" });

        if (isShort) {
            return `${dateStr} at ${timeStr}`;
        }

        return `${day}, ${dateStr} at ${timeStr}`;
    }

    const shippingDetailItem = ({ width, label, value }) => {
        return <Stack
            direction='column'
            w={width}
        >
            <Text>{label}</Text>
            <Input type='text' name={label}
                value={value}
                disabled={true}
                _disabled={{
                    color: 'var(--chakra-colors-brand_primary-500)',
                    fontWeight: 'bold'
                }}
            />
        </Stack>
    }

    const totalPrice = (cart) => {

        var price = 0;
        for (const item of cart) {
            price += (item.product.price * item.quantity)
        }

        return price
    }

    const awaitForOrderStatusUpdate = (orderStatus) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { updatedOrder } = await updateOrderStatus(order._id, orderStatus)
                resolve(updatedOrder)
            } catch (error) {
                reject(error)
            }
        })
    }

    const updateStatus = (orderStatus) => {

        console.log('orderStatus', orderStatus)

        setStatusListComponent(prev => ({
            ...prev,
            isLoading: true,
            expandStatusList: true,
        }))

        awaitForOrderStatusUpdate(orderStatus).then((updatedOrder) => {
            console.log('updatedOrder', updatedOrder)
            setStatusListComponent(prev => ({
                ...prev,
                isLoading: false,
                label: updatedOrder.status
            }))

            setOrderUpdatedDate(updatedOrder.updatedAt)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <Card>
            <Accordion allowMultiple>
                <AccordionItem>
                    <AccordionButton
                        m={0}
                        p={0}
                    >
                        <Stack
                            direction={{ base: 'column', lg: 'row' }}
                            justifyContent={'space-between'}
                            bg='gray.200'
                            borderRadius='5px'
                            p={5}
                            align='center'
                            borderBottomRadius={0}
                            w='full'
                        >
                            <Text
                                fontWeight='bold'
                                color='brand_primary.500'
                            >
                                {`Order: ${order._id}`}
                            </Text>
                            <Box
                                color='gray.400'
                            >
                                <Stack
                                    direction='row'
                                >
                                    <Text
                                        fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }}
                                        fontWeight='bold'
                                        w={'108px'}
                                        align='end'
                                    >
                                        Placed
                                    </Text>
                                    <Text
                                        fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }}
                                        fontWeight='bold'
                                    >
                                        : {getDateAndTime(order.createdAt, true)}
                                    </Text>
                                </Stack>

                                <Stack
                                    direction='row'
                                >
                                    <Text
                                        fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }}
                                        fontWeight='bold'
                                        w={'108px'}
                                        align='end'
                                    >
                                        Last Updated
                                    </Text>
                                    <Text
                                        fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }}
                                        fontWeight='bold'
                                    >
                                        : {getDateAndTime(orderUpdatedDate, true)}
                                    </Text>
                                </Stack>
                            </Box>
                        </Stack>
                    </AccordionButton>
                    <AccordionPanel>
                        <Stack
                            p={5}
                        >
                            <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton>

                                        <Stack direction='row' align='center'>
                                            <Text>{`Cart Items [ ${order.products.length} ]`}</Text>
                                        </Stack>
                                        <AccordionIcon />
                                    </AccordionButton>

                                    <AccordionPanel>
                                        <Wrap
                                            justify='center'
                                        >
                                            {
                                                order.products.map((item, index) => {
                                                    return <Stack
                                                        key={index}
                                                        direction={'column'}
                                                        w='200px'
                                                        justifyContent='center'
                                                        bg='gray.100'
                                                        borderRadius='10px'
                                                        p='15px'
                                                    >
                                                        <Image src={item.product.images[0]} h='200px' objectFit='contain' />
                                                        <Text>{`${item.product.name} - x${item.quantity}`}</Text>
                                                    </Stack>
                                                })
                                            }
                                        </Wrap>
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <AccordionButton>
                                        Shipping Details
                                        <AccordionIcon />
                                    </AccordionButton>

                                    <AccordionPanel>
                                        <Stack
                                            direction={'column'}
                                            spacing='3'
                                        >
                                            {
                                                shippingDetailItem({
                                                    width: '100%',
                                                    label: 'Country',
                                                    value: order.shippingAddress.country
                                                })
                                            }
                                            <Stack
                                                direction='row'
                                            >
                                                {
                                                    shippingDetailItem({
                                                        width: '50%',
                                                        label: 'First Name',
                                                        value: order.shippingAddress.firstName
                                                    })
                                                }
                                                {
                                                    shippingDetailItem({
                                                        width: '50%',
                                                        label: 'Last Name',
                                                        value: order.shippingAddress.lastName
                                                    })
                                                }
                                            </Stack>
                                            {
                                                shippingDetailItem({
                                                    width: '100%',
                                                    label: 'Address',
                                                    value: order.shippingAddress.address
                                                })
                                            }
                                            <Stack
                                                direction='row'
                                            >
                                                {
                                                    shippingDetailItem({
                                                        width: '50%',
                                                        label: 'City',
                                                        value: order.shippingAddress.city
                                                    })
                                                }
                                                {
                                                    shippingDetailItem({
                                                        width: '50%',
                                                        label: 'Postal Code',
                                                        value: order.shippingAddress.postalCode
                                                    })
                                                }
                                            </Stack>
                                        </Stack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>

                            <Wrap
                                align='center'
                                p={3}
                                justify='space-between'
                            >
                                {PriceComponent({
                                    price: totalPrice(order.products).toFixed(2),
                                    componentSize: 'larger'
                                })}

                                <Stack
                                    h='fit-content'
                                    onClick={!statusListComponent.isLoading ? () => setStatusListComponent(prev => ({
                                        ...prev,
                                        expandStatusList: !prev.expandStatusList
                                    })) : () => { }}
                                    cursor={statusListComponent.isLoading ? 'progress' : 'pointer'
                                    }
                                    bg={orderStatusList[statusListComponent.label].backgroundColor}
                                    border={`2px solid ${orderStatusList[statusListComponent.label].borderColor}`}
                                    fontWeight='bold'
                                    color={orderStatusList[statusListComponent.label].borderColor}
                                    borderRadius={'10px'}
                                    p={2}
                                >
                                    <Stack
                                        direction='column'

                                    >
                                        <Stack direction='row'
                                            align='center'
                                        >
                                            <Box
                                                className='_first-letter-uppercase'
                                            >{statusListComponent.label}</Box>
                                            {statusListComponent.isLoading ? <Center>
                                                <CircularProgress
                                                    isIndeterminate
                                                    size='20px'
                                                    color={orderStatusList[statusListComponent.label].borderColor}
                                                />
                                            </Center> : <AiFillCaretDown />}
                                        </Stack>
                                        <Stack
                                            display={!statusListComponent.expandStatusList ? 'none' : 'block'}
                                            direction='column'
                                        >
                                            {Object.keys(orderStatusList).map((orderStatusListItem, index) => {
                                                return statusListComponent.label !== orderStatusListItem && <Box
                                                    key={index}
                                                >
                                                    <Text
                                                        className='_first-letter-uppercase'
                                                        onClick={() => updateStatus(orderStatusListItem)}
                                                    >
                                                        {orderStatusListItem}
                                                    </Text>
                                                </Box>
                                            })}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Wrap>
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Card >
    )
}

export default OrderItem