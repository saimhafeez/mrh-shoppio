import React, { useEffect, useState } from 'react'
import { FormRow, RadioCard } from '../components';

import {
    Button,
    Checkbox,
    Flex,
    Heading,
    Link,
    Stack,
    Card,
    CardBody,
    Text,
    useRadioGroup,
} from '@chakra-ui/react';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
    email: '',
    password: '',
    role: 'customer',
    rememberMe: true,
}

function Register() {

    const { user, displayAlert, roleOptions, loginUser, isLoading } = useAppContext();

    const [values, setValues] = useState(initialState)

    const navigate = useNavigate()

    const handleInputChange = (e) => {

        if (e == 'customer' || e == 'vendor') {
            setValues({ ...values, role: e });
            return
        }

        if (e.target.name == 'checkbox') {
            setValues({ ...values, rememberMe: e.target.checked })

        } else {

            setValues({ ...values, [e.target.name]: e.target.value });
        }

    }

    const handleSubmit = () => {

        const { email, password, role, rememberMe } = values;

        if (!email || !password) {
            displayAlert({
                alertText: 'Provide all fields.',
                alertStatus: 'error'
            })
            return
        }

        loginUser({
            currentUser: { email, password, role, rememberMe }
        })

        console.log('submit');


    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'role',
        defaultValue: roleOptions[0],
        onChange: handleInputChange,
    })

    const group = getRootProps()


    useEffect(() => {
        if (user) {
            if (user.role == 'vendor') {
                navigate('/vendor')
            }
        }
    }, [user, navigate])

    return (
        <Stack minH={'100vh'}>
            <Flex flex={1} p={8} align={'center'} justify={'center'}>
                <Card padding={12}
                    className='_card_elevated'
                    borderTop='4px'
                    borderColor='brand_primary.400'
                >
                    <CardBody>
                        <Stack spacing={4} w='full' maxW='md'>
                            <Heading fontSize={'2xl'}>
                                Sign in to your account
                            </Heading>

                            <FormRow
                                name='email'
                                type='text'
                                label='email address'
                                handleChange={handleInputChange}
                                handleSubmit={handleSubmit}
                            />

                            <FormRow
                                name='password'
                                type='password'
                                handleChange={handleInputChange}
                                handleSubmit={handleSubmit}
                            />

                            <Stack {...group}>
                                {roleOptions.map((value) => {
                                    const radio = getRadioProps({ value })
                                    return (
                                        <RadioCard key={value} {...radio}>
                                            {value}
                                        </RadioCard>
                                    )
                                })}
                            </Stack>

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
                                        defaultChecked={values.rememberMe}
                                    >
                                        Remember Me
                                    </Checkbox>

                                    <Link color={'brand_primary.500'}>Forgot Password?</Link>

                                </Stack>

                                <Button
                                    isLoading={isLoading}
                                    colorScheme='brand_primary' variant={isLoading ? 'outline' : 'solid'}
                                    onClick={handleSubmit}
                                    onKeyDown={(key) => {
                                        console.log(key);
                                    }}>
                                    Sign in
                                </Button>
                                <Text
                                    align={'end'}
                                >New User?&nbsp;
                                    <Link color='brand_primary.500'>
                                        Signup
                                    </Link>
                                </Text>
                            </Stack>

                        </Stack>
                    </CardBody>
                </Card>
            </Flex >
        </Stack>
    )
}

export default Register