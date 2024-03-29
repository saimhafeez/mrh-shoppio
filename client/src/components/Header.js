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
                        {<UserHeaderMenu />}
                    </Stack>
                </Flex>
            </Flex>
        </Box >
    )
}

export default Header