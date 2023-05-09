import { Box, Flex, Stack, Button, Menu, MenuButton, Avatar, MenuList, Center, MenuDivider, MenuItem, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import Logo from './Logo'
import { BiMenu } from 'react-icons/bi'
import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalFooter } from '@chakra-ui/react'
import NavLinks from './NavLinks'
import { useAppContext } from '../context/appContext'
import { CreateProductReviewModal } from './site'

function Header() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, logoutUser } = useAppContext()

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
                        spacing={7}
                        align={'center'}
                    >
                        <Button display={{ lg: 'none' }} onClick={onOpen}>
                            {<BiMenu />}
                        </Button>

                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <Avatar
                                    size={'sm'}
                                    name={user.name}
                                />
                            </MenuButton>

                            <MenuList
                                alignItems={'center'}
                                mr={5}

                            >
                                <Box
                                    maxH={'50vh'}
                                    overflow={'auto'}
                                >
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            name={user.name}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>Username</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>
                                        Your Servers
                                    </MenuItem>

                                    <MenuItem>
                                        Account Settings
                                    </MenuItem>

                                    <MenuItem
                                        onClick={logoutUser}
                                    >
                                        Logout
                                    </MenuItem>
                                </Box>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Flex>
            </Flex>
        </Box >
    )
}

export default Header