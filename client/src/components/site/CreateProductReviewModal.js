import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
    Button,
    Stack,
    Text,
    Input,
    FormLabel,
    Box,
    Image,
    InputGroup,
    InputLeftAddon,
    Textarea,
    Badge,
    Wrap,
    WrapItem,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,

} from "@chakra-ui/react"
import { useAppContext } from '../../context/appContext';

function CreateProductReviewModal({ isOpen, onOpen, onClose, fetchReviewsCallback }) {

    const { displayAlert, isLoading } = useAppContext();
    const [rating, setRating] = useState(4)
    const [review, setReview] = useState('')
    const [sliderThumb, setSliderThumb] = useState('😊')

    useEffect(() => {
        //'😡', '😕', '😐', '😃', '🤩'
        if (rating == 1) {
            setSliderThumb("😡")
        } else if (rating == 2) {
            setSliderThumb("😕")
        } else if (rating == 3) {
            setSliderThumb("😐")
        } else if (rating == 4) {
            setSliderThumb("😃")
        } else {
            setSliderThumb("🤩")
        }
    }, [rating])

    const clearFields = () => {

    }

    const submitReview = async () => {

        onClose()
        clearFields()
        fetchReviewsCallback({
            rating,
            review
        });
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent mx={'2%'} w={'full'} >
                <ModalHeader>Product Review</ModalHeader>
                <ModalCloseButton />

                <ModalBody>

                    <Stack>
                        <Text>Give Rating</Text>
                        <InputGroup>
                            <Slider
                                colorScheme={'brand_primary'}
                                min={1}
                                max={5}
                                step={1}
                                value={rating}
                                onChange={(e) => setRating(e)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb
                                    fontSize={'lg'}
                                >
                                    {sliderThumb}
                                </SliderThumb>
                            </Slider>
                        </InputGroup>

                        <InputGroup alignItems={'center'} h={'60'} >
                            {/* <InputLeftAddon
                                children='Review'
                                h={'full'}
                                minW={120}
                                justifyContent={'center'}
                            /> */}
                            <Textarea
                                placeholder='Enter Review'
                                h={'full'}
                                resize={'none'}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </InputGroup>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme='brand_primary'
                        mr={3}
                        onClick={submitReview}
                        isLoading={isLoading}
                        isDisabled={!review}
                    >
                        Submit
                    </Button>
                    <Button
                        variant='outline'
                        colorScheme='brand_secondary'
                        onClick={clearFields}
                    >Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateProductReviewModal