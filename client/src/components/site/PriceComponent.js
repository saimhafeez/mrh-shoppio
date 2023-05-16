import React from 'react'

import { Stack, Text } from '@chakra-ui/react'

function PriceComponent({ price = 0, componentColor = 'brand_primary.300', componentSize = '2xl' }) {
    return (
        <Stack
            direction={'row'}
            align={'center'}
            spacing={1}
        >
            <Text
                fontFamily={'brandSymbol'}
                fontSize={componentSize}
                fontWeight={'bold'}
                // opacity={'0.7'}
                color={componentColor}
            >
                $
            </Text>
            <Text
                fontSize={componentSize}
                fontWeight={'bold'}
                // opacity={'0.7'}
                color={componentColor}
            >
                {price}
            </Text>
        </Stack>
    )
}

export default PriceComponent