import React, { useRef, useState } from 'react'
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
    Avatar,
    AvatarBadge,
    FormLabel,
    Heading,
    CircularProgress
} from '@chakra-ui/react'
import { AiFillCamera } from 'react-icons/ai'
import { useAppContext } from '../../../context/appContext'
import { ReadFile } from '../../../utils/ReadFile'
import { IoRemoveCircle } from 'react-icons/io5'
import { InputCompnent } from '../../../components'


function Profile() {

    const { user, uploadImagesToServer, updateUser, isLoading } = useAppContext()

    const [userUpdates, setUserUpdates] = useState({
        isLoading: false,
        profileUrl: user.profileUrl,
        profileUrlFormData: new FormData(),
        name: user.name,
        email: user.email
    })

    const [enablePicUpload, setEnablePicUpload] = useState(true);

    const handleChange = (e) => {

        if (e.target.name === "profileUrl") {

            if (e.target.files.length === 0) {
                return
            }

            const files = e.target.files;

            setUserUpdates(prev => ({
                ...prev,
                profileUrlFormData: prev.profileUrlFormData.append('file', files[0])
            }))

            ReadFile(files[0]).then((img) => {
                setUserUpdates(prev => ({
                    ...prev,
                    profileUrl: img
                }))
                setEnablePicUpload(false)
            }).catch((err) => console.log(err))

            uploadProfileUrlToServer().then((profileUrl) => {

                setUserUpdates(prev => ({
                    ...prev,
                    isLoading: false,
                    profileUrl: profileUrl,
                    profileUrlFormData: new FormData()
                }))

            }).catch((error) => console.log(error))

        } else {
            setUserUpdates(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }

    const saveChanges = () => {
        updateUser({
            email: userUpdates.email,
            name: userUpdates.name,
            profileUrl: userUpdates.profileUrl
        }, user._id)
        setEnablePicUpload(true)
    }

    const resetImage = () => {
        setEnablePicUpload(true)
        setUserUpdates(prev => ({
            ...prev,
            profileUrl: user.profileUrl,
            profileUrlFormData: new FormData()
        }))
    }

    const uploadProfileUrlToServer = async () => {

        setUserUpdates(prev => ({
            ...prev,
            isLoading: true
        }))

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await uploadImagesToServer(userUpdates.profileUrlFormData);

                const { links } = await data

                resolve(links[0]);
            } catch (error) {
                reject(error)
            }
        })
    }

    return (
        <Stack
            align='center'
            p={5}
        >
            <Card
                w={'100%'}
                maxW={'700px'}
                py={10}
                px={8}
            >
                <Stack
                    spacing={10}
                >
                    <Heading alignSelf='center'>{`Manage your profile`}</Heading>

                    <Box
                        position='relative'
                        alignSelf='center'
                        pb={'2.5em'}
                    >
                        <CircularProgress
                            size='120px'
                            p={0}
                            m={0}
                            isIndeterminate
                            display={userUpdates.isLoading ? 'block' : 'none'}
                        />

                        <Avatar
                            position={userUpdates.isLoading ? 'absolute' : 'relative'}
                            top={userUpdates.isLoading ? 2.5 : 0}
                            left={userUpdates.isLoading ? 2.5 : 0}
                            w={userUpdates.isLoading ? '100px' : '120px'}
                            h={userUpdates.isLoading ? '100px' : '120px'}
                            name={userUpdates.profileUrl === "" ? user.name : undefined}
                            src={userUpdates.profileUrl !== "" ? userUpdates.profileUrl : undefined}
                        >
                            {enablePicUpload && <AvatarBadge
                                bg='brand_primary.500'
                                p={1.5}
                                border='none'
                            >
                                <FormLabel
                                    htmlFor='image-upload'
                                    cursor={'pointer'}
                                    m={0}
                                >
                                    <AiFillCamera />

                                </FormLabel>
                                <Input
                                    id='image-upload'
                                    type={"file"}
                                    accept="image/png, image/jpeg"
                                    display={'none'}
                                    name='profileUrl'
                                    onChangeCapture={handleChange}
                                />
                            </AvatarBadge>
                            }

                        </Avatar>
                    </Box>

                    <Stack
                        direction='row'
                    >
                        <InputCompnent
                            handleChange={handleChange}
                            name={'name'}
                            value={userUpdates.name}
                            w={'50%'}
                        />
                        <InputCompnent
                            handleChange={handleChange}
                            name={'email'}
                            value={userUpdates.email}
                            w={'50%'}
                        />
                    </Stack>

                    <Button
                        w='fit-content'
                        colorScheme='brand_secondary'
                        variant='outline'
                        alignSelf='end'
                        isDisabled={isLoading}
                        onClick={saveChanges}
                    >
                        Save
                    </Button>

                </Stack>

            </Card >
        </Stack >
    )
}

export default Profile