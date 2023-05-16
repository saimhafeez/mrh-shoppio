import React, { useEffect, useState } from 'react'

import { AiOutlinePlus, AiOutlineMinus, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
    Wrap,
    Text,
    Card,
    Stack,
    Button,
    Avatar,
    ButtonGroup,
    Heading,
    Divider,
    Center,
    Skeleton
} from '@chakra-ui/react';
import LazyImage from '../LazyImage';
import { useAppContext } from '../../context/appContext';

function CartItem({ product, quantity }) {

    const [productQuantity, setProductQuantity] = useState()

    const { displayAlert, addCartToLocalStorage, removeCartFromLocalStorage, cart } = useAppContext()

    const increaseProductQuantity = () => {

        if (productQuantity >= product.stock) {
            displayAlert({
                alertStatus: 'info',
                alertText: 'Quantity exceedes the Stock'
            })
        } else {
            setProductQuantity(productQuantity + 1)
            addCartToLocalStorage({
                productId: product._id,
                quantity: 1
            }, cart)
        }

    }

    const decreaseProductQuantity = () => {

        if (productQuantity !== 1) {
            setProductQuantity(productQuantity - 1)
        }
        removeCartFromLocalStorage(product._id, cart)

    }

    useEffect(() => {
        setProductQuantity(quantity)
    }, [])

    const quantityComponent = () => {
        return <Stack
            direction={'row'}
            align={'center'}
            bg={'white'}
            borderRadius={'10px'}
            color={'brand_primary.500'}
            border={'1px solid var(--chakra-colors-brand_primary-500)'}
            boxSizing='border-box'
        >
            <Box
                p={2}
                px={4}
                borderRight={'1px solid var(--chakra-colors-brand_primary-500)'}
                cursor={'pointer'}
                onClick={decreaseProductQuantity}
            >
                <AiOutlineMinus />
            </Box>
            <Box
                p={2}
                px={5}
                fontSize={'lg'}
            >
                {productQuantity}
            </Box>
            <Box
                p={2}
                px={4}
                borderLeft={'1px solid var(--chakra-colors-brand_primary-500)'}
                cursor={'pointer'}
                onClick={increaseProductQuantity}
            >
                <AiOutlinePlus />
            </Box>
        </Stack>
    }



    return (
        <Box>
            <Stack
                direction='row'
            // p='20px'
            >
                <LazyImage src={product.images[0]} maxW='90px' />
                <Stack
                    direction={'column'}
                >
                    <Text>{product.name}</Text>
                    {quantityComponent()}
                </Stack>
            </Stack>
            {/* <Button w='full' variant='outline'>Remove</Button> */}
            {/* <Divider /> */}
        </Box>
    )
}



export default CartItem