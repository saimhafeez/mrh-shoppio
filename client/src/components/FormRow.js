import React from 'react'

import { FormControl, FormLabel, Input } from '@chakra-ui/react';

function FormRow({ type, name, handleChange, label }) {
    return (
        <FormControl id={name}>
            <FormLabel className='_first-letter-uppercase'>{label || name}</FormLabel>
            <Input type={type} name={name} onChange={handleChange} />
        </FormControl>
    )
}

export default FormRow