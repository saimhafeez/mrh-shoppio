import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Stack, Image, CheckboxGroup, Heading } from '@chakra-ui/react'
import { useAppContext } from '../context/appContext'

import vendorSidebarLinks from '../utils/links'
import userSidebarLinks from '../utils/user_sidebar_links'

function NavLinks({ toggleSidebar }) {

    const { user } = useAppContext();

    const links = user.role === 'customer' ? userSidebarLinks : vendorSidebarLinks

    return (
        <div>
            {links.map((link) => {
                const { text, path, id, icon } = link

                return (
                    <NavLink
                        to={path}
                        // className={'nav-link'}
                        key={id}
                        onClick={toggleSidebar}
                        // activeClassName="active_"
                        className={() => {
                            const currentPath = window.location.pathname.split('/')
                            const pathTo = path.split('/')
                            return currentPath[currentPath.length - 1] == pathTo[pathTo.length - 1] ? 'nav-link active' : 'nav-link';
                        }}

                    >

                        <Stack
                            direction={'row'}
                            m={2}
                            p={4}
                            borderRadius={10}
                            align={'center'}
                        >
                            <div className='icon'>{icon}</div>
                            <div>{text}</div>

                        </Stack>

                    </NavLink>
                )
            })}
        </div>
    )
}

export default NavLinks