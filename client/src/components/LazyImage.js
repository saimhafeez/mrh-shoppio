import React, { useState } from 'react'
import { Skeleton, Image } from '@chakra-ui/react'

function LazyImage({ src, minW = "auto", maxW = "none", h = "auto", objectFit = "fill", w = 'auto', position = 'static', top = 'auto', left = 'auto', zIndex = 'auto' }) {

    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <Skeleton w={minW} h={h} isLoaded={imageLoaded}>
            <Image
                src={src}
                w={w}
                h={h}
                minW={minW}
                maxW={maxW}
                objectFit={objectFit}
                position={position}
                top={top}
                left={left}
                zIndex={zIndex}
                onLoad={() => setImageLoaded(true)}

            />
        </Skeleton>
    )
}

export default LazyImage