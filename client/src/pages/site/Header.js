import React from 'react'
import { Box, Stack, Link, Button, Avatar } from '@chakra-ui/react'
import { useAppContext } from '../../context/appContext'

function Header() {

    const { user } = useAppContext()


    return (
        <Stack
            direction={'row'}
            height={'var(--nav-height)'}
            align={'center'}
            px={'5%'}
            bg={'#edf2f7'}
            justifyContent={'space-between'}

        // borderBottom={'2px solid var(--chakra-colors-brand_secondary-500)'}

        >
            <Stack direction={'row'}>
                <Link>Home</Link>
                <Link>Shop</Link>
            </Stack>

            <Avatar name={user && user.name} />
        </Stack>
    )
}

export default Header