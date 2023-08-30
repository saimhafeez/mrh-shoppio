import React from 'react'
import {
    Stack,
    Box,
    Text,
    Input
} from "@chakra-ui/react"

function InputCompnent({ name, value, w = "auto", minW = "auto", handleChange, placeholder = "" }) {
    return (
        <Stack
            spacing={0}
            w={w}
            direction='row'
            align='center'
            minW={minW}
        >
            <Box
                px={2}
                bg='gray.200'
                h='full'
                minH='40px'
                textAlign='center'
                display='flex'
                alignItems='center'
                borderLeftRadius={'5px'}
            >
                <Text className='_first-letter-uppercase' fontWeight='bold' textAlign='center'>{name}</Text>
            </Box>

            <Input
                type='text'
                borderLeftRadius={0}
                value={value}
                name={name}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </Stack>
    )
}

export default InputCompnent