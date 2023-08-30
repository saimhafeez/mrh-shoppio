import React, { useEffect, useState } from 'react'

import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Stack,
    Card,
    Box,
    Wrap,
    Select,
    Text,
    CircularProgress,
    Center,
    Skeleton,
    Badge,
    Heading,
    Accordion,
    AccordionPanel,
    AccordionItem,
    AccordionButton,
    Checkbox
} from '@chakra-ui/react'

import { IoWallet, IoCartSharp } from 'react-icons/io5'
import { RiStarSmileFill } from 'react-icons/ri'
import { useAppContext } from '../../../context/appContext'
import { PriceComponent } from '../../../components/site';
import { StatsGraph } from '../../../components/vendor'
import { BiNotification } from 'react-icons/bi'

function Stats() {


    const { getSaleStats, getProductStats, getReviewStats, getOrderStats, displayAlert, getNotifications, user } = useAppContext();

    const [sales, setSales] = useState({
        isLoading: true,
        salesPeriod: 'today',
        orders: null,
        totalSale: 0
    })

    const [productsSold, setProductSold] = useState({
        isLoading: true,
        productsCount: 0,
        popularProduct: null,
    })

    const [vendorReviews, setVendorReviews] = useState({
        isLoading: true,
        reviews: null,
        count: 0
    })

    const [ordersStatus, setOrdersStatus] = useState({
        isLoading: true,
        returned: 0,
        pending: 0
    })

    const [notifications, setNotification] = useState({
        isLoading: true,
        list: null,
        count: 0,
        showReadOnly: false
    })

    const fetchSales = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { orders, totalSale } = await getSaleStats(`?salesPeriod=${sales.salesPeriod}`)
                resolve({ orders, totalSale })
            } catch (error) {
                reject(error)
            }
        }).then(({ orders, totalSale }) => {
            console.log({ orders, totalSale })
            setSales(prev => ({
                ...prev,
                orders,
                totalSale,
                isLoading: false
            }))
        }).catch((error) => {
            displayAlert({
                alertStatus: 'error',
                alertText: error
            })
        })
    }

    const fetchProductsSold = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { productsCount, popularProduct } = await getProductStats();
                resolve({ productsCount, popularProduct });
            } catch (error) {
                reject(error)
            }
        }).then(({ productsCount, popularProduct }) => {

            console.log({ productsCount, popularProduct });
            setProductSold({
                isLoading: false,
                productsCount,
                popularProduct
            })
        }).catch((error) => {
            console.log(error);
        })
    }


    const fetchVendorReviews = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { reviews, count } = await getReviewStats();
                resolve({ reviews, count });
            } catch (error) {
                reject(error)
            }
        }).then(({ reviews, count }) => {

            setVendorReviews({
                isLoading: false,
                reviews,
                count
            })
        }).catch((error) => {
            console.log(error);
        })
    }


    const fetchOrderStatus = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { returned, pending } = await getOrderStats();
                resolve({ returned, pending });
            } catch (error) {
                reject(error)
            }
        }).then(({ returned, pending }) => {

            setOrdersStatus({
                isLoading: false,
                returned,
                pending
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    const fetchNotifications = () => {

        return new Promise(async (resolve, reject) => {
            try {
                const { notifications, count } = await getNotifications(user._id);
                resolve({ notifications, count })
            } catch (error) {
                reject(error)
            }
        })

    }

    useEffect(() => {
        fetchSales()
        fetchProductsSold()
        fetchVendorReviews()
        fetchOrderStatus()

        fetchNotifications().then(({ notifications, count }) => {

            setNotification(prev => ({
                ...prev,
                isLoading: false,
                list: notifications,
                count
            }))

            console.log({ notifications, count })

        }).catch((error) => {
            console.log(error)
        })

    }, [])

    useEffect(() => {
        fetchSales();
    }, [sales.salesPeriod])

    const handlesalesPeriodChange = (e) => {
        setSales(prev => ({
            ...prev,
            isLoading: true,
            salesPeriod: e.target.value
        }))
    }

    const statsComponents = ({ topComponent, middleComponent, bottomComponent, icon }) => {
        return <Card
            w='full'
            px={10}
            py={5}
            justify='center'
        >
            <Wrap
                direction='row'
                align='center'
                justify='center'
            >
                <Stat>
                    <StatLabel fontWeight='bold' color='gray.400' mb={2}>
                        {topComponent}
                    </StatLabel>
                    <StatNumber mb={2}>{middleComponent && middleComponent}</StatNumber>
                    <StatHelpText>
                        {bottomComponent && bottomComponent}
                    </StatHelpText>
                </Stat>


                <Box
                    color='brand_background.light'
                    borderRadius='full'
                    bg='brand_primary.500'
                    p={2}
                >
                    {icon && icon}
                </Box>
            </Wrap>
        </Card >
    }

    const notificationComponent = (notification) => {

        const regex = /!(.*?)!/g;
        const matches = notification.message.match(regex);

        const extractedStrings = matches.map(match => match.slice(1, -1));

        const result = notification.message.split(regex);

        const component = <Stack

            bg={'gray.50'}
            direction='column'
            p={2}
            // borderBottom='1px solid var(--chakra-colors-brand_primary-100)'
            m={2}
            borderRadius='12px'
        >
            <Accordion onClick={() => {
                if (notification.isRead) {
                    // TODO: CALL NOTIFICATION STATUS UPDATE
                }
            }} allowToggle border={'transparent'} w='full'>
                <AccordionItem>
                    <AccordionButton>
                        <Wrap align='center' color='brand_secondary.500'>
                            {!notification.isRead && <BiNotification />}
                            <Text color={'brand_secondary.500'} fontWeight='bold'>
                                {notification.title}
                            </Text>
                        </Wrap>
                    </AccordionButton>
                    <AccordionPanel>
                        <Text>{result}</Text>
                        <Text
                            color={'brand_secondary.500'}
                            fontWeight='bold'
                            fontSize='sm'
                            mt={2}
                        >
                            {new Date(notification.createdAt).toLocaleString('default', {
                                hourCycle: 'h12'
                            })}
                        </Text>
                    </AccordionPanel>

                    {/* <p>{notification.isRead.toString()}</p> */}

                </AccordionItem>
            </Accordion>
            {/* <Wrap
                align='center'

            >
                {
                    result.map((item, index) => {

                        for (const string of extractedStrings) {
                            if (item === string) {
                                return <Badge key={index} w='fit-content'
                                    colorScheme='brand_primary'
                                >
                                    {string}
                                </Badge>
                            }
                        }

                        return <Text key={index}>
                            {item}
                        </Text>

                    })
                }
            </Wrap> */}

        </Stack>

        return component
    }

    return (
        <Stack
            w='100%'
            direction={{ base: "column-reverse", lg: "column" }}
            spacing={10}
        >
            <Stack
                direction={{ base: "column", lg: "row" }}
                p={2}

            >
                {
                    statsComponents({
                        topComponent: (<Select
                            variant="filled"
                            w='fit-content'
                            onChange={handlesalesPeriodChange}
                        >
                            <option value='today'>Today's Sale</option>
                            <option value='last7days'>Last 7 Day's Sale</option>
                            <option value='last30days'>Last 30 Day's Sale</option>
                            <option value='lastyear'>Last Year's Sale</option>
                        </Select>),
                        middleComponent: (
                            <Skeleton
                                isLoaded={!sales.isLoading}
                            >
                                <PriceComponent price={sales.totalSale.toFixed(2)} />
                            </Skeleton>
                        ),
                        bottomComponent: (
                            <Skeleton
                                isLoaded={!sales.isLoading}
                            >
                                <Wrap
                                    align='center'
                                    spacing="2"
                                >
                                    <Text
                                        fontWeight='bold'
                                        color='gray.400'
                                    >Orders Placed</Text>
                                    <Badge>{sales.orders && sales.orders.length}</Badge>
                                </Wrap>

                            </Skeleton>
                        ),
                        icon: (<IoWallet size='30px' />)
                    })
                }
                {
                    statsComponents({
                        topComponent: (<Text>Products Sold</Text>),
                        middleComponent: (
                            <Skeleton
                                isLoaded={!productsSold.isLoading}
                            >
                                <Text
                                    color='brand_primary.500'
                                    fontWeight='bold'
                                >
                                    {productsSold.productsCount}
                                </Text>
                            </Skeleton>
                        ),
                        bottomComponent: (
                            <Skeleton
                                isLoaded={!productsSold.isLoading}
                            >
                                <Wrap
                                    align='center'
                                    spacing="2"
                                >
                                    <Text
                                        fontWeight='bold'
                                        color='gray.400'
                                    >Most Sold</Text>
                                    <Badge>{productsSold.popularProduct ? productsSold.popularProduct.name : "No Sales"}</Badge>
                                </Wrap>

                            </Skeleton>
                        ),
                        icon: (<IoCartSharp size='30px' />)
                    })
                }
                {statsComponents({
                    topComponent: (
                        <Text>
                            Reviews
                        </Text>
                    ),
                    middleComponent: (
                        <Skeleton
                            isLoaded={!vendorReviews.isLoading}
                        >
                            <Text
                                color='brand_primary.500'
                                fontWeight='bold'
                            >
                                {vendorReviews.count}
                            </Text>
                        </Skeleton>
                    ),
                    bottomComponent: (
                        <Skeleton
                            isLoaded={!vendorReviews.isLoading}
                        >
                            <Wrap
                                align='center'
                                spacing="2"
                            >
                                <Stack>
                                    <Text fontWeight='black'>Popular</Text>
                                    <Badge
                                        variant='outline'
                                        colorScheme='brand_primary'
                                    >
                                        <Stack
                                            direction='row'
                                            align='center'
                                        >
                                            <Text>
                                                {vendorReviews.reviews ? vendorReviews.reviews[0].product : "No Reviews Yet"}
                                            </Text>
                                            <StatArrow type='increase' />
                                        </Stack>
                                    </Badge>
                                </Stack>

                                <Stack>
                                    <Text fontWeight='black'>Unpopular</Text>
                                    <Badge
                                        variant='outline'
                                        colorScheme='brand_secondary'
                                    >
                                        <Stack
                                            direction='row'
                                            align='center'
                                        >
                                            <Text>
                                                {vendorReviews.reviews ? vendorReviews.reviews[vendorReviews.reviews.length - 1].product : "No Reviews Yet"}
                                            </Text>
                                            <StatArrow type='decrease' />
                                        </Stack>
                                    </Badge>
                                </Stack>
                            </Wrap>

                        </Skeleton>
                    ),
                    icon: <RiStarSmileFill size='30px' />
                })}
            </Stack>

            <Stack
                w='100%'
                direction={{ base: 'column', lg: 'row' }}
                pb={5}
                align='center'
            >
                <Box w='full' >
                    <StatsGraph />
                </Box>
                <Box
                    direction='column'
                    pr={5}
                >
                    <Card
                        w={'250px'}
                        // p={1}
                        align='center'
                        h='full'
                        borderRadius='10px'
                    >
                        <Box bg='brand_primary.500' w='full' borderTopRadius='10px' >
                            <Heading textAlign='center' color='white' py={1} fontSize='xl'>Notifications</Heading>
                        </Box>

                        <Checkbox onChange={(e) => {
                            setNotification(prev => ({
                                ...prev,
                                showReadOnly: e.target.checked
                            }))
                        }} alignSelf='start' p={1}>Show Unread Only</Checkbox>
                        <Stack
                            overflow='auto'
                            h='300px'
                            w='100%'
                            p={1}
                            className='custom_scrollbar'
                        >
                            {notifications.isLoading ? <Center>
                                <CircularProgress size='12px' isIndeterminate color='brand_primary.500' />
                            </Center> :
                                notifications.list.filter((notification) => {
                                    if (notifications.showReadOnly) {
                                        return !notification.isRead && notification;
                                    } else {
                                        return notification;
                                    }
                                }).map((notification, index) => {
                                    return notificationComponent(notification)
                                })
                            }
                        </Stack>
                    </Card>
                </Box>
            </Stack>

        </Stack>
    )
}

export default Stats