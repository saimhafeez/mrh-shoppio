import React from 'react'
import { Box, Stack, Link, ButtonGroup, Button, Avatar, Text, useDisclosure, Center } from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { Logo, UserHeaderMenu } from '../../components'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsCart, BsCartCheckFill } from 'react-icons/bs'
import { BiMenu } from 'react-icons/bi'
import { CgTrack } from 'react-icons/cg'
import { CartSidebar } from '../../components/site'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

function Header() {

    const { user, addCartFromLocalStorage, removeCartFromLocalStorage } = useAppContext()
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Stack
            direction='row'
            height={{ base: 'initial', md: 'var(--nav-height)' }}
            align='center'
            px={'5%'}
            bg={'#edf2f7'}
            justifyContent={{ base: 'center', md: 'space-between' }}

        // borderBottom={'2px solid var(--chakra-colors-brand_secondary-500)'}

        >
            <CartSidebar isOpen={isOpen} onClose={onClose} onOpen={onOpen} />

            <Accordion allowToggle display={{ base: 'initial', md: 'none' }}>
                <AccordionItem>
                    <AccordionButton>
                        <Stack w='100%' alignItems='center'>
                            <BiMenu />
                        </Stack>
                    </AccordionButton>

                    <AccordionPanel pb={4}>
                        <Stack align='center'>
                            <UserHeaderMenu />
                            <Button onClick={() => (navigate('/'))} variant={'outline'}>Home</Button>
                            <Button onClick={() => (navigate('/shop'))} variant={'outline'}>Shop</Button>
                            <Button variant={'outline'} onClick={() => (navigate('/shop/track-order'))}>
                                <Text mr={2}>Track Order</Text>
                                <CgTrack />
                            </Button>
                            <Button variant={'outline'} onClick={() => (navigate('/shop/wishlist'))}>
                                <Text mr={2}>WishList</Text>
                                <AiOutlineHeart />
                            </Button>
                            <Button variant={'outline'}
                                onClick={onOpen}
                            >
                                <Text mr={2}>Cart</Text>
                                <BsCart />
                            </Button>
                        </Stack>

                    </AccordionPanel>
                </AccordionItem>
            </Accordion>


            <ButtonGroup display={{ base: 'none', md: 'initial' }} isAttached>
                <Button onClick={() => (navigate('/'))} variant={'outline'}>Home</Button>
                <Button onClick={() => (navigate('/shop'))} variant={'outline'}>Shop</Button>
            </ButtonGroup>



            <Box display={{ base: 'none', md: 'block' }}>
                <Logo />
            </Box>

            <Stack display={{ base: 'none', md: 'flex' }} direction={'row'} align={'center'} >
                <ButtonGroup isAttached>
                    <Button variant={'outline'} onClick={() => (navigate('/shop/track-order'))}>
                        <Text mr={2}>Track Order</Text>
                        <CgTrack />
                    </Button>
                    <Button variant={'outline'} onClick={() => (navigate('/shop/wishlist'))}>
                        <Text mr={2}>WishList</Text>
                        <AiOutlineHeart />
                    </Button>
                    <Button variant={'outline'}
                        onClick={onOpen}
                    >
                        <Text mr={2}>Cart</Text>
                        <BsCart />
                    </Button>
                </ButtonGroup>
                <UserHeaderMenu />
            </Stack>
        </Stack>
    )
}

export default Header