import { Box, Flex, Stack, Button, Menu, MenuButton, Avatar, MenuList, Center, MenuDivider, MenuItem, useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Text, Badge, CircularProgress, Wrap } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { BiMenu } from 'react-icons/bi'
import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalFooter } from '@chakra-ui/react'
import NavLinks from './NavLinks'
import { useAppContext } from '../context/appContext'
import { CreateProductReviewModal } from './site'
import { UserHeaderMenu } from './'
import { MdNotifications } from 'react-icons/md'



function Header() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [notifications, setNotification] = useState({
        isLoading: true,
        list: null,
        count: 0
    })

    const { getNotifications, user } = useAppContext();

    const fetchNotifications = () => {

        return new Promise(async (resolve, reject) => {
            try {
                const { notifications, count } = await getNotifications(user._id);
                resolve({ notifications, count })
            } catch (error) {
                reject(error)
            }
        })

    }

    const getUnreadNotifications = () => {
        const unreadNotifications = []
        var count = 0;

    }

    const notificationComponent = (notification) => {

        const regex = /!(.*?)!/g;
        const matches = notification.message.match(regex);

        const extractedStrings = matches.map(match => match.slice(1, -1));

        const result = notification.message.split(regex);

        const component = <Stack

            bg={'gray.50'}
            direction='column'
            p={2}
            borderBottom='1px solid var(--chakra-colors-brand_primary-100)'
            m={2}
            borderRadius='12px'
        >
            <Text color={'brand_secondary.500'} fontWeight='bold'>{notification.title}</Text>
            {/* <Wrap
                align='center'

            >
                {
                    result.map((item, index) => {

                        for (const string of extractedStrings) {
                            if (item === string) {
                                return <Badge key={index} w='fit-content'
                                    colorScheme='brand_primary'
                                >
                                    {string}
                                </Badge>
                            }
                        }

                        return <Text key={index}>
                            {item}
                        </Text>

                    })
                }
            </Wrap> */}
            <Text>{result}</Text>
            <Text color={'brand_secondary.500'} fontWeight='bold'>{notification.createdAt}</Text>
        </Stack>

        return component
    }

    useEffect(() => {
        fetchNotifications().then(({ notifications, count }) => {

            setNotification({
                isLoading: false,
                list: notifications,
                count
            })

            console.log({ notifications, count })

        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <Box
            h='var(--nav-height)'
            w='full'
            px={4}
        >
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'brand_background.light'} mx={'5%'}>
                    <NavLinks toggleSidebar={onClose} />
                </ModalContent>
            </Modal>
            <Flex
                alignItems={'center'}
                justifyContent={'space-between'}
                h={'full'}
            >
                <Box>
                    <Logo />
                </Box>

                <Flex
                    align={'center'}
                >
                    <Stack
                        direction={'row'}
                        spacing={2}
                        align="center"
                    >
                        <Button display={{ lg: 'none' }} onClick={onOpen}>
                            {<BiMenu />}
                        </Button>


                        <Stack
                            position='relative'
                        >
                            <MdNotifications size='30px' />
                            {/* <Badge
                                position='absolute'
                                bottom={7}
                                left={5}
                            // colorScheme='brand_primary'
                            >
                                {notifications.isLoading ? <CircularProgress size='12px' isIndeterminate color='brand_primary.500' /> : notifications.count}
                            </Badge> */}

                            {/* <Stack
                                position='absolute'
                                direction='column'
                                maxW='350px'
                                maxH='200px'
                                overflow='auto'
                                m={2}
                            >
                                {notifications.isLoading ? <Center>
                                    <CircularProgress size='12px' isIndeterminate color='brand_primary.500' />
                                </Center> :
                                    notifications.list.map((notification, index) => {
                                        return notificationComponent(notification)
                                    })
                                }
                            </Stack> */}
                            {/* <Menu>
                                <MenuButton>
                                </MenuButton>
                                <MenuList
                                    maxW='350px'
                                    maxH='200px'
                                    overflow='auto'
                                    m={2}
                                >
                                    {notifications.isLoading ? <Center>
                                        <CircularProgress size='12px' isIndeterminate color='brand_primary.500' />
                                    </Center> :
                                        notifications.list.map((notification, index) => {
                                            return notificationComponent(notification)
                                        })
                                    }


                                </MenuList>
                            </Menu> */}


                        </Stack>
                        {<UserHeaderMenu />}
                    </Stack>
                </Flex>
            </Flex>
        </Box >
    )
}

export default Header