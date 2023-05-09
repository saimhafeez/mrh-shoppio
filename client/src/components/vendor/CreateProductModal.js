import React, { useState } from 'react'
import { CustomBadge } from '../../components/index'
import { v4 as uuidv4 } from 'uuid';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
    Button,
    Stack,
    Text,
    Input,
    FormLabel,
    Box,
    Image,
    InputGroup,
    InputLeftAddon,
    Textarea,
    Badge,
    Wrap,
    WrapItem,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper

} from "@chakra-ui/react"
import { useAppContext } from '../../context/appContext';

function CreateProductModal({ isOpen, onOpen, onClose, fetchProductsCallback }) {

    const { displayAlert, createProduct, isLoading, uploadImagesToServer } = useAppContext();

    // const [image, setImage] = useState({
    //     fileName: null,
    //     base64: null
    // })

    const [images, setImages] = useState([])

    const [imagesFormData, setImagesFormData] = useState(new FormData())

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(1)
    const [stock, setStock] = useState(1)

    const [badgeList, setBadgeList] = useState([]);

    const addbadge = ({ badgeName }) => {
        const uniqueId = uuidv4();
        const newItem = {
            badgeName: badgeName,
            badgeKey: uniqueId,
            badgeText: null
        }
        setBadgeList(preList => [...preList, newItem]);

    }

    const updateBadge = ({ badgeKey, badgeText }) => {
        setBadgeList(prevList => prevList.map(badge => {
            if (badge.badgeKey === badgeKey) {
                return {
                    ...badge,
                    badgeText
                }
            } else {
                return badge
            }
        }))
    }

    const removeBadge = (key) => {
        const updatedList = badgeList.filter((badge) => badge.badgeKey !== key);
        setBadgeList(updatedList);
    }

    const clearFields = () => {
        clearImages()
        setName('')
        setBadgeList([])
        setPrice(1)
        setStock(1)
        setDescription('')
        onClose()
    }

    const clearImages = () => {
        setImages([])
        setImagesFormData(new FormData())
    }



    const readImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = reader.result;
                resolve(img);
            };
            reader.onerror = (error) => {
                console.log("Error", error);
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageSelection = async (e) => {

        if (!e.target.files) {
            return
        }

        const files = e.target.files;

        for (const file of files) {

            console.log('-->', file);

            imagesFormData.append('file', file);

            const img = await readImage(file)

            setImages(preList => [...preList, img])

            // var reader = new FileReader();

            // reader.readAsDataURL(file, "UTF-8");

            // reader.onload = () => {

            //     const img = reader.result;
            //     console.log('_img', img);
            //     setImages(preList => [...preList, img])
            // }
            // reader.onerror = error => {
            //     console.log('Error', error);
            // }
            // reader.abort()
        }

        console.log('formData', ...imagesFormData);
        console.log('images', images);

        // console.log(image._image);

        // if (files.length > 0) {
        //     const data = new FormData();
        //     data.append('files', files[0]);

        //     console.log('data', data);
        //     console.log('files', files);
        // }

        /*

        console.log('e.target.value', e.target.value);

        if (!e.target.value) {
            return
        }

        var reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        console.log('e.target.files[0]', e.target.files[0]);

        reader.onload = () => {
            console.log(reader);
            setImage({
                fileName: e.target.files[0].name,
                base64: reader.result
            })
        }
        reader.onerror = error => {
            console.log('Error', error);
        }

        */
    }



    const uploadProduct = async () => {

        const categories = [];
        const tags = [];

        badgeList.map((badge) => {
            if (badge.badgeName == 'category') {
                categories.push(badge.badgeText.toLowerCase())
            }
            if (badge.badgeName == 'tag') {
                tags.push(badge.badgeText.toLowerCase())
            }
        })


        if (!name || !description || images.length == 0 || categories.length == 0 || tags.length == 0) {
            displayAlert({ alertStatus: 'error', alertText: 'Provide all Fields' })
            return
        }

        const { data } = await uploadImagesToServer(imagesFormData);

        const { links } = data

        createProduct({
            name,
            description,
            images: links,
            price,
            stock,
            categories,
            tags,
        });
        // createProduct({
        //     name,
        //     description,
        //     images: links.join(','),
        //     price,
        //     categories: categories.join(','),
        //     tags: tags.join(','),
        // });

        onClose()
        clearFields()
        fetchProductsCallback();

    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent mx={'2%'} w={'full'} >
                <ModalHeader>Product Details</ModalHeader>
                <ModalCloseButton />

                <ModalBody>

                    <Stack>
                        <Stack
                            direction={'row'}
                            align={'center'}
                            justifyContent={'center'}
                            spacing={0}
                        >
                            <FormLabel
                                htmlFor='image-upload'
                                cursor={'pointer'}
                                border={'2px'}
                                px={2}
                                className='fileNameBadge'
                                m={0}
                            >
                                {images.length > 0 ? `${images.length} Images Selected` : 'Upload Product Image'}
                            </FormLabel>
                            {images.length > 0 &&
                                <Box
                                    borderLeft={0}
                                    px={2}
                                    bg={'brand_primary.500'}
                                    color={'brand_text.white'}
                                    cursor={'pointer'}
                                    border={'2px solid var(--chakra-colors-brand_primary-500)'}
                                    onClick={clearImages}
                                >X</Box>
                            }
                            <Input
                                id='image-upload'
                                type='file'
                                multiple={true}
                                accept="image/png, image/jpeg"
                                display={'none'}
                                onChange={handleImageSelection} />
                        </Stack>

                        <Stack direction={'row'} overflow={'auto'}>
                            {images.length > 0 && images.map((image, index) => {
                                return <Image src={image} key={index} />
                            })}
                        </Stack>

                        <InputGroup>
                            <InputLeftAddon
                                children='Name'
                                minW={120}
                                justifyContent={'center'}
                            />
                            <Input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </InputGroup>


                        <InputGroup
                        >
                            <InputLeftAddon
                                children='Price'
                                minW={120}
                                justifyContent={'center'}
                            />
                            <NumberInput
                                defaultValue={1}
                                precision={2}
                                step={0.2}
                                w={'full'}
                                min={1}
                            >
                                <NumberInputField
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {/* <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper> */}
                            </NumberInput>
                        </InputGroup>

                        <InputGroup>
                            <InputLeftAddon
                                children='Stock'
                                minW={120}
                                justifyContent={'center'}
                            />
                            <NumberInput
                                defaultValue={1}
                                step={1}
                                w={'full'}
                                min={1}
                            >
                                <NumberInputField
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                {/* <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper> */}
                            </NumberInput>
                        </InputGroup>

                        <InputGroup alignItems={'center'} h={'60'} >
                            <InputLeftAddon
                                children='Description'
                                h={'full'}
                                minW={120}
                                justifyContent={'center'}
                            />
                            <Textarea
                                h={'full'}
                                borderTopLeftRadius={0}
                                borderBottomLeftRadius={0}
                                resize={'none'}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputLeftAddon
                                children='Categories'
                                minW={120}
                                justifyContent={'center'}
                                h={'initial'}
                            />
                            {/* TODO : borderColor for dark mode needed */}
                            <Box
                                border={'1px'}
                                w={'full'}
                                borderColor={'#e2e8f0'}
                            >
                                <Stack
                                    padding={2}
                                    direction={'row'}
                                >
                                    <Wrap>
                                        {badgeList.length !== 0 && badgeList.map((badge) => {
                                            if (badge.badgeName === 'category') {
                                                return <CustomBadge
                                                    key={badge.badgeKey}
                                                    badgeKey={badge.badgeKey}
                                                    removeBadge={removeBadge}
                                                    colorScheme='purple'
                                                    currentbadgeText={badge.badgeText || ''}
                                                    updateBadge={updateBadge}
                                                />
                                            }
                                        })}
                                        <Badge
                                            colorScheme='purple'
                                            w={'fit-content'}
                                            px={2}
                                            onClick={() => addbadge({ badgeName: 'category' })}
                                            cursor={'pointer'}
                                        >
                                            +
                                        </Badge>
                                    </Wrap>

                                </Stack>
                            </Box>
                        </InputGroup>


                        <InputGroup>
                            <InputLeftAddon
                                children='Tags'
                                minW={120}
                                justifyContent={'center'}
                                h={'initial'}
                            />
                            {/* TODO : borderColor for dark mode needed */}
                            <Box
                                border={'1px'}
                                w={'full'}
                                borderColor={'#e2e8f0'}
                            >
                                <Stack
                                    padding={2}
                                    direction={'row'}
                                >
                                    <Wrap>
                                        {badgeList.length !== 0 && badgeList.map((badge) => {
                                            if (badge.badgeName === 'tag') {
                                                return <CustomBadge
                                                    key={badge.badgeKey}
                                                    badgeKey={badge.badgeKey}
                                                    removeBadge={removeBadge}
                                                    colorScheme='brand_primary'
                                                    currentbadgeText={badge.badgeText || ''}
                                                    updateBadge={updateBadge}
                                                />
                                            }
                                        })}
                                        <Badge
                                            colorScheme='brand_primary'
                                            w={'fit-content'}
                                            px={2}
                                            onClick={() => addbadge({ badgeName: 'tag' })}
                                            cursor={'pointer'}
                                        >
                                            +
                                        </Badge>
                                    </Wrap>

                                </Stack>
                            </Box>
                        </InputGroup>


                    </Stack>

                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='brand_primary'
                        mr={3}
                        onClick={uploadProduct}
                        isLoading={isLoading}
                    >
                        Upload
                    </Button>
                    <Button
                        variant='outline'
                        colorScheme='brand_secondary'
                        onClick={clearFields}
                    >Cancel Upload</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateProductModal