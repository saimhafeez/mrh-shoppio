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
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useAppContext } from '../../../context/appContext'
import { CreateProductHero } from '../../../components/vendor'
import { InputCompnent, LazyImage } from '../../../components'
import { AiOutlineNumber } from 'react-icons/ai'


function Products() {


    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [numOfPages, setNumOfPages] = useState();
    const [currentPage, setcurrentPage] = useState(1);
    const [sliderPage, setSliderPage] = useState(currentPage);

    const { getProducts, isLoading, displayAlert, restockProduct, removeProduct } = useAppContext();

    const fetchProducts = async () => {

        const { products: fetchedProducts, totalProducts, numOfPages } = await getProducts({ page: currentPage });
        setProducts([...fetchedProducts]);
        setTotalProducts(totalProducts);
        setNumOfPages(numOfPages)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedProduct, setSelectedProduct] = useState({
        product: null,
        restockQuantity: 0
    })

    useEffect(() => {

        fetchProducts()
        setSliderPage(currentPage)

    }, [currentPage])


    const productRestock = () => {
        new Promise(async (resolve, reject) => {
            try {
                const { updatedProduct } = await restockProduct(selectedProduct.product._id, selectedProduct.restockQuantity)
                resolve(updatedProduct)
            } catch (error) {
                reject(error)
            }
        }).then((updatedProduct) => {
            displayAlert({
                alertStatus: 'success',
                alertText: `'${updatedProduct.name}' restocked with additional ${selectedProduct.restockQuantity} items`
            })
            setSelectedProduct({
                product: null,
                restockQuantity: 0
            })
            fetchProducts();
            onClose();

        }).catch((error) => {
            displayAlert({
                alertStatus: 'error',
                alertText: error
            })
        })
    }

    const productRemove = (id) => {
        new Promise(async (resolve, reject) => {
            try {
                const { removedProduct } = await removeProduct(id)
                resolve(removedProduct)
            } catch (error) {
                reject(error)
            }
        }).then((removedProduct) => {
            displayAlert({
                alertStatus: 'success',
                alertText: `'${removedProduct.name}' removed`
            })
            fetchProducts();
            onClose();

        }).catch((error) => {
            displayAlert({
                alertStatus: 'error',
                alertText: error
            })
        })
    }


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
                <Text fontWeight='bold' color='gray.400'>Total Products: {totalProducts}</Text>
                <TableContainer w={{ base: 'full', lg: "calc(100vw - 350px)" }}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Sr#</Th>
                                <Th>Image</Th>
                                <Th>Name</Th>
                                <Th>Price</Th>
                                <Th>Categories</Th>
                                <Th>Tags</Th>
                                <Th>Stock</Th>
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
                                                src={product.images[0]}
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
                                                    {product.categories.map((category, catindex) => {
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
                                                    {product.tags.map((tag, tagIndex) => {
                                                        return <Kbd
                                                            width={'fit-content'}
                                                            key={tagIndex}
                                                        >{tag}</Kbd>
                                                    })}
                                                </Wrap>
                                            }
                                        </Td>
                                        <Td>
                                            <Text>
                                                {product.stock}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Stack direction='row' spacing={5}>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedProduct(prev => ({
                                                            ...prev,
                                                            product: product
                                                        }))
                                                        onOpen();
                                                    }}
                                                >

                                                    Re-stock</Button>
                                                <Button
                                                    onClick={() => productRemove(product._id)}
                                                >
                                                    Remove
                                                </Button>
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
                            display={{ base: 'none', lg: 'block' }}
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
                            display={{ base: 'none', lg: 'block' }}
                            variant={'outline'}
                            onClick={() => setcurrentPage(pre => pre + 1)}
                        >Next</Button>
                    </Stack>}
                </Stack>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx={'2%'} w={'full'}>
                    <ModalHeader>
                        Restock '{selectedProduct.product && selectedProduct.product.name}'
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack direction='row' w='full'>
                            <InputCompnent
                                value={selectedProduct.restockQuantity}
                                name="Quantity"
                                w='full'
                                handleChange={(e) => {
                                    setSelectedProduct(prev => ({
                                        ...prev,
                                        restockQuantity: e.target.value
                                    }))
                                }} />
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='brand_primary' mr={3}
                            onClick={productRestock}
                        >
                            Done
                        </Button>
                        <Button variant='ghost' onClick={() => {
                            onClose()
                            setSelectedProduct({
                                product: null,
                                restockQuantity: 0
                            })
                        }} >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Products