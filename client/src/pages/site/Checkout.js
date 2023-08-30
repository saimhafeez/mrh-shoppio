import React, { useEffect, useState } from 'react'

import {
    Box,
    Wrap,
    Center,
    Stack,
    Badge,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Text,
    ButtonGroup,
    Divider,
    Spinner,
    Checkbox,
    CheckboxGroup,
    Tooltip,
    Flex,
    Image,
    Heading,
    Container,
    Card,
    Avatar,
    CircularProgress,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Input,
    Select,
    PinInput,
    PinInputField,
    HStack,
} from '@chakra-ui/react'
import { BsClipboardFill } from 'react-icons/bs'
import { useAppContext } from '../../context/appContext'
import { fetchCartProduct } from '../../utils/FetchCartProducts'
import LazyImage from '../../components/LazyImage'
import PriceComponent from '../../components/site/PriceComponent'
import credit from '../../assets/images/credit.png'

function Checkout() {

    const [currentForm, setCurrentForm] = useState(1)
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)

    const [cartProducts, setCartProducts] = useState({
        isLoading: true,
        products: []
    })

    const [cartTotal, setCartTotal] = useState(0)

    const { cart, getSingleProduct, displayAlert, submitOrder, user, clearCart, sendNotification } = useAppContext()

    const [placedOrders, setPlacedOrders] = useState({
        orders: null,
        ordersCount: 0
    })

    const [checkoutDetails, setCheckoutDetails] = useState({
        shippingAddress: {
            country: 'pakistan',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            postalCode: ''
        },
        card: {
            name: '',
            number: '',
            expiryDate: '',
            cvv: ''
        }
    })

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

    const getCurrentForm = () => {
        if (currentForm === 1) {
            return formOne({
                setCurrentForm,
                checkoutDetails,
                setCheckoutDetails,
                displayAlert
            })
        } else if (currentForm === 2) {
            return formTwo({
                cartProducts,
                cartTotal,
                setCurrentForm,
                handleSubmitOrder,
                isOrderProcessing,
                setCheckoutDetails,
                checkoutDetails
            })
        } else if (currentForm === 3) {
            return successfulForm({ placedOrders, copyToClipboard })
            // return orderSubmissionCallback()
        }
    }

    const orderSubmission = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const { orders, ordersCount } = await submitOrder({
                    cart,
                    customerID: user._id || null,
                    shippingAddress: checkoutDetails.shippingAddress
                })

                resolve({ orders, ordersCount });
            } catch (error) {
                reject(error)
            }
        })
    }

    const handleSubmitOrder = () => {
        setIsOrderProcessing(true)
        orderSubmission().then(async ({ orders, ordersCount }) => {
            setPlacedOrders({
                orders,
                ordersCount
            })
            const notifications = [];

            for (const order of orders) {

                const { notification } = await sendNotification({
                    userID: order.vendorID,
                    title: 'Order Placed',
                    message: `Order placed for !${order.shippingAddress.firstName + " " + order.shippingAddress.lastName}! & to be delivered in !${order.shippingAddress.city}!`
                })
                notifications.push(notification)
            }
            console.log(notifications)
            clearCart();
            setIsOrderProcessing(false)
            setCurrentForm(3)
            // const idArray = []
            // orders.map((order, indes) => {
            //     idArray.push(order._id);
            // })
            // const alertText = `${ordersCount} Order(s) Placed, your Tracking ID(s) ${ordersCount > 1 ? 'are' : 'is'} [ ${idArray.join(', ')} ]`
            // displayAlert({
            //     alertStatus: 'success',
            //     alertText: alertText
            // })
        }).catch((error) => {
            console.log(error)
        })
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                displayAlert({
                    alertType: 'success',
                    alertText: "Tracking ID copied to clipboard successfully!"
                })
            })
            .catch((error) => {
                displayAlert({
                    alertType: 'error',
                    alertText: "Unable to copy Tracking ID to clipboard:" + error
                })
            });
    }

    return (
        <Center
            boxSizing='border-box'
            minH={'calc(100vh - var(--nav-height))'}
        >
            {getCurrentForm()}

        </Center>
    )
}

const formOne = ({ setCurrentForm, checkoutDetails, setCheckoutDetails, displayAlert }) => {

    const handleForm = (e) => {
        setCheckoutDetails(prev => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                [e.target.name]: e.target.value
            }
        }))
    }

    const moveToNext = () => {

        const values = Object.values(checkoutDetails.shippingAddress)

        for (const value of values) {
            if (value == '') {
                displayAlert({
                    alertType: 'warning',
                    alertText: 'Fill all Fields'
                })
                return
            }
        }

        setCurrentForm(2);
    }

    return (
        <Card
            p={5}
            m={{ base: '10px', xl: '5px' }}
        >
            <Heading
                mb={5}
            >Shipping Details</Heading>
            <Stack
                direction={'column'}
                spacing='3'
            >
                <Select value={checkoutDetails.shippingAddress.country} name='country'
                    onChange={handleForm}
                >
                    <option value='pakistan'>Pakistan</option>
                    <option value='usa'>USA</option>
                    <option value='uae'>UAE</option>
                </Select>
                <Stack
                    direction='row'
                >
                    <Stack
                        direction={'column'}
                        w={'50%'}
                    >
                        <Text>First Name</Text>
                        <Input type='text' name='firstName'
                            onChange={handleForm}
                            value={checkoutDetails.shippingAddress.firstName}
                        />
                    </Stack>
                    <Stack
                        direction={'column'}
                        w={'50%'}
                    >
                        <Text>Last Name</Text>
                        <Input type='text' name='lastName'
                            onChange={handleForm}
                            value={checkoutDetails.shippingAddress.lastName}
                        />
                    </Stack>
                </Stack>
                <Stack
                    direction={'column'}
                >
                    <Text>Address</Text>
                    <Input type='text' name='address'
                        onChange={handleForm}
                        value={checkoutDetails.shippingAddress.address}
                    />
                </Stack>
                <Stack
                    direction='row'
                >
                    <Stack
                        direction={'column'}
                        w={'50%'}
                    >
                        <Text>City</Text>
                        <Input type='text' name='city'
                            onChange={handleForm}
                            value={checkoutDetails.shippingAddress.city}
                        />
                    </Stack>
                    <Stack
                        direction={'column'}
                        w={'50%'}
                    >
                        <Text>Postal Code</Text>
                        <Input type='text' name='postalCode'
                            onChange={handleForm}
                            value={checkoutDetails.shippingAddress.postalCode}
                        />
                    </Stack>
                </Stack>
            </Stack>

            <Stack
                mt={3}
                align='end'
            >
                <Button
                    w='fit-content'
                    colorScheme='brand_primary'
                    variant='ghost'
                    onClick={moveToNext}
                >
                    Next
                </Button>
            </Stack>

        </Card>
    )
}

const cartItem = ({ product, quantity, key, checkoutDetails, setCheckoutDetails }) => {
    return (
        <Stack
            key={key}
            direction='row'
            align='center'
            bg='#ebf3f5'
            px='5px'
            py={'5px'}
        >
            <LazyImage
                src={product.images[0]}
                w='90px'
            />

            <Stack
                direction='column'
                spacing={0}
                w='full'
                justifyContent='space-between'
            >
                <Text fontWeight='bold'>{product.name}</Text>
                <Text color='gray.400'>{`x ${quantity}`}</Text>
            </Stack>

            <PriceComponent price={(product.price * quantity).toFixed(2)} componentSize='md' />


        </Stack>
    )
}

const formTwo = ({ setCurrentForm, cartProducts, cartTotal, handleSubmitOrder, isOrderProcessing, setCheckoutDetails, checkoutDetails }) => {

    const handleForm = (e) => {
        setCheckoutDetails(prev => ({
            ...prev,
            card: {
                ...prev.card,
                [e.target.name]: e.target.value
            }
        }))
    }

    return (
        <Card
            p={5}
            m={{ base: '10px', xl: '5px' }}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={10}
            >
                <Stack
                    maxW='500px'
                >
                    <Heading
                        mb={5}
                    >Shopping Cart</Heading>

                    {!cartProducts.isLoading ? cartProducts.products.length > 0 ? <Stack
                        maxH={{ base: 'auto', lg: '435px' }}
                        overflow={'auto'}
                    >
                        {cartProducts.products.map((item, index) => {
                            return cartItem({
                                product: item.product,
                                quantity: item.quantity,
                                key: index
                            })
                        })}
                    </Stack> : <Text>Cart is Empty</Text> : <Center>
                        <CircularProgress isIndeterminate color='brand_primary.500' />
                    </Center>}

                </Stack>

                <Stack
                    px='10px'
                >
                    <Heading
                        mb={5}
                    >Checkout</Heading>

                    <Stack
                        bg='gray.100'
                        borderRadius={10}
                    >
                        <Image w={'250px'} src={credit}
                            position={'relative'}
                            left='-20px'
                            top='-20px'
                            display={{ base: 'none', lg: 'block' }}
                        />

                        <Stack
                            p={5}
                            direction='column'
                            spacing={3}
                        >
                            <Stack
                                direction={'column'}
                            >
                                <Text>Name</Text>
                                <Input name='name' onChange={handleForm} value={checkoutDetails.card.name} type='text' bg='white' />
                            </Stack>

                            <Stack
                                direction={'column'}
                            >
                                <Text>Card Number</Text>
                                <Input name='number' onChange={handleForm} value={checkoutDetails.card.number} type='number' bg='white' />
                            </Stack>

                            <Stack
                                direction='row'
                            >

                                <Stack
                                    direction={'column'}
                                    w={'50%'}
                                >
                                    <Text>Expiry Date</Text>
                                    <HStack>
                                        <PinInput variant='outline' placeholder=''>
                                            <PinInputField bg='white' />
                                            <PinInputField bg='white' />
                                            <Text fontWeight='bold'>/</Text>
                                            <PinInputField bg='white' />
                                            <PinInputField bg='white' />
                                        </PinInput>
                                    </HStack>
                                </Stack>
                                <Stack
                                    direction={'column'}
                                    w={'50%'}
                                >
                                    <Text>CVV</Text>
                                    <Input name='cvv' onChange={handleForm} value={checkoutDetails.card.cvv} type='number' bg='white' />
                                </Stack>
                            </Stack>
                        </Stack>

                    </Stack>

                </Stack>

            </Stack>

            <Stack
                mt={3}
                direction='row'
                justifyContent='space-between'
            >
                <Button
                    w='fit-content'
                    colorScheme='brand_primary'
                    variant='ghost'
                    onClick={() => { setCurrentForm(1) }}
                >
                    Previous
                </Button>

                <Button
                    w='fit-content'
                    color='brand_primary.300'
                    borderColor='brand_primary.300'
                    variant='outline'
                    onClick={handleSubmitOrder}
                    isDisabled={isOrderProcessing}
                >
                    {cartProducts.isLoading ? <CircularProgress isIndeterminate color='brand_primary.500' size='15px' />
                        : <HStack>
                            <Text fontSize='md'>Buy</Text>
                            <PriceComponent price={cartTotal.toFixed(2)} componentSize='md' />
                            {isOrderProcessing && <CircularProgress isIndeterminate color='brand_primary.500' size='15px' />}
                        </HStack>
                    }
                </Button>
            </Stack>
        </Card>
    )
}

const successfulForm = ({ placedOrders, copyToClipboard }) => {

    // { setCurrentForm, orders, ordersCount }

    return (
        <Card
            p={5}
            m={{ base: '10px', xl: '5px' }}
        >
            <Stack
                direction={'column'}
                spacing={1}
            >
                <Heading mb={5} color='brand_primary.500' alignSelf='center'>
                    Successful!
                </Heading>
                <Text pb={7}>
                    If your cart contains products from different vendors, we will place corresponding orders for you. 😊 <br /> You can Track your Order from the Following Tracking ID(s)
                </Text>
                {placedOrders.orders.map((order, index) => {

                    return <Stack
                        key={index}
                        direction='row'
                        align='center'
                        p={1}
                        spacing={0}
                    >
                        <Badge p={3} minW='110px' fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }} variant='solid' fontWeight='bold' colorScheme='brand_primary'>{`Order ${index + 1}`}</Badge>

                        <Badge p={3} w='full' fontSize={{ base: 'calc(0.7em + 0.1vw)', lg: '1rem' }} px={4} >
                            <Stack direction='row' align='center' justifyContent='space-between'>
                                <Text>{order._id}</Text>
                                <BsClipboardFill cursor='pointer' onClick={() => copyToClipboard(order._id)} />
                            </Stack>
                        </Badge>


                    </Stack>
                })}
            </Stack>
            {/* <Button
                mt={2}
                variant='outline'
                colorScheme='brand_primary'
                w='fit-content'
                alignSelf='end'
            >
                Track Order
            </Button> */}
        </Card>
    )
}

export default Checkout