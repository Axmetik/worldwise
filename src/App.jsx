import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Suspense, lazy } from "react";

import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./components/City/CityList";
import CountryList from "./components/Country/CountryList";
import City from "./components/City/City";
import Form from "./components/Form/Form";
import SpinnerFullPage from "./components/Spinner/SpinnerFullPage";

const HomePage = lazy(() =>
  import("./pages/HomePage/Homepage")
);
const Product = lazy(() =>
  import("./pages/Product/Product")
);
const Pricing = lazy(() => import("./pages/Pricing"));
const PageNotFound = lazy(() =>
  import("./pages/PageNotFound")
);
const AppLayout = lazy(() =>
  import("./pages/AppLayout/AppLayout")
);
const Login = lazy(() => import("./pages/Login/Login"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route
                index
                path="/"
                element={<HomePage />}
              />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<Navigate replace to="cities" />}
                />
                <Route
                  path="cities/:id"
                  element={<City />}
                />
                <Route
                  path="cities"
                  element={<CityList />}
                />
                <Route
                  path="countries"
                  element={<CountryList />}
                />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
