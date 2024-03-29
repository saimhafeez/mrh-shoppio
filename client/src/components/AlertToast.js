import { useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useAppContext } from '../context/appContext';

function AlertToast() {

    const toast = useToast();

    const { showAlert, clearAlert, alertStatus, alertText } = useAppContext();

    // const id = `${alertStatus}_toast`

    useEffect(() => {
        // if (showAlert && alertStatus != '' && !toast.isActive('toast-alert')) {
        //     toast.closeAll()
        // }
        if (showAlert && alertStatus != '') {
            toast({
                // id: 'toast-alert',
                description: alertText,
                status: alertStatus,
                duration: 3000,
                isClosable: true,
                onCloseComplete: clearAlert,
                position: 'top'
            })
        }
    })

}

export default AlertToast