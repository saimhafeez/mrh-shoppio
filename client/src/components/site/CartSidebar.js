import React, { useEffect, useState } from 'react'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
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
    Avatar,
    ButtonGroup,
    Heading,
    Divider,
    Center,
    Skeleton,
    CircularProgress
} from '@chakra-ui/react'
import CartItem from './CartItem'
import { useAppContext } from '../../context/appContext'
import PriceComponent from './PriceComponent'
import { fetchCartProduct } from '../../utils/FetchCartProducts'
import { useNavigate } from 'react-router-dom';

function CartSidebar({ isOpen, onOpen, onClose }) {

    const navigate = useNavigate();

    const [cartProducts, setCartProducts] = useState({
        isLoading: true,
        products: []
    })

    const [cartTotal, setCartTotal] = useState(0)


    const { cart, getSingleProduct } = useAppContext()

    const init = () => {
        fetchCartProduct({
            cart,
            getSingleProduct
        }).then((products) => {
            setCartProducts({
                isLoading: false,
                products
            })
            for (const item of products) {
                setCartTotal(prev => prev + (item.product.price * item.quantity))
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        setCartTotal(0)
        setCartProducts({
            isLoading: true,
            products: []
        })
        init();
    }, [cart])

    const navigateToCheckout = () => {
        navigate('/shop/checkout');
        onClose()
    }

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>My Cart</DrawerHeader>
                    <DrawerBody>
                        <Stack
                            direction={'column'}
                            spacing={5}
                        >
                            {cartProducts.isLoading &&
                                <Center
                                    h={'50vh'}
                                >
                                    <CircularProgress
                                        isIndeterminate
                                        color='brand_primary.500'
                                    />
                                </Center>
                            }
                            {!cartProducts.isLoading && cartProducts.products.length > 0 &&
                                cartProducts.products.map((item, index) => {
                                    return <CartItem
                                        key={index}
                                        product={item.product}
                                        quantity={item.quantity}
                                    />
                                })
                            }
                            {!cartProducts.isLoading && cartProducts.products.length === 0 &&
                                <Text>Add Some Products to Cart</Text>
                            }
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            w={'full'}
                        >
                            <PriceComponent price={cartTotal.toFixed(2)} />

                            <Button
                                borderRadius={0}
                                variant='outline'
                                colorScheme='brand_secondary'
                                onClick={navigateToCheckout}
                                isDisabled={cartProducts.isLoading}
                            >Checkout</Button>
                        </Stack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default CartSidebar