import { Box, Container, Stack, useRadio } from '@chakra-ui/react'
import React from 'react'
import { AiFillShop, AiFillShopping } from 'react-icons/ai'

function RadioCard(props) {

    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='md'
                boxShadow='md'
                _checked={{
                    bg: 'brand_primary.600',
                    color: 'brand_text.white',
                    borderColor: 'brand_primary.600',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                px={5}
                py={3}
            >
                <Box display='flex' justifyContent={'center'} alignItems={'center'}>
                    <Box marginRight={2}>
                        {props.value == 'customer' ? <AiFillShopping /> : <AiFillShop />}
                    </Box>
                    {props.children}
                </Box>
            </Box>
        </Box>
    )
}

export default RadioCard;