import { AlertToast } from "./components";
import { useAppContext } from "./context/appContext";
import { Landing, ProtectedRoute, Register } from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SharedLayout, Stats, Products, Orders, Profile } from "./pages/vendor/dashboard";
import { Box } from "@chakra-ui/react";
import { Checkout, Home, ProductDetail, Shop, SiteSharedLayout, WishList } from "./pages/site";
import { BiCheckbox } from "react-icons/bi";
import Vendor from "./pages/site/Vendor";

function App() {

  const { showAlert } = useAppContext();

  return (
    <Box bg={'brand_background.light'} minH={'100vh'}>
      <BrowserRouter>
        <Routes>

          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<SiteSharedLayout />}
          >
            <Route index element={<Shop />} />
            <Route path="wishlist" element={<WishList />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="vendor/:id" element={<Vendor />} />
            <Route path=":id" element={<ProductDetail />} />

          </Route>


          <Route path="/landing" element={<Landing />} />

          <Route path="/" element={
            <ProtectedRoute>
              <div>Logged in</div>
            </ProtectedRoute>
          } />

          {/* <Route path="/vendor" element={<Navigate to={'/vendor/stats'} />} /> */}

          <Route path="/vendor" element={<ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>}>
            <Route index element={<Stats />} />
            <Route path='products' element={<Products />} />
            <Route path='orders' element={<Orders />} />
            <Route path='profile' element={<Profile />} />
          </Route>

          <Route path="/register" element={<Register />} />

        </Routes>

      </BrowserRouter>

      {showAlert && <AlertToast />}
    </Box >

  );
}

export default App;
