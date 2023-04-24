import { IoBarChartSharp } from 'react-icons/io5'
import { ImStatsBars } from 'react-icons/im'
import { MdPayments } from 'react-icons/md'
import { FaShoppingBasket, FaUser } from 'react-icons/fa'

const links = [
    {
        id: 1,
        text: 'Stats',
        path: '/vendor',
        icon: <ImStatsBars />
    },
    {
        id: 2,
        text: 'Products',
        path: 'products',
        icon: <FaShoppingBasket />
    },
    {
        id: 3,
        text: 'Orders',
        path: 'orders',
        icon: <MdPayments />
    },
    {
        id: 4,
        text: 'Profile',
        path: 'profile',
        icon: <FaUser />
    },
]

export default links