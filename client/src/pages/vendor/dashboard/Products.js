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
    Th
} from '@chakra-ui/react'
import { useAppContext } from '../../../context/appContext'
import { ProductsTable, CreateProductHero } from '../../../components/vendor'
import { LazyImage } from '../../../components'
import { AiOutlineNumber } from 'react-icons/ai'


function Products() {


    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState();
    const [numOfPages, setNumOfPages] = useState();
    const [currentPage, setcurrentPage] = useState(1);
    const [sliderPage, setSliderPage] = useState(currentPage);

    const { getProducts, isLoading, displayAlert } = useAppContext();

    const fetchProducts = async () => {

        const { products: fetchedProducts, totalProducts, numOfPages } = await getProducts({ page: currentPage });
        setProducts([...fetchedProducts]);
        setTotalProducts(totalProducts);
        setNumOfPages(numOfPages)
    }


    useEffect(() => {

        fetchProducts()
        setSliderPage(currentPage)

    }, [currentPage])


    return (

        <Box>
            <CreateProductHero fetchProductsCallback={fetchProducts} />

            <Card
                m={5}
                borderRadius={'none'}
                p={5}
            >
                {isLoading &&
                    <Center>
                        <Spinner />
                    </Center>
                }

                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Sr#</Th>
                                <Th>Image</Th>
                                <Th>Name</Th>
                                <Th>Price</Th>
                                <Th>Categories</Th>
                                <Th>Tags</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!isLoading && products.length > 0 && products.map((product, index) => {
                                const limit = 2
                                const productsCovered = ((currentPage - 1) * limit)

                                return (
                                    <Tr key={index}>
                                        <Td>
                                            <Badge>{productsCovered + (index + 1)}</Badge>
                                        </Td>
                                        <Td>
                                            <LazyImage
                                                key={index}
                                                src={product.images.split(',')[0]}
                                                minW={'100px'}
                                                maxW={'100px'}
                                                h={'60px'}
                                                objectFit={'cover'}
                                            />

                                        </Td>
                                        <Td>
                                            <Text>{product.name}</Text>
                                        </Td>
                                        <Td isNumeric>
                                            <Badge colorScheme='purple'>{product.price.toFixed(2)}</Badge>

                                        </Td>
                                        <Td>
                                            {
                                                <Wrap>
                                                    {product.categories.split(',').map((category, catindex) => {
                                                        return <Kbd
                                                            width={'fit-content'}
                                                            key={catindex}
                                                        >{category}</Kbd>
                                                    })}
                                                </Wrap>
                                            }
                                        </Td>
                                        <Td>
                                            {
                                                <Wrap>
                                                    {product.tags.split(',').map((tag, tagIndex) => {
                                                        return <Kbd
                                                            width={'fit-content'}
                                                            key={tagIndex}
                                                        >{tag}</Kbd>
                                                    })}
                                                </Wrap>
                                            }
                                        </Td>
                                        <Td>
                                            <Stack direction='row' spacing={5}>
                                                <Button>Edit</Button>
                                                <Button>Remove</Button>
                                            </Stack>
                                        </Td>
                                    </Tr>
                                )
                            })}

                        </Tbody>
                    </Table>
                </TableContainer>
                {!isLoading && products.length == 0 &&
                    <Center>
                        <Text>No Products Found, Create Some!</Text>
                    </Center>
                }

                {/* Pagination */}
                <Stack direction={'row'} align={'center'} justifyContent={'space-between'} mt={2}>

                    <Badge >Page {currentPage} / {isLoading ? <Spinner w={'10px'} h={'10px'} /> : numOfPages}</Badge>

                    {numOfPages > 1 && <Stack direction={'row'} align={'center'} spacing={6}>
                        <Button
                            minW={'100px'}
                            isDisabled={
                                currentPage == 1 ? true : false
                            }
                            variant={'outline'}
                            onClick={() => setcurrentPage(pre => pre - 1)}
                        >Previous</Button>
                        <Slider
                            defaultValue={1}
                            min={1}
                            max={numOfPages}
                            step={1}
                            value={sliderPage}
                            onChange={(e) => setSliderPage(e)}
                            onChangeEnd={(e) => setcurrentPage(e)}
                            maxW={150}
                            minW={100}
                        >
                            <SliderTrack bg='red.100'>
                                {/* <Box position='relative' right={10} /> */}
                                <SliderFilledTrack bg='tomato' />
                            </SliderTrack>
                            <SliderThumb>{sliderPage}</SliderThumb>
                        </Slider>
                        <Button
                            minW={'100px'}
                            isDisabled={
                                currentPage == numOfPages ? true : false
                            }
                            variant={'outline'}
                            onClick={() => setcurrentPage(pre => pre + 1)}
                        >Next</Button>
                        {/* <Slider
                            defaultValue={1}
                            value={currentPage}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb>{currentPage}</SliderThumb>
                        </Slider> */}
                    </Stack>}
                </Stack>
            </Card>
        </Box>
    )
}

export default Products