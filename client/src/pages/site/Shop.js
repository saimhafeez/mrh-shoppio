import React, { useEffect, useState } from 'react'
import Header from './Header'
import { FilterBadge, ProductCard } from '../../components/site'
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

} from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext'
import { FiFilter } from 'react-icons/fi'
import { FiAlertCircle } from 'react-icons/fi'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'

import ProductDetail from './ProductDetail'
import { InputCompnent } from '../../components'

function Shop() {

    if (window.location.search === '') {
        window.location.search = '?filterType=any'
    }

    if (!window.location.search.includes('filterType=')) {
        window.location.search += '&filterType=any'
    }

    const { getTags, getCategories, getAllProducts } = useAppContext();


    const [productCategories, setProductCategories] = useState({
        isLoading: true,
        categoryList: []
    })

    const [productTags, setProductTags] = useState({
        isLoading: true,
        tagList: []
    })

    const [products, setProducts] = useState({
        isLoading: true,
        products: []
    })

    const loadCategories = async () => {
        const { categories } = await getCategories();
        setProductCategories({
            categoryList: categories,
            isLoading: false
        })

        console.log(productCategories)
    }

    const loadTags = async () => {
        const { tags } = await getTags();
        setProductTags({
            tagList: tags,
            isLoading: false
        })
    }

    const loadProducts = async () => {
        const {
            products,
            totalProducts,
            numOfPages
        } = await getAllProducts(window.location.search);

        console.log('products', {
            products,
            totalProducts,
            numOfPages
        })

        setProducts({
            products: products,
            isLoading: false
        })
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    // const btnRef = React.useRef()

    const query = window.location.search
    const searchParams = new URLSearchParams(query);
    // const categories = searchParams.get('categories') || null
    // const tags = searchParams.get('tags') || null

    useEffect(() => {
        loadCategories()
        loadTags()
        loadProducts()
    }, [])

    const [searchQueryObject, setSearchQueryObject] = useState({
        categories: searchParams.get('categories') || null,
        tags: searchParams.get('tags') || null,
        filterType: searchParams.get('filterType') || null,
        search: searchParams.get('search') || null
    })
    // searchQueryObject.categories = searchParams.get('categories') || null;
    // searchQueryObject.tags = searchParams.get('tags') || null;
    // searchQueryObject.filterType = searchParams.get('filterType') || null;
    // searchQueryObject.search = searchParams.get('search') || null;

    console.log(searchQueryObject)

    const SideDrawer = () => {

        return (

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Filter Products</DrawerHeader>

                    <DrawerBody>
                        {SidebarContent()}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    const updateURL = () => {

        var queryList = [];

        const nonEmptyKeys = Object.keys(searchQueryObject).filter(key => searchQueryObject[key]);

        nonEmptyKeys.map((key, index) => {
            queryList.push(`${key}=${searchQueryObject[key]}`)
        })

        window.location.search = `?${queryList.join('&')}`
        // console.log(`?${queryList.join('&')}`);
    }

    const handleURLSearchParams = ({ title, badgeTitle, selected }) => {

        // console.log('-->', { title, badgeTitle, selected })

        var values = [];

        if (searchQueryObject[badgeTitle]) {
            values = searchQueryObject[badgeTitle].split(',')
        }

        if (selected) {
            values.push(title)
        } else {
            values = values.filter(item => item !== title);
        }

        searchQueryObject[badgeTitle] = values.join(',')
        updateURL()

    }

    const handleSearchChange = (e) => {
        if (e.target.value === '') {
            setSearchQueryObject(prev => ({
                ...prev,
                [e.target.name]: null
            }))
            return
        }
        setSearchQueryObject(prev => ({
            ...prev,
            search: e.target.value
        }))
    }

    const handleFilterTypeChange = (e) => {
        searchQueryObject.filterType = e.target.value;
        updateURL();
    }

    const SidebarContent = () => {

        return (
            <div>

                <ButtonGroup isAttached colorScheme='brand_primary'>
                    <Button
                        variant={searchQueryObject.filterType == 'any' ? 'solid' : 'outline'}
                        value={'any'}
                        onClick={handleFilterTypeChange}
                    >
                        Match ANY
                    </Button>
                    <Button
                        variant={searchQueryObject.filterType == 'match' ? 'solid' : 'outline'}
                        value={'match'}
                        onClick={handleFilterTypeChange}
                    >Match ALL</Button>
                </ButtonGroup>

                <Stack direction={'column'}>
                    <Text>Categories</Text>
                    <Wrap>
                        {productCategories.isLoading && <Center w={'full'}>
                            <Spinner />
                        </Center>}
                        {productCategories.categoryList.map((category, index) => {
                            return <FilterBadge
                                key={index}
                                isSelected={
                                    searchQueryObject.categories && searchQueryObject.categories.split(',').includes(category._id)
                                }
                                title={category._id}
                                count={category.count}
                                badgeTitle={'categories'}
                                selectionCallback={handleURLSearchParams}
                            />
                        })}
                        {!productCategories.isLoading && productCategories.categoryList.length == 0 && <Text>
                            No Categories Found</Text>}
                    </Wrap>
                </Stack>

                <Divider my={5} />

                <Stack direction={'column'}>
                    <Text>Tags</Text>
                    <Wrap>
                        {productTags.isLoading && <Center w={'full'}>
                            <Spinner />
                        </Center>}
                        {productTags.tagList.map((tag, index) => {
                            return <FilterBadge
                                key={index}
                                isSelected={
                                    searchQueryObject.tags && searchQueryObject.tags.split(',').includes(tag._id)
                                }
                                title={tag._id}
                                count={tag.count}
                                badgeTitle={'tags'}
                                selectionCallback={handleURLSearchParams}
                            />
                        })}
                        {!productTags.isLoading && productTags.tagList.length == 0 && <Text>
                            No Tags Found</Text>}
                    </Wrap>
                </Stack>
            </div>
        )
    }

    return (
        <Box
            pt={12}
        >
            {SideDrawer()}
            <Box p={{ base: 3, sm: 1 }}>

                <Stack direction={{ base: 'column', xl: 'row' }}>
                    <Box
                        w={'300px'}
                        // bg={'red'}
                        display={{ base: 'none', xl: 'block' }}
                        p={2}
                    >
                        {SidebarContent()}

                    </Box>

                    <Box
                        w='full'
                    >
                        <Stack
                            direction='row'
                            justifyContent='center'
                        >
                            <Button
                                display={{ base: 'block', xl: 'none' }}
                                onClick={() => onOpen()}
                                w='fit-content'
                            >
                                <FiFilter />
                            </Button>

                            <InputCompnent
                                value={searchQueryObject.search || ''}
                                name='search'
                                handleChange={handleSearchChange}
                                placeholder='Enter Product Name'
                            />
                            <Button
                                onClick={updateURL}
                            >
                                <AiOutlineSearch />
                            </Button>
                        </Stack>

                        <Wrap
                            justify={'center'}
                            w={'full'}
                            spacing={5}
                            p={5}
                        >
                            {products.isLoading ? <Center h={'100vh'}><Spinner /></Center> :
                                products.products.map((product, index) => {
                                    return <ProductCard
                                        key={index}
                                        name={product.name}
                                        categories={product.categories}
                                        price={product.price}
                                        imageList={product.images}
                                        description={product.description}
                                        productID={product._id}
                                        stock={product.stock}
                                    />
                                })
                            }
                            {!products.isLoading && products.products.length === 0 && <Center h={'100vh'}><Text>No Products Found!</Text></Center>}
                        </Wrap>
                    </Box>
                </Stack>
            </Box >
        </Box >
    )
}

export default Shop