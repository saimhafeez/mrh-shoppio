import React from 'react'

import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

// function FormRow({ type, name, handleChange, label, handleSubmit }) {
function FormRow({ type, name, handleChange, label }) {
    return (
        // <form onSubmit={(e) => {
        //     e.preventDefault();
        //     handleSubmit();
        // }}>
        //     <FormControl id={name}>
        //         <FormLabel className='_first-letter-uppercase'>{label || name}</FormLabel>
        //         <Input type={type} name={name} onChange={handleChange} />
        //     </FormControl>
        // </form>
        <FormControl id={name}>
            <FormLabel className='_first-letter-uppercase'>{label || name}</FormLabel>
            {type === 'textarea' ?
                <Textarea name={name} onChange={handleChange} />
                :
                <Input type={type} name={name} onChange={handleChange} />
            }
        </FormControl>
    )
}

export default FormRow