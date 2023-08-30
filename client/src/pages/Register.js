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
    name: '',
    shop: {
        name: '',
        address: '',
        description: '',
    },
    email: '',
    password: '',
    role: 'customer',
    rememberMe: true,
    newMember: false
}

function Register() {

    const { user, displayAlert, roleOptions, authenticateUser, isLoading } = useAppContext();

    const [values, setValues] = useState(initialState)

    const navigate = useNavigate()

    const handleInputChange = (e) => {

        if (e == 'customer' || e == 'vendor') {
            setValues({ ...values, role: e });
            return
        }

        if (e.target.name == 'checkbox') {
            setValues({ ...values, rememberMe: e.target.checked })

        } else if (e.target.name == 'shop-name') {
            setValues({
                ...values,
                shop: {
                    ...values.shop,
                    name: e.target.value
                }
            });
        } else if (e.target.name == 'shop-address') {
            setValues({
                ...values,
                shop: {
                    ...values.shop,
                    address: e.target.value
                }
            });
        } else if (e.target.name == 'shop-description') {
            setValues({
                ...values,
                shop: {
                    ...values.shop,
                    description: e.target.value
                }
            });
        } else {

            setValues({ ...values, [e.target.name]: e.target.value });
        }

    }

    const handleSubmit = () => {

        const { email, password, role, rememberMe, newMember, name } = values;

        if (!email || !password || (newMember && !name)) {
            displayAlert({
                alertText: 'Provide all fields.',
                alertStatus: 'error'
            })
            return
        }

        authenticateUser({
            _user: { ...values }
        })
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
            } else {
                navigate('/shop')
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
                                {values.newMember ? "Sign up for account" : "Sign in to your account"}
                            </Heading>

                            {values.newMember && <FormRow
                                name='name'
                                type='text'
                                handleChange={handleInputChange}
                            />}

                            <FormRow
                                name='email'
                                type='text'
                                label='email address'
                                handleChange={handleInputChange}
                            />

                            <FormRow
                                name='password'
                                type='password'
                                handleChange={handleInputChange}
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
                                <Checkbox
                                    name='checkbox'
                                    type='checkbox'
                                    onChange={handleInputChange}
                                    colorScheme='brand_primary'
                                    defaultChecked={values.rememberMe}
                                >
                                    Remember Me
                                </Checkbox>

                                {values.newMember && values.role === 'vendor' &&
                                    <Stack
                                        direction='column'
                                    >
                                        <FormRow
                                            name='shop-name'
                                            type='text'
                                            label='Shop Name'
                                            handleChange={handleInputChange}
                                        />
                                        <FormRow
                                            name='shop-address'
                                            type='text'
                                            label='Shop Address'
                                            handleChange={handleInputChange}
                                        />
                                        <FormRow
                                            name='shop-description'
                                            type='textarea'
                                            label='Shop Description'
                                            handleChange={handleInputChange}
                                        />
                                    </Stack>
                                }

                                <Button
                                    isLoading={isLoading}
                                    colorScheme='brand_primary' variant={isLoading ? 'outline' : 'solid'}
                                    onClick={handleSubmit}
                                    onKeyDown={(key) => {
                                        console.log(key);
                                    }}>
                                    {values.newMember ? "Sign up" : "Sign in"}
                                </Button>
                                <Text
                                    align={'end'}
                                >{values.newMember ? "Existing User?" : "New User?"}&nbsp;
                                    <Link onClick={() => setValues(prev => ({
                                        ...prev,
                                        newMember: !prev.newMember
                                    }))} color='brand_primary.500'>
                                        {values.newMember ? "Login" : "Signup"}
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