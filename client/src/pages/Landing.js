import React, { useEffect, useState } from 'react'
import { Logo } from '../components';
import { useNavigate } from 'react-router-dom';
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

function Landing() {


    const navigate = useNavigate();

    return (
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

                    <Stack>
                        <Button
                            variant={'solid'}
                            colorScheme='brand_primary'
                            w='100%'
                            maxW={'14em'}
                            alignSelf={{ sm: 'center', lg: 'start' }}
                            onClick={() => navigate('/register')}
                        >
                            Login or Register
                        </Button>

                        <Button
                            variant={'solid'}
                            colorScheme='brand_secondary'
                            w='100%'
                            maxW={'14em'}
                            alignSelf={{ sm: 'center', lg: 'start' }}
                            onClick={() => navigate('/shop')}
                        >
                            Browse Shop
                        </Button>
                    </Stack>

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
    )
}

export default Landing