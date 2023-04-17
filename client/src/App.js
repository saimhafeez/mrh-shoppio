import { AlertToast } from "./components";
import { useAppContext } from "./context/appContext";
import { Landing, ProtectedRoute, Register } from "./pages";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SharedLayout, Stats, Products } from "./pages/vendor/dashboard";

function App() {

  const { showAlert } = useAppContext();

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path="/landing" element={<Landing />} />

          <Route path="/" element={
            <ProtectedRoute>
              <div>Logged in</div>
            </ProtectedRoute>
          } />

          <Route path="/vendor" element={<SharedLayout />}>
            <Route index element={<Stats />} />
            <Route path='products' element={<Products />} />
          </Route>

          <Route path="/register" element={<Register />} />

        </Routes>

      </BrowserRouter>

      {showAlert && <AlertToast />}
    </>

  );
}

export default App;
