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
    Heading,
    CircularProgress
} from '@chakra-ui/react'
import InputCompnent from '../InputCompnent';
import { useAppContext } from '../../context/appContext';
import LazyImage from '../LazyImage';

function TrackOrder() {

    const [trackingId, setTrackingId] = useState("");
    const [tOrder, setTOrder] = useState({
        isLoading: false,
        order: null
    });

    const { trackOrder } = useAppContext();

    const trackProduct = () => {
        setTOrder({
            isLoading: true,
            order: null
        })
        new Promise(async (resolve, reject) => {
            try {
                const order = await trackOrder(trackingId);
                resolve(order)
            } catch (error) {
                reject(error)
            }
        }).then((order) => {
            setTOrder({
                isLoading: false,
                order: order.order
            })

            console.log(order);

        }).catch((err) => {
            // console.log(err);

            setTOrder({
                isLoading: false,
                order: null
            })
        })
    }

    const shippingDetailItem = ({ width, label, value, color }) => {
        return <Stack
            direction='column'
            w={width}
        >
            <Text>{label}</Text>
            <Input type='text' name={label}
                value={value}
                disabled={true}
                _disabled={{
                    color: color || 'var(--chakra-colors-brand_primary-500)',
                    fontWeight: 'bold'
                }}
            />
        </Stack>
    }

    return (
        <Center
            py={'20px'}
        >
            <Stack align={'center'}>
                <Heading>Track Order</Heading>
                <Stack direction='row'>
                    <InputCompnent value={trackingId} handleChange={(e) => setTrackingId(e.target.value)} name='ID' placeholder='Enter Tracking id' />
                    <Button onClick={trackProduct}>Track</Button>
                </Stack>

                {tOrder.isLoading && <CircularProgress isIndeterminate />}

                {!tOrder.isLoading && tOrder.order &&
                    <Card padding={{ base: '5px', lg: '15px' }} w='100%'>
                        <Text fontWeight='bold'>Order Details</Text>
                        <Stack direction='row' marginTop='12px'>
                            {tOrder.order.products.map((product, index) => {
                                return <Stack
                                    backgroundColor='gray.100' borderRadius='12px'
                                    w={{ base: '100%', lg: 'fit-content' }}
                                    direction='column'
                                    alignItems='center'
                                    key={index}
                                >
                                    <LazyImage
                                        src={product.product.images[0]} maxW='100px'
                                    />
                                    <Text padding='5px 10px'>
                                        {product.product.name} -x{product.quantity}
                                    </Text>
                                </Stack>
                            })}
                        </Stack>
                        <Stack spacing={2} marginTop='12px'>
                            <Text fontWeight='bold'>Shipping Details</Text>
                            {
                                <Stack
                                    direction={'column'}
                                    spacing='3'
                                >
                                    {
                                        shippingDetailItem({
                                            width: '100%',
                                            label: 'Country',
                                            value: tOrder.order.shippingAddress.country
                                        })
                                    }
                                    <Stack
                                        direction='row'
                                    >
                                        {
                                            shippingDetailItem({
                                                width: '50%',
                                                label: 'First Name',
                                                value: tOrder.order.shippingAddress.firstName
                                            })
                                        }
                                        {
                                            shippingDetailItem({
                                                width: '50%',
                                                label: 'Last Name',
                                                value: tOrder.order.shippingAddress.lastName
                                            })
                                        }
                                    </Stack>
                                    {
                                        shippingDetailItem({
                                            width: '100%',
                                            label: 'Address',
                                            value: tOrder.order.shippingAddress.address
                                        })
                                    }
                                    <Stack
                                        direction='row'
                                    >
                                        {
                                            shippingDetailItem({
                                                width: '50%',
                                                label: 'City',
                                                value: tOrder.order.shippingAddress.city
                                            })
                                        }
                                        {
                                            shippingDetailItem({
                                                width: '50%',
                                                label: 'Postal Code',
                                                value: tOrder.order.shippingAddress.postalCode
                                            })
                                        }
                                    </Stack>
                                </Stack>
                            }
                            {
                                shippingDetailItem({
                                    width: '100%',
                                    label: 'Order Status',
                                    value: tOrder.order.status,
                                    color: 'var(--chakra-colors-brand_secondary-500)'
                                })
                            }
                        </Stack>
                    </Card>
                }
            </Stack>
        </Center >
    )
}

export default TrackOrder