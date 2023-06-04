import React, { useEffect, useState } from 'react'

import { AiOutlinePlus, AiOutlineMinus, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

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
    Progress,
    Skeleton,

} from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext'
import { CreateProductReviewModal, PriceComponent } from '../../components/site'
import { useNavigate } from 'react-router-dom'


function ProductDetail() {


    const [shopProduct, setShopProduct] = useState({
        isLoading: true,
        data: null
    })

    const [productReview, setProductReviews] = useState({
        isLoading: true,
        reviews: null,
        reviewCount: null,
    });

    const [productVendor, setProductVendor] = useState({
        isLoading: true,
        vendor: null,
        rating: 0
    })

    const { getSingleProduct, cart, user, submitReview, getProductReviews, isInWishlist, addToWishList, removeFromWishList, getVendorDetails, displayAlert } = useAppContext()

    const [productInCart, setProductInCart] = useState(false)
    const [inWishList, setInWishlist] = useState(false);

    const fetchProduct = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await getSingleProduct(
                    window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
                );
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })

    }

    const fetchReviews = async () => {
        const { productReviews, reviewCount } = await getProductReviews(window.location.pathname.split('/')[window.location.pathname.split('/').length - 1])

        setProductReviews({
            isLoading: false,
            reviews: productReviews,
            reviewCount: reviewCount
        })

        console.log({ productReviews, reviewCount })
    }

    const handleWishList = async () => {
        setInWishlist(!inWishList)

        if (inWishList) {
            const data = await removeFromWishList(shopProduct.data.productID)
        } else {
            const data = await addToWishList(shopProduct.data.productID)
        }
    }

    const fectchVendorDetails = async (id) => {
        new Promise(async (resolve, reject) => {
            try {
                const { vendor } = await getVendorDetails(`productId=${id}`);
                resolve({ vendor })
            } catch (error) {
                reject(error)
            }
        }).then(({ vendor }) => {
            console.log({ vendor });
            setProductVendor({
                isLoading: false,
                vendor
            })
        }).catch((error) => {
            displayAlert({
                type: "error",
                payload: error
            })
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct().then((data) => {
            setShopProduct({
                isLoading: false,
                data: data
            })
            setCurrentActiveImage(data.images[0])
            setProductDescription({
                isComplete: false,
                des: data.description.slice(0, 400) + `${data.description.length > 400 ? "..... " : ''}`
            })
            fetchReviews()
            for (const item of cart) {
                if (item.productId === data._id) {
                    console.log('product in cart')
                    setProductInCart(true);
                    break;
                }
            }
            fectchVendorDetails(data._id)
        }).catch((error) => {
            displayAlert({
                type: "error",
                payload: error
            })
        })
    }, [])

    const [currentActiveImage, setCurrentActiveImage] = useState(null)

    const [productDescription, setProductDescription] = useState('')

    const [quantity, setQuantity] = useState(1)

    const handleReadMore = () => {
        setProductDescription({
            isComplete: true,
            des: shopProduct.data.description
        })
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleReviewSubmittion = async ({ rating, review }) => {
        const p = await submitReview({
            rating,
            review,
            productID: shopProduct.data._id,
            customerID: user._id
        })

        productReview.isLoading = true;
        fetchReviews()
    }

    const navigate = useNavigate()

    return (

        <div>
            {shopProduct.isLoading ? <Center
                h={'100vh'}
            >
                <CircularProgress
                    isIndeterminate
                    color='brand_primary.500'
                />
            </Center>
                :
                <Center
                    flexDirection={'column'}
                    py={10}
                >
                    <CreateProductReviewModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} fetchReviewsCallback={handleReviewSubmittion} />

                    <Stack
                        direction={{ base: 'column', xl: 'row' }}
                        maxW={'1000px'}
                        align='center'
                        px={{ base: '12px', xl: "0" }}
                        spacing={10}
                        pb={10}
                    >
                        <Box>
                            {currentActiveImage && <Image
                                src={currentActiveImage}
                                maxW={{ base: '100%', xl: '650px' }}
                            />
                            }

                            <Stack
                                mt={5}
                                direction={'row'}
                                align={'center'}
                                justifyContent={'center'}
                            >
                                {shopProduct.data && shopProduct.data.images.map((src, index) => {
                                    return <Box
                                        key={index}
                                        borderRadius={'5px'}
                                        bg={'white'}
                                        border={'2px solid white'}
                                        borderColor={
                                            src == currentActiveImage ? 'var(--chakra-colors-brand_primary-500)' : 'white'
                                        }

                                        cursor={'pointer'}
                                    >
                                        <Image
                                            src={src}
                                            w={'90px'}
                                            // shadow={'md'}
                                            p={2}

                                            onClick={() => setCurrentActiveImage(src)}
                                        />
                                    </Box>
                                })}
                            </Stack>
                        </Box>
                        <Box>
                            <Text
                                textTransform={'uppercase'}
                                fontWeight='bold'
                                opacity='0.6'
                                color={'brand_secondary.500'}
                            >{shopProduct.data.categories[0]}</Text>
                            <Stack
                                direction='row'
                            >
                                {shopProduct.data.name.split(' ').splice(0, 3).map((text, index) => {
                                    return <Heading
                                        key={index}
                                        fontWeight={index == 1 ? 'bold' : 'normal'}
                                    >
                                        {text}
                                    </Heading>
                                })}
                            </Stack>

                            <PriceComponent price={shopProduct.data.price.toFixed(2)} />

                            <Stack
                                direction={'row'}
                            >
                            </Stack>

                            <Text
                                mt={'5px'}
                                textAlign={'justify'}
                            // display={'inline-block'}
                            // px={20}
                            >
                                {productDescription.des}
                                {
                                    shopProduct.data.description.length > 400 &&
                                    !productDescription.isComplete &&
                                    <Text
                                        display={'inline-block'}
                                        color={'brand_primary.500'}
                                        cursor={'pointer'}
                                        fontWeight={'bold'}
                                        onClick={handleReadMore}
                                    >
                                        Read More
                                    </Text>
                                }

                            </Text>


                            <Text
                                mt={'40px'}
                                align={'start'}
                                px={2}
                                // fontWeight={'bold'}
                                textTransform={'uppercase'}
                                // opacity='0.6'
                                fontSize={'sm'}
                                color={'brand_primary.500'}
                            // color={'brand_secondary.200'}
                            >
                                {`[ ${shopProduct.data.stock} in Stock ]`}
                            </Text>
                            <Wrap
                                mt={'5px'}
                                direction={'row'}
                                align={'center'}
                                justify={{ base: 'center', sm: 'space-between' }}
                            >
                                <Stack
                                    direction={'row'}
                                    align={'center'}
                                    bg={'white'}
                                    borderRadius={'10px'}
                                    color={'brand_primary.500'}
                                    border={'1px solid var(--chakra-colors-brand_primary-500)'}
                                >
                                    <Box
                                        p={2}
                                        px={4}
                                        borderRight={'1px solid var(--chakra-colors-brand_primary-500)'}
                                        cursor={'pointer'}
                                    >
                                        <AiOutlineMinus />
                                    </Box>
                                    <Box
                                        p={2}
                                        px={10}
                                        fontSize={'lg'}
                                    >
                                        {quantity}
                                    </Box>
                                    <Box
                                        p={2}
                                        px={4}
                                        borderLeft={'1px solid var(--chakra-colors-brand_primary-500)'}
                                        cursor={'pointer'}
                                    >
                                        <AiOutlinePlus />
                                    </Box>
                                </Stack>

                                <ButtonGroup isAttached variant={'outline'}>
                                    <Button
                                        colorScheme='brand_primary'
                                        borderRadius={'10px'}
                                        isDisabled={productInCart || shopProduct.data.stock === 0}
                                    >
                                        {productInCart ? 'ADDED' : shopProduct.data.stock === 0 ? 'SOLD-OUT' : 'ADD TO CART'}
                                    </Button>
                                    <Button
                                        colorScheme='brand_primary'
                                        borderRadius={'10px'}
                                    >
                                        <AiOutlineHeart />
                                    </Button>
                                </ButtonGroup>
                            </Wrap>
                            <Skeleton
                                isLoaded={!productVendor.isLoading}
                            >
                                <Wrap
                                    w='full'
                                    mt={5}
                                    align='center'
                                    justify={{ base: 'center', sm: 'space-between' }}
                                >
                                    <Wrap
                                        align='center'
                                    >
                                        <Avatar
                                            name={productVendor.vendor ? productVendor.vendor.vendorInfo.name : undefined}
                                            src={productVendor.vendor ? productVendor.vendor.vendorInfo.image : undefined}
                                        />
                                        <Box>
                                            <Text
                                                fontWeight='bold'
                                                color='gray.500'
                                            >
                                                Vendor's Rating
                                            </Text>
                                            <Progress
                                                colorScheme='brand_primary'
                                                value={productVendor.vendor && productVendor.vendor.rating}
                                            />
                                        </Box>
                                    </Wrap>

                                    <Button
                                        justifySelf='end'
                                        onClick={() => navigate(`/shop/vendor/${productVendor.vendor.vendorInfo._id}`)}
                                    >Visit {productVendor.vendor && productVendor.vendor.vendorInfo.shop.name}
                                    </Button>
                                </Wrap>
                            </Skeleton>
                        </Box>
                    </Stack >

                    <Stack
                        maxW={'1000px'}
                        minW={'50vw'}
                        px={{ base: '12px', xl: "0" }}

                    >
                        <Heading>Reviews</Heading>
                        {!productReview.isLoading && <Stack
                            direction={'row'}
                            align={'center'}
                            justifyContent={'space-between'}
                        >
                            <Text>{`${productReview.reviewCount} Reviews Found`}</Text>
                            <Button
                                isDisabled={user ? false : true}
                                onClick={onOpen}
                            >
                                {user ? 'Add Review' : 'Login to add Review'}
                            </Button>
                        </Stack>}

                        {productReview.isLoading ?
                            <Center py={10}>
                                <CircularProgress
                                    isIndeterminate
                                    color={'brand_secondary.500'}

                                />
                            </Center>
                            : productReview.reviewCount === 0 ? <Text>Be the first one to review!</Text> : productReview.reviews &&
                                productReview.reviews.map((review, index) => {
                                    return <Card
                                        p={5}
                                        borderRadius={'10px'}
                                    // align='center'
                                    >
                                        <Stack
                                            direction={'row'}
                                            spacing={5}
                                        >
                                            <Avatar name={review.customerName} />
                                            <Box
                                                w={'full'}
                                            >
                                                <Text
                                                    // fontStyle={'italic'}
                                                    fontWeight={'bold'}
                                                    // opacity={'0.6'}
                                                    color={'brand_primary.200'}
                                                >
                                                    {review.customerName}
                                                </Text>
                                                <Text>
                                                    {review.review}
                                                </Text>

                                                <Stack
                                                    direction={'row'}
                                                    justifyContent={'end'}
                                                    align={'center'}
                                                >
                                                    {['😡', '😕', '😐', '😃', '🤩'].map((emoji, index) => {
                                                        return <Text
                                                            key={index}
                                                            opacity={index + 1 === review.rating ? '1' : '0.2'}
                                                            fontSize={index + 1 === review.rating ? 'lg' : 'md'}
                                                        >
                                                            {emoji}
                                                        </Text>
                                                    })}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Card>
                                })
                        }

                        {/* <Card
                            p={10}
                            borderRadius={'10px'}
                        // align='center'
                        >
                            <Stack
                                direction={'row'}
                                spacing={5}
                            >
                                <Avatar name='Ali Haider' />
                                <Box>
                                    <Text
                                        // fontStyle={'italic'}
                                        fontWeight={'bold'}
                                        // opacity={'0.6'}
                                        color={'brand_primary.200'}
                                    >
                                        - Ali Haider
                                    </Text>
                                    <Text>
                                        Simple, Unique, Stylish. Loved it. The Quality is awsome and was delievered within just 2 days.
                                        The customer service is also good. Recomended
                                    </Text>
                                </Box>
                            </Stack>
                        </Card> */}
                    </Stack>
                </Center >
            }
        </div>
    )
}

export default ProductDetail