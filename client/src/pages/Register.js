import React from 'react'
import { FormRow } from '../components';
import SideImage from '../assets/images/shopping.jpg'
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
} from '@chakra-ui/react';

function Register() {
    return (
        <Flex flex={1} p={8} align={'center'} justify={'center'}>
            <Card padding={12}
                className='_card_elevated'
            >
                <CardBody>
                    <Stack spacing={4} w='full' maxW='md'>
                        <Heading fontSize={'2xl'}>
                            Sign in to your account
                        </Heading>

                        <FormRow name='email' type='email' label='email address' handleChange={handleInputChange} />

                        <FormRow name='password' type='password' handleChange={handleInputChange} />

                        <Stack spacing={6}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                justify={'space-between'}
                                align='start'
                            >

                                <Checkbox
                                    name='checkbox'
                                    type='checkbox'
                                    onChange={handleInputChange}
                                    colorScheme='brand_primary'
                                >
                                    Remember Me
                                </Checkbox>

                                <Link color={'brand_primary.500'}>Forgot Password?</Link>

                            </Stack>

                            <Button colorScheme='brand_primary' variant='solid'>
                                Sign in
                            </Button>
                        </Stack>

                    </Stack>
                </CardBody>
            </Card>
        </Flex >
    )
}

export default Register