import {
    Stack,
    Flex,
    Box,
    Text,
    Button,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody
} from "@chakra-ui/react"
import { TiPlus } from 'react-icons/ti'


import createProductHeroImage from '../../assets/images/vendor_createProductHero.png'

import CreateProductModal from './CreateProductModal'

export default function CreateProductHero({ fetchProductsCallback }) {

    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <Stack
            direction={{ base: "column", lg: "row" }}
            align={'center'}
            mx={5}
        >

            <CreateProductModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} fetchProductsCallback={fetchProductsCallback} />

            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                <Text color={"brand_text.light"}>
                    Here, you can easily add new products, edit existing ones, and remove outdated or discontinued products. You can also categorize your products, making it easier for customers to find what they are looking for. Additionally, you can add product descriptions, prices, and images, which will help entice potential customers to make a purchase.
                </Text>
                <Button
                    rounded={"full"}
                    size={"lg"}
                    fontWeight={"normal"}
                    px={6}
                    leftIcon={<TiPlus />}
                    onClick={onOpen}
                >
                    Create Product
                </Button>
            </Stack>

            <Flex
                flex={1}
                justify={"center"}
                align={"center"}
                position={"relative"}
                w={"full"}
            >
                <Box
                    position={"relative"}
                    overflow={"hidden"}
                >
                    <Image
                        alt={"Hero Image"}
                        fit={"cover"}
                        align={"center"}
                        w={"100%"}
                        h={"100%"}
                        src={createProductHeroImage}
                        display={{ base: 'none', lg: 'block' }}
                    />
                </Box>
            </Flex>
        </Stack>
    )
}