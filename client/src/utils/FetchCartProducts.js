
export const fetchCartProduct = ({ cart, getSingleProduct }) => {

    return new Promise(async (resolve, reject) => {
        try {
            const products = []
            for (const item of cart) {
                const product = await getSingleProduct(item.productId)
                products.push({
                    product: product,
                    quantity: item.quantity
                })
            }
            resolve(products)
        } catch (error) {
            reject(error)
        }
    })
}