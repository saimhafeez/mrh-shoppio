import React, { useEffect, useState } from 'react'

import { MdOutlineFavoriteBorder, MdOutlineFavorite, MdFavorite } from 'react-icons/md'

import { BsFillCartFill, BsFillCartCheckFill, BsEyeFill } from 'react-icons/bs'

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
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../LazyImage';
import { useAppContext } from '../../context/appContext';
import PriceComponent from './PriceComponent';

function ProductCard({ name, imageList, categories, price, description, productID, stock }) {

    const navigate = useNavigate();

    const [currentActiveImage, setCurrentActiveImage] = useState(imageList[0]);

    const [inWishList, setInWishlist] = useState(false);
    const [isRatingLoading, setIsRatingLoading] = useState(true);

    const { user, addToWishList, removeFromWishList, isInWishlist, getProductReviews, addCartToLocalStorage, cart } = useAppContext()

    const [rating, setRating] = useState(0)

    const goToProductDetails = () => {
        console.log(productID)
        navigate(`/shop/${productID}`)

    }

    const handleWishList = async () => {
        setInWishlist(!inWishList)

        if (inWishList) {
            const data = await removeFromWishList(productID)
        } else {
            const data = await addToWishList(productID)
        }
    }

    const init = async () => {

        if (user) {
            const { result } = await isInWishlist(productID)
            setInWishlist(result ? true : false)
        }

        const { productReviews, reviewCount } = await getProductReviews(productID)

        var totalRating = 0;
        for (const product of productReviews) {
            totalRating += product.rating;
        }

        setRating(totalRating / reviewCount)
        setIsRatingLoading(false)

    }

    useEffect(() => {
        init();
    }, [])

    const ratingComponent = () => {

        const items = [];
        // <BsStarFill />
        //             <BsStarHalf />
        //             <BsStar />

        for (var i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                if (Math.floor(rating) === i && rating >= (Math.floor(rating) + 0.4) && rating <= (Math.floor(rating) + 0.6)) {
                    items.push(<BsStarHalf key={i} />)
                } else {
                    items.push(<BsStarFill key={i} />)
                }
            } else {
                items.push(<BsStar key={i} />)
            }
        }

        return items
    }

    const addToCart = () => {
        addCartToLocalStorage({
            productId: productID,
            quantity: 1
        }, cart);
    }

    return (
        <Card
            w={'250px'}
            borderRadius={15}
            shadow={'md'}
            transition={'0.2s'}
            minH={'300px'}
            bg={'#ebf3f5'}
            pb={2}
        >
            <Stack
                bg={'brand_primary.500'}
                borderRadius={15}
                direction={'column'}
                position={'relative'}
                h={'150px'}
                w={'full'}
            >
                <Stack
                    direction={'row'}
                    justifyContent={'end'}
                    pr={3} pt={3}
                    color='white'
                    onClick={user && handleWishList}
                    cursor={user && 'pointer'}
                >
                    {inWishList ? <MdOutlineFavorite /> : <MdOutlineFavoriteBorder />}
                </Stack>
                <LazyImage
                    src={currentActiveImage}
                    w={'200px'}
                    h={'200px'}
                    objectFit={'contain'}
                    position={'absolute'}
                    top={'15%'}
                    left={'8%'}
                    zIndex={100}
                />
            </Stack>

            <Stack
                direction={'row'}
                mt={'35%'}
                justifyContent={'center'}
                align={'center'}

            >
                {imageList.slice(0, 3).map((src, index) => {
                    return <Image
                        key={index}
                        w={'50px'}
                        h={'50px'}
                        bg={'white'}
                        p={'5px'}
                        objectFit={'cover'}
                        borderRadius={'10px'}
                        boxShadow={'base'}
                        src={src}
                        border={'1.5px solid white'}
                        borderColor={src == currentActiveImage ? 'var(--chakra-colors-brand_primary-200)' : 'white'}
                        cursor={'pointer'}

                        onClick={(e) => {
                            setCurrentActiveImage(e.target.src)
                        }}

                        _hover={
                            { border: '1.5px solid var(--chakra-colors-brand_primary-200)' }
                        }
                    />
                })}
            </Stack>

            <Stack
                direction={'column'}
                mx={5}
                my={2}
            >
                <Tooltip
                    label={name}
                >
                    <Text
                        className='fileNameBadge'
                        fontSize={'md'}
                    >
                        {name}
                    </Text>
                </Tooltip>

                <Tooltip
                    label={categories.join(', ')}
                >
                    <Text
                        className='fileNameBadge'
                        fontSize={'sm'}
                        opacity={'0.5'}
                        fontWeight={'bold'}
                    >
                        {categories[0]}
                    </Text>
                </Tooltip>


                <Stack
                    color='brand_primary.500'
                    opacity={'0.6'}
                    // width={'fit-content'}
                    borderRadius={'5px'}
                    py={2}
                    direction={'row'}
                    spacing={0.5}
                >
                    <Skeleton display={'flex'} h='20px' w='full' isLoaded={!isRatingLoading}>
                        {ratingComponent()}
                    </Skeleton>
                </Stack>

                <Wrap
                    h={'100px'}
                    spacing={0}
                >
                    <Text
                        className='textEllipsisThreeLines'
                        fontSize={'sm'}
                    >
                        {description}
                    </Text>
                    <Text
                        color={'brand_primary.300'}
                        fontWeight={'bold'}
                        cursor={'pointer'}
                        onClick={() => goToProductDetails(productID)}
                    >Read More</Text>

                </Wrap>

                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                >

                    <PriceComponent price={price} componentSize='lg' componentColor='gray.600' />

                    <Button
                        colorScheme='brand_primary'
                        borderRadius={15}
                        fontSize={'sm'}
                        isDisabled={stock === 0}
                        onClick={addToCart}
                    >
                        ADD TO CART
                    </Button>

                </Stack>

            </Stack>

        </Card>
    )
}

export default ProductCard