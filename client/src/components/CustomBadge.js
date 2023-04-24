import React, { useEffect, useRef, useState } from 'react'
import { Badge, Text, Stack, Box, Input, Container, Editable, EditableInput, EditablePreview, Tag, TagLabel } from '@chakra-ui/react'

function CustomBadge({ removeBadge, badgeKey, colorScheme, currentbadgeText, updateBadge }) {

    const [badgeText, setBadgeText] = useState(currentbadgeText);

    const badgeRef = useRef(null);

    const [editable, setEditable] = useState(true)

    const handleInput = () => {
        setBadgeText(badgeRef.current.textContent);
    }

    const handleInputBlur = () => {
        setEditable(false)
        updateBadge({ badgeText, badgeKey });
    }

    const handleKey = (e) => {
        if (e.code === "Enter") {
            setEditable(false)
            updateBadge({ badgeText, badgeKey });
        }
        if (e.code === 'Backspace' && badgeText === '') {
            removeBadge(badgeKey)
        }
    }

    useEffect(() => {
        if (!editable && badgeText == '') {
            removeBadge(badgeKey);
        }
    }, [editable, badgeText])

    useEffect(() => {
        if (currentbadgeText == '') {
            badgeRef.current.focus();
        }
        badgeRef.current.textContent = currentbadgeText
    }, []);

    return (
        <Badge
            colorScheme={colorScheme}
            w={'fit-content'}
            px={2}
            ref={badgeRef}
            contentEditable={editable}
            onInput={handleInput}
            outline='none'
            onKeyDown={handleKey}
            onClick={() => setEditable(true)}
            onBlur={handleInputBlur}
        />
        // <Tag
        //     colorScheme='purple'
        //     w={'fit-content'}
        //     borderRadius={'2px'}
        //     px={2}
        //     editable={{
        //         isEditing: true,
        //         value: badgeText,
        //         onChange: handleInput,
        //         onSubmit: () => console.log('Submitted'),
        //         maxLines: 1, // add this prop
        //     }}
        //     contentEditable={true}
        // >
        //     <TagLabel>{badgeText}</TagLabel>
        // </Tag>
    )
}

export default CustomBadge