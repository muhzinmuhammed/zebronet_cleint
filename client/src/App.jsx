import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SupplierPage from './Pages/SupplierPage';
import { store } from './store/store';
import ItemPage from './Pages/ItemPage';
import OrderPage from './Pages/OrderPage';
function App() {
  

  return (
    <>
    <Provider store={store}>
      <Router>
<Routes>
<Route path="/" element={<SupplierPage />} />
<Route path="/items" element={<ItemPage />} />
<Route path="/order" element={<OrderPage />} />
</Routes>
</Router>
</Provider>
    </>
  )
}

export default App
