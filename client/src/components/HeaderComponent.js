import React from 'react'
import { Box, Stack, Link, ButtonGroup, Button, Avatar, Text, useDisclosure } from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { Logo, UserHeaderMenu } from '../../components'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsCart, BsCartCheckFill } from 'react-icons/bs'
import { CartSidebar } from '../../components/site'

function Header() {

    const { user, addCartFromLocalStorage, removeCartFromLocalStorage } = useAppContext()
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Stack
            direction={{ base: 'column', md: 'row' }}
            height={'var(--nav-height)'}
            align={{ base: 'center', md: 'center' }}
            px={'5%'}
            bg={'#edf2f7'}
            justifyContent={{ base: 'center', md: 'space-between' }}

        // borderBottom={'2px solid var(--chakra-colors-brand_secondary-500)'}

        >
            <CartSidebar isOpen={isOpen} onClose={onClose} onOpen={onOpen} />

            <ButtonGroup isAttached>
                <Button onClick={() => (navigate('/'))} variant={'outline'}>Home</Button>
                <Button onClick={() => (navigate('/shop'))} variant={'outline'}>Shop</Button>
            </ButtonGroup>



            <Box display={{ base: 'none', lg: 'block' }}>
                <Logo />
            </Box>

            <Stack direction={'row'} align={'center'} >
                <ButtonGroup isAttached>
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