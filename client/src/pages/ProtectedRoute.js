import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

    if (true) {
        return <Navigate to={'/landing'} />
    }
    return children
}

export default ProtectedRoute