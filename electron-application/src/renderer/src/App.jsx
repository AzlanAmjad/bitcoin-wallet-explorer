
import { HashRouter, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Block from './pages/Block';
import Wallet from './pages/Wallet';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="block/:blockHash" element={<Block />} />
          <Route path="wallet/:address" element={<Wallet />} />
          <Route path="*" element={<div>Error loading page</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
