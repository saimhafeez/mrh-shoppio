import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/appContext';
import { Avatar, Box, Card, Center, CircularProgress, Heading, Image, Progress, Skeleton, Stack, Text, Wrap } from '@chakra-ui/react';
import { ProductCard } from '../../components/site';

import { AiFillShop, AiOutlineMail } from 'react-icons/ai'

function Vendor() {

    const vendorId = window.location.pathname
        .split("/")[window.location.pathname.split("/").length - 1]


    const { getVendorDetails } = useAppContext()

    const [vendor, setVendor] = useState({
        isLoading: true,
        vendorInfo: null,
        rating: null,
        reviews: null,
        popularProducts: []
    })

    const fetchVendorDetails = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { vendor } = await getVendorDetails(`vendorId=${vendorId}`)
                resolve(vendor)
            } catch (error) {
                reject(error)
            }
        }).then((vendor) => {
            setVendor({
                isLoading: false,
                ...vendor
            })
            console.log('vendor', vendor);
        })
    }

    useEffect(() => {
        fetchVendorDetails()
    }, [])

    return (
        <>
            {vendor.isLoading ?
                <Center minH='calc(100vh - var(--nav-height))'>
                    <CircularProgress isIndeterminate color='brand_primary.500' />
                </Center>
                :
                <Stack
                    direction='column'
                    spacing={0}
                >
                    <Box
                        py={20}
                        bg={'brand_background.vendorCover'}
                        textAlign='center'
                    >
                        <Box>
                            <Heading>
                                {vendor.vendorInfo && vendor.vendorInfo.shop.name}
                            </Heading>
                            <Text>{`by ${vendor.vendorInfo && vendor.vendorInfo.name}`}</Text>
                        </Box>
                    </Box>

                    <Stack
                        align='center'
                    >
                        <Text maxW='1000px' textAlign='justify' p={5} >
                            {vendor.vendorInfo && vendor.vendorInfo.shop.description}
                        </Text>
                        <Wrap
                            px={5}
                            w='full'
                            maxW='1000px'
                            justify='space-between'
                        >
                            <Stack
                                direction='row'
                                align='center'
                            >
                                <AiFillShop size='25px' />
                                <Text>
                                    {vendor.vendorInfo && vendor.vendorInfo.shop.address}
                                </Text>
                            </Stack>

                            <Stack
                                direction='row'
                                align='center'
                            >
                                <AiOutlineMail size='25px' />
                                <Text>
                                    {vendor.vendorInfo && vendor.vendorInfo.email}
                                </Text>
                            </Stack>
                        </Wrap>
                        <Box w='full' maxW='1000px'>
                            {vendor.vendorInfo &&
                                <Text textAlign={{ base: 'center', lg: 'end' }} p={5} fontWeight='bold'>
                                    {`Member Since ${new Date(vendor.vendorInfo.createdAt).toLocaleString(
                                        'default', { month: 'long', year: 'numeric' }
                                    )}`}
                                </Text>
                            }
                        </Box>
                    </Stack>

                    <Box
                        p={10}
                    >
                        <Heading mb={5} textAlign='center' fontSize='2xl'>Popular Produts</Heading>
                        <Wrap
                            px={{ base: 0, lg: 10 }}
                            py={2}
                            justify='center'
                        >
                            {vendor.popularProducts && vendor.popularProducts.length > 0 ? vendor.popularProducts && vendor.popularProducts.map((product, index) => {
                                return <ProductCard
                                    key={index}
                                    name={product.name}
                                    imageList={product.images}
                                    categories={product.categories}
                                    price={product.price}
                                    description={product.description}
                                    productID={product._id}
                                    stock={product.stock}
                                />
                            }) : <Text>No Products Found</Text>}
                        </Wrap>
                    </Box>

                    <Stack p={10}>
                        <Heading mb={5} textAlign='center' fontSize='2xl'>
                            Vendor Reviews
                        </Heading>

                        {vendor.reviews && vendor.reviews.splice(0, 3).map((item, index) => {
                            return <Card
                                key={index}
                                p={5}
                                borderRadius={'10px'}
                            // align='center'
                            >
                                <Stack
                                    direction={{ base: 'column', lg: 'row' }}
                                    spacing={5}
                                >
                                    <Stack
                                        direction={{ base: 'row', lg: 'column' }}
                                        align='center'
                                    >
                                        <Avatar name={item.customer.name} />
                                        <Text
                                            display={{ base: 'block', lg: 'none' }}
                                            // fontStyle={'italic'}
                                            fontWeight={'bold'}
                                            // opacity={'0.6'}
                                            color={'brand_primary.200'}
                                        >
                                            {item.customer.name}
                                        </Text>
                                    </Stack>
                                    <Stack
                                        direction={{ base: 'column-reverse', lg: 'row' }}
                                    >
                                        <Box
                                            w={'full'}
                                        >
                                            <Wrap
                                                justify='space-between'
                                            >
                                                <Text
                                                    display={{ base: 'none', lg: 'block' }}
                                                    // fontStyle={'italic'}
                                                    fontWeight={'bold'}
                                                    // opacity={'0.6'}
                                                    color={'brand_primary.200'}
                                                >
                                                    {item.customer.name}
                                                </Text>
                                                <Text
                                                    fontWeight={'bold'}
                                                    color={'brand_primary.200'}
                                                    textAlign='end' display={{ base: 'none', lg: 'block' }} >{item.productName}</Text>
                                            </Wrap>
                                            <Text textAlign='justify' >
                                                {item.review.review}
                                            </Text>

                                            <Stack
                                                direction={'row'}
                                                justifyContent={'end'}
                                                align={'center'}
                                            >
                                                {['😡', '😕', '😐', '😃', '🤩'].map((emoji, index) => {
                                                    return <Text
                                                        key={index}
                                                        opacity={index + 1 === item.review.rating ? '1' : '0.2'}
                                                        fontSize={index + 1 === item.review.rating ? 'lg' : 'md'}
                                                    >
                                                        {emoji}
                                                    </Text>
                                                })}
                                            </Stack>
                                        </Box>
                                        <Image src={item.productImage} w={{ base: 'auto', lg: '100px' }} objectFit='contain' />
                                        <Text fontWeight='bold' textAlign='center' display={{ base: 'block', lg: 'none' }} >{item.productName}</Text>
                                    </Stack>
                                </Stack>
                            </Card>
                        })}
                    </Stack>
                </Stack>
            }
        </>
    )
}

export default Vendor