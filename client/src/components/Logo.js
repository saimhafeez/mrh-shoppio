import React from 'react'
import logo from '../assets/images/logo.png'
import { Image } from '@chakra-ui/react'

function Logo() {
    return (
        <Image src={logo} alt='site Logo' maxW={164} />
    )
}

export default Logo