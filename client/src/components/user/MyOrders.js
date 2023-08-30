import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/appContext'
import { Box, Card, Center, CircularProgress, Stack, Text, Wrap } from '@chakra-ui/react';
import LazyImage from '../LazyImage';
import { BsClipboardFill } from 'react-icons/bs'

function MyOrders() {

    const { getCustomerOrders } = useAppContext();

    const [orders, setOrders] = useState({
        isLoading: true,
        customerOrders: []
    })

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            try {
                const customerOrders = await getCustomerOrders();
                resolve(customerOrders)
            } catch (error) {
                reject(error)
            }
        }).then((customerOrders) => {
            console.log('customerOrders', customerOrders);
            setOrders({
                isLoading: false,
                customerOrders
            })
        })
    }, [])

    return (
        <Stack
            direction='column'
        >
            {orders.isLoading && <Center>
                <CircularProgress isIndeterminate />
            </Center>}

            {!orders.isLoading && orders.customerOrders && orders.customerOrders.length == 0 && <Center>
                <Text>No Orders Found!</Text>
            </Center>}

            {orders.customerOrders && orders.customerOrders != [] && orders.customerOrders.map((order, index) => {
                return (
                    <Card
                        id={index}
                        p='1rem'
                    >
                        <Stack direction='row' alignItems='center' justifyContent='space-between' wrap='wrap'>
                            <Box>
                                <Text fontWeight='bold'>
                                    Order ID
                                </Text>
                                <Stack color='brand_primary.500' backgroundColor='gray.200' p='5px' borderRadius='6px' direction='row' alignItems='center' >
                                    <BsClipboardFill />
                                    <Text>{order._id}</Text>
                                </Stack>
                            </Box>

                            <Box>
                                <Text fontWeight='bold'>
                                    Status
                                </Text>
                                <Stack color='brand_primary.500' backgroundColor='gray.200' p='5px' borderRadius='6px' direction='row' alignItems='center' >
                                    <Text>{order.status}</Text>
                                </Stack>
                            </Box>
                        </Stack>

                        <Wrap marginTop='12px'>
                            {order.products.map((product, index) => {
                                return (
                                    <Stack
                                        backgroundColor='gray.100' borderRadius='12px'
                                        w={{ base: '100%', lg: 'fit-content' }}
                                        direction='column'
                                        alignItems='center'
                                    >
                                        <LazyImage
                                            src={product.product.images[0]} maxW='100px'
                                        />
                                        <Text padding='5px 10px'>
                                            {product.product.name} -x{product.quantity}
                                        </Text>
                                    </Stack>
                                )
                            })}
                        </Wrap>

                        <Stack
                            marginTop='12px'
                            direction='row' alignItems='center' justifyContent='space-between' wrap='wrap'>
                            <Box>
                                <Text fontWeight='bold'>
                                    Order Placed
                                </Text>
                                <Stack color='brand_primary.500' backgroundColor='gray.200' p='5px' borderRadius='6px' direction='row' alignItems='center' >
                                    <Text>{new Date(order.createdAt).toLocaleString(
                                        'default', { day: 'numeric', month: 'long', year: 'numeric' }
                                    )}</Text>
                                </Stack>
                            </Box>

                            <Box>
                                <Text fontWeight='bold'>
                                    Status At Updated
                                </Text>
                                <Stack color='brand_primary.500' backgroundColor='gray.200' p='5px' borderRadius='6px' direction='row' alignItems='center' >
                                    <Text>{new Date(order.updatedAt).toLocaleString(
                                        'default', { day: 'numeric', month: 'long', year: 'numeric' }
                                    )}</Text>
                                </Stack>
                            </Box>
                        </Stack>

                    </Card>
                )
            })}

        </Stack >
    )
}

export default MyOrders