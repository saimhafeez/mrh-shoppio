import React from 'react'

import { Box, Flex, Stack, Button, Menu, MenuButton, Avatar, MenuList, Center, MenuDivider, MenuItem, useDisclosure } from '@chakra-ui/react'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'

function UserHeaderMenu() {

    const { user, logoutUser } = useAppContext()

    const navigate = useNavigate()

    return (
        <Box
            zIndex={101}
        >
            <Menu>
                <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                >
                    <Avatar
                        size={'sm'}
                        name={user && user.name}
                        src={user && (user.profileUrl === "" ? undefined : user.profileUrl)}
                    />
                </MenuButton>

                <MenuList
                    alignItems={'center'}
                    mr={5}

                >
                    <Box
                        maxH={'50vh'}
                        overflow={'auto'}
                    >
                        <br />
                        <Center>
                            <Avatar
                                size={'2xl'}
                                name={user && user.name}
                                src={user && (user.profileUrl === "" ? undefined : user.profileUrl)}
                            />
                        </Center>
                        <br />
                        <Center>
                            <p>{user ? user.name : 'Username'}</p>
                        </Center>
                        <br />
                        <MenuDivider />
                        <MenuItem
                            isDisabled={user === null ? true : false}
                            onClick={() => {

                                if (user.role === 'vendor') {
                                    navigate('/vendor')
                                } else if (user.role === 'customer') {
                                    navigate('/shop/myorders')
                                }
                            }}
                        >
                            {user ? user.role === 'vendor' ? 'Dashboard' : 'My Orders' : 'Dashboard'}
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                navigate('/register')
                            }}
                            isDisabled={user === null ? false : true}
                        >
                            Login/Register
                        </MenuItem>

                        <MenuItem
                            onClick={logoutUser}
                            isDisabled={user === null ? true : false}
                        >
                            Logout
                        </MenuItem>
                    </Box>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default UserHeaderMenu