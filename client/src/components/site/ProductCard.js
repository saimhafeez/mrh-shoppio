import React from 'react'

import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'

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
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';

function ProductCard({ name, src, category, price, description }) {


    return (
        <Card
            // maxW="sm"
            w={'350px'}
            p={4}
        // borderTop={'3px solid var(--chakra-colors-brand_primary-500)'}
        // cursor={'pointer'}
        // onClick={(e) => console.log('clicked', e.target)}
        >
            <Stack
                direction={'column'}
            >

                <Box position={'relative'}>
                    <Image src={src} h={'250px'} bgSize={'cover'} />
                    <Box position={'absolute'} top={0} right={0}><MdOutlineFavoriteBorder size={'20px'} color='red' /></Box>
                </Box>

                <Stack direction={'row'} justifyContent={'center'}>
                    <Badge variant={'outline'} colorScheme='brand_secondary'>{category}</Badge>
                </Stack>

                <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>
                    <Tooltip label={name}>
                        <Text className='fileNameBadge' fontSize={'sm'} fontWeight={'bold'}>{name}</Text>
                    </Tooltip>

                </Stack>

                <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>

                    <Tooltip
                        m={2}
                        label={
                            <Stack direction={'column'}>
                                <Text className='fileNameBadge'>Awesome Productf df er tert rt re tretretnerut hp ery teru ty9ertyre8 tyeurity ert7 5yi43r yr9834no rt0</Text>
                                <Text className='fileNameBadge'>Delievered on Time</Text>
                            </Stack>
                        }
                    >
                        <Badge variant={'outline'} colorScheme='brand_secondary'>37 Reviews</Badge>
                    </Tooltip>

                    <Badge variant={'subtle'} borderRadius={5} px={5} className='fileNameBadge' colorScheme='green' fontSize={'sm'} fontWeight={'bold'}>$ {price}</Badge>
                </Stack>

                <ButtonGroup variant='outline' isAttached>
                    <Button w={'full'}>Add to Cart</Button>
                    <Button w={'full'}>View More</Button>
                </ButtonGroup>

                {/* <Text>{description.replace(/\\n/g, '\n')}</Text> */}
            </Stack>

        </Card>
    )
}

export default ProductCard