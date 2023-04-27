import { Badge, Checkbox, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im'

function FilterBadge({ isSelected = false, title, badgeTitle, selectionCallback, count }) {

    const [selected, setSelected] = useState(isSelected)

    const selectBadge = () => {
        setSelected(!selected);
        selectionCallback({ selected: !selected, title, badgeTitle })
    }

    return (
        <Badge
            colorScheme={selected && 'green'}
            onClick={selectBadge}
            cursor={'pointer'}
        >
            <Stack direction={'row'} align={'center'}>

                {isSelected ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
                <Text>{title}</Text>
                <Text>{`( ${count || 0} )`}</Text>
            </Stack>
        </Badge>
        // <Checkbox
        //     isChecked={selected}
        //     colorScheme='green'
        //     onClick={selectBadge}
        // >
        //     {title}
        //     {/* <Badge
        //         colorScheme={selected && 'green'}
        //     >
        //     </Badge> */}
        // </Checkbox>

    )
}

export default FilterBadge