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
    Heading
} from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext';
import { LazyImage } from '../../components';

import { MdCancel } from 'react-icons/md'
import { GrFormView } from 'react-icons/gr'

function WishList() {

    const [wishlist, setwishlist] = useState({
        isLoading: true,
        products: [],
        totalProducts: null
    });

    const { getWishList, removeFromWishList, user } = useAppContext();

    const fetchProducts = async () => {

        if (user) {
            const { products, count } = await getWishList();
            console.log({ products, count })

            setwishlist({
                isLoading: false,
                products: [...products],
                totalProducts: count
            })
        } else {
            setwishlist(prev => ({
                ...prev,
                isLoading: true,
            }))
        }
    }

    const remove = (productID) => {
        setwishlist(prev => ({
            ...prev,
            isLoading: true,
        }))
        removeFromWishList(productID)
        fetchProducts()
    }


    useEffect(() => {
        fetchProducts()
    }, [user])


    return (
        <Center
            minH={'calc(98vh - var(--nav-height))'}
            py={'20px'}
        >
            <Stack align={'center'}>
                <Heading>Wishlist</Heading>
                {wishlist.isLoading && user ?
                    <Center h={'100%'} minW={'50vw'}>
                        <Spinner />
                    </Center> :
                    !wishlist.isLoading && wishlist.products.length === 0 ? <Text>Add Some Items to your wishlist and we will notify you once it becomes available</Text> :
                        user && wishlist.products.length > 0 ? <Stack>
                            {!wishlist.isLoading && wishlist.products.length > 0 && wishlist.products.map((product, index) => {
                                return (
                                    <Stack m={0} p={0} h='100px' borderRadius='10px' border='1px solid red' align='center' direction='row' key={index} justifyContent='space-between'>

                                        <Stack align='center' direction='row'>
                                            <LazyImage
                                                key={index}
                                                src={product.images[0]}
                                                h={'100px'}
                                                objectFit={'cover'}
                                            />
                                            <Text>{product.name}</Text>
                                        </Stack>
                                        <Center borderRightRadius='10px' bg='red' height='full' px='5px' onClick={() => remove(product._id)} cursor='pointer' >
                                            <MdCancel
                                                color='white'
                                                size={'20px'}
                                            />
                                        </Center>
                                    </Stack>
                                )
                            })}
                        </Stack> : <Text>Please Login to view</Text>
                }
            </Stack>
        </Center>
    )
}

export default WishList