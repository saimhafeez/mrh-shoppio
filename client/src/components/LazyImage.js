import React, { useState } from 'react'
import { Skeleton, Image } from '@chakra-ui/react'

function LazyImage({ src, minW = "auto", maxW = "none", h = "auto", objectFit = "fill" }) {

    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <Skeleton w={minW} h={h} isLoaded={imageLoaded}>
            <Image
                src={src}
                minW={minW}
                maxW={maxW}
                h={h}
                objectFit={objectFit}
                onLoad={() => setImageLoaded(true)}

            />
        </Skeleton>
    )
}

export default LazyImage