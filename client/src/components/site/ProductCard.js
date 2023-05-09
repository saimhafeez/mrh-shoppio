import React, { useState } from 'react'

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
    Center
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function ProductCard({ name, imageList, categories, price, description, productID }) {

    const navigate = useNavigate();

    const [currentActiveImage, setCurrentActiveImage] = useState(imageList[0]);

    const goToProductDetails = () => {
        console.log(productID)
        navigate(`/shop/${productID}`)

    }

    return (
        // <Card
        //     // maxW="sm"
        //     w={'350px'}
        //     p={4}
        // // borderTop={'3px solid var(--chakra-colors-brand_primary-500)'}
        // // cursor={'pointer'}
        // // onClick={(e) => console.log('clicked', e.target)}
        // >
        //     <Stack
        //         direction={'column'}
        //     >

        //         <Box position={'relative'}>
        //             <Image src={src} h={'250px'} bgSize={'cover'} />
        //             <Box position={'absolute'} top={0} right={0}><MdOutlineFavoriteBorder size={'20px'} color='red' /></Box>
        //         </Box>

        //         <Stack direction={'row'} justifyContent={'center'}>
        //             <Badge variant={'outline'} colorScheme='brand_secondary'>{category}</Badge>
        //         </Stack>

        //         <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>
        //             <Tooltip label={name}>
        //                 <Text className='fileNameBadge' fontSize={'sm'} fontWeight={'bold'}>{name}</Text>
        //             </Tooltip>

        //         </Stack>

        //         <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>

        //             <Tooltip
        //                 m={2}
        //                 label={
        //                     <Stack direction={'column'}>
        //                         <Text className='fileNameBadge'>Awesome Productf df er tert rt re tretretnerut hp ery teru ty9ertyre8 tyeurity ert7 5yi43r yr9834no rt0</Text>
        //                         <Text className='fileNameBadge'>Delievered on Time</Text>
        //                     </Stack>
        //                 }
        //             >
        //                 <Badge variant={'outline'} colorScheme='brand_secondary'>37 Reviews</Badge>
        //             </Tooltip>

        //             <Badge variant={'subtle'} borderRadius={5} px={5} className='fileNameBadge' colorScheme='green' fontSize={'sm'} fontWeight={'bold'}>$ {price}</Badge>
        //         </Stack>

        //         <ButtonGroup variant='outline' isAttached>
        //             <Button w={'full'}>Add to Cart</Button>
        //             <Button w={'full'}>View More</Button>
        //         </ButtonGroup>

        //         {/* <Text>{description.replace(/\\n/g, '\n')}</Text> */}
        //     </Stack>

        // </Card>
        // <Card
        //     w={'250px'}
        //     // bg={'#ff3639'}
        //     // bg={'brand_primary.900'}
        //     // bg = { '#785dff'}
        //     pt={1}
        //     bg={'brand_primary.500'}
        //     borderRadius={15}
        //     shadow={'md'}
        //     transition={'0.2s'}
        //     // transform={hoverState ? 'rotateY(180deg)' : ''}
        //     // pt={hoverState ? '0' : '10'}
        //     onMouseEnter={() => setHoverState(true)}
        //     onMouseLeave={() => setHoverState(false)}
        // // _hover={{
        // //     pt: 10,
        // //     bg: '#785dff'
        // // }}
        // >

        //     {/* <Stack
        //         px={3}
        //         py={2}
        //         // display={'none'}
        //         direction={'row'}
        //         justifyContent={'space-around'}
        //         align={'center'}
        //     >
        //         <MdOutlineFavoriteBorder
        //             color='white'
        //         />
        //         <Badge>
        //             {category}
        //         </Badge>
        //     </Stack> */}

        //     <Stack

        //         p={4}
        //         mt={3}
        //         direction={'column'}
        //         align={'center'}
        //         // borderTopLeftRadius={45}
        //         // borderTopRightRadius={45}
        //         bg={'white'}
        //         shadow={'md'}
        //     >


        //         <Center
        //             h={'200px'}
        //             w={'full'}
        //             borderRadius={10}
        //             p={2}
        //             border={'2px solid #f7fafc'}
        //             // bg={'green.100'}
        //             // bg={'#ddccf0'}
        //             bg={'#f7fafc'}
        //         // bg={'#e6e6e6'}
        //         // position={'relative'}

        //         >
        //             <Image
        //                 src={src}
        //                 // position={'absolute'}
        //                 boxSize={'full'}
        //                 objectFit={'cover'}
        //             // h={'200px'}
        //             // w={'full'}
        //             // display={'block'}
        //             // marginRight={'auto'}
        //             // marginLeft={'auto'}
        //             />

        //         </Center>

        //         <Heading
        //             fontSize={'lg'}
        //             className='fileNameBadge'
        //             px={2}
        //             // color={'#ff3639'}
        //             color={'brand_primary.700'}
        //         >
        //             {name.toUpperCase()}
        //         </Heading>

        //         <Box
        //             h={'50px'}
        //         >
        //             <Text
        //                 className='textEllipsisTwoLines'
        //                 opacity={'0.6'}
        //             >
        //                 {description.replace(/\\n/g, '\n')}
        //             </Text>
        //         </Box>





        //         <Stack direction={'row'} w={'full'} justifyContent={'space-between'}>
        //             <Text
        //                 fontWeight={'bold'}
        //             >
        //                 $ {price.toFixed(2)}
        //             </Text>

        //             <Text>
        //                 Rating
        //             </Text>
        //         </Stack>

        //         <Tooltip
        //             label={tags.join(', ').toLowerCase()}
        //         >
        //             <Text
        //                 // border={'1px'}
        //                 color={'#ff3639'}
        //                 // opacity={'0.5'}
        //                 bg={'brand_background.light'}
        //                 fontStyle={'italic'}
        //                 fontWeight={'semibold'}
        //                 px={2}
        //                 className='fileNameBadge'
        //             >
        //                 {tags.join(', ').toLowerCase()}
        //             </Text>
        //         </Tooltip>

        //     </Stack>


        //     <ButtonGroup isAttached>
        //         <Tooltip
        //             label={'Add to cart'}
        //         >
        //             <Button
        //                 borderTopRadius={0}
        //                 color={'black'}
        //                 bg={'brand_secondary.100'}
        //                 // bg={'#ffb208'}
        //                 // bg={'#785dff'}
        //                 w={'full'}
        //                 _hover={{
        //                     bg: 'black',
        //                     color: 'white'
        //                 }}
        //             >
        //                 <BsFillCartFill />
        //             </Button>
        //         </Tooltip>

        //         <Tooltip
        //             label={'View Product Page'}
        //         >
        //             <Button
        //                 borderTopRadius={0}
        //                 // bg={'#ffb208'}
        //                 bg={'#785dff'}
        //                 w={'full'}
        //                 _hover={{
        //                     bg: 'black',
        //                 }}
        //             >
        //                 <BsEyeFill color='white' />
        //             </Button>
        //         </Tooltip>

        //     </ButtonGroup>

        // </Card >

        <Card
            w={'250px'}
            // p={1}
            // bg={'brand_primary.500'}
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
                // p={2}
                position={'relative'}
                h={'150px'}
                w={'full'}
            >
                <Stack direction={'row'} justifyContent={'end'} pr={3} pt={3} color={'white'}>
                    <MdOutlineFavorite />
                </Stack>
                <Image
                    src={currentActiveImage}
                    w={'200px'}
                    h={'200px'}
                    objectFit={'contain'}
                    position={'absolute'}
                    top={'15%'}
                    left={'8%'}
                    zIndex={100}

                // w={'full'}
                // display={'block'}
                // marginRight={'auto'}
                // marginLeft={'auto'}
                />
            </Stack>

            <Stack
                direction={'row'}
                // mt={'80px'}
                mt={'35%'}
                justifyContent={'center'}
                align={'center'}

            >
                {imageList.slice(0, 3).map((src, index) => {
                    return <Image
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
                    width={'fit-content'}
                    borderRadius={'5px'}
                    py={2}
                    direction={'row'}
                    spacing={0.5}
                // display={'flex'}
                >
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarHalf />
                    <BsStar />
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
                    // opacity={'0.8'}
                    >Read More</Text>

                </Wrap>

                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                >
                    <Stack
                        direction={'row'}
                        align={'center'}
                        spacing={1}
                    >
                        <Text
                            fontSize={'lg'}
                            fontFamily={'brandSymbol'}
                        >
                            $
                        </Text>
                        <Text
                            fontSize={'lg'}
                            fontWeight={'bold'}
                        >
                            {price}
                        </Text>
                    </Stack>

                    <Button
                        colorScheme='brand_primary'
                        borderRadius={15}
                        fontSize={'sm'}
                    >
                        ADD TO CART
                    </Button>

                </Stack>

            </Stack>

        </Card>
    )
}

export default ProductCard