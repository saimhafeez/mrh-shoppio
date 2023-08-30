import { AlertToast, Sidebar } from "./components";
import { useAppContext } from "./context/appContext";
import { Landing, ProtectedRoute, Register } from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SharedLayout, Stats, Products, Orders, Profile } from "./pages/vendor/dashboard";
import { Box } from "@chakra-ui/react";
import { Checkout, Home, MyAccount, ProductDetail, Shop, SiteSharedLayout, WishList } from "./pages/site";
import Vendor from "./pages/site/Vendor";
import { TrackOrder } from "./components/site";


function App() {

  const { showAlert } = useAppContext();

  return (
    <Box bg={'brand_background.light'} minH={'100vh'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<SiteSharedLayout />}
          >
            <Route index element={<Shop />} />
            <Route path="wishlist" element={<WishList />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="vendor/:id" element={<Vendor />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path="myorders" element={<MyAccount />} />
          </Route>
          <Route path="/vendor" element={<ProtectedRoute>
            <SharedLayout
              Sidebar={<Sidebar />} />
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
