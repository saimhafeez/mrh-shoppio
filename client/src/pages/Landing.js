import React, { useEffect, useState } from 'react'
import { Logo } from '../components';
import SideImage from '../assets/images/shopping.png'
import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
    Box,
    Card,
    CardBody,
    Text,
} from '@chakra-ui/react';

const handleInputChange = (e) => {
    if (e.target.name == 'checkbox') {
        console.log(e.target.name, e.target.checked);
        return
    }
    console.log(e.target.name, e.target.value);

}

function Landing() {


    return (
        <Stack
            bgColor='brand_background.white'
        >
            <Stack
                minH={'100vh'}
                boxSizing='border-box'
                w='100vw'
                maxW='var(--max-width)'
                direction='row'
                m={'0 auto'}
            >
                <Flex flex={1} p={8} align={'center'} justify={'center'}>
                    <Stack spacing={5}>
                        <Logo />
                        <Heading color='brand_text.dark'>
                            Shop&nbsp;
                            <Heading
                                color='brand_primary.500' display='inline-block'
                            >Effortlessly
                            </Heading>
                        </Heading>
                        <Text lineHeight={'1.5'} color='brand_text.light' fontWeight={'medium'}>
                            Welcome to our one-stop e-commerce platform. Shop conveniently from a wide range of vendors, create a personalized profile, and enjoy secure payments. As a vendor, expand your business and reach a wider audience. Discover your new favorites today!
                        </Text>

                        <Button
                            variant={'solid'}
                            colorScheme='brand_primary'
                            maxW={'14em'}
                            alignSelf={{ sm: 'center', lg: 'start' }}
                        >
                            Login or Register
                        </Button>
                    </Stack>

                </Flex >
                <Flex
                    flex={1}
                    p={6}
                    display={{ base: "none", lg: "flex" }}
                    align='center'
                    justify='center'
                >
                    <Image
                        alt='Sign-in Image'
                        objectFit='contain'
                        src={SideImage}
                    />
                </Flex>
            </Stack >

        </Stack >
    )
}

export default Landing