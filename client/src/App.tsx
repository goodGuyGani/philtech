import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/dashboard-layout";
import DashboardMain from "./pages/dashboard/dashboard-main";
import AtmMain from "./pages/atm-report/atm-report-main";
import WifiMain from "./pages/wifi-voucher/wifi-main";
import TelevisionMain from "./pages/tv-voucher/tv-main";
import GsatMain from "./pages/gsat-voucher/gsat-main";
import GenealogyTree from "./pages/geneleogy/geneology-test";
import BuyingTest from "./pages/buying-test";
import UserDashboardLayout from "./pages/user-dashboard/user-dashboard-layout";
import UserDashboardMain from "./pages/user-dashboard/user-dashboard-main";
import SubscriptionPageMain from "./pages/user-dashboard/subscription-page/subscription-page-main";
import SellVoucher from "./pages/user-dashboard/sell-voucher/sell-voucher";
import SoldVoucher from "./pages/user-dashboard/sold-voucher/sold-voucher-main";
import UserGeneleogyTree from "./pages/user-dashboard/user-geneleogy/user-geneleogy";
import Store from "./pages/user-dashboard/user-store/user-store";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<h1>Hello</h1>} /> */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<DashboardMain />} />
          <Route path="/dashboard/atm-report" element={<AtmMain />} />
          <Route path="/dashboard/wifi-voucher" element={<WifiMain />} />
          <Route path="/dashboard/tv-voucher" element={<TelevisionMain />} />
          <Route path="/dashboard/gsat-voucher" element={<GsatMain />} />
          <Route path="/dashboard/genealogy-tree" element={<GenealogyTree />} />
          <Route path="/dashboard/buying-test" element={<BuyingTest />} />
        </Route>
        <Route
          path="/user-dashboard/:userId" element={<UserDashboardLayout />}>
          <Route path="/user-dashboard/:userId" element={<UserDashboardMain />} />
          <Route path="/user-dashboard/:userId/subscription-packages" element={<SubscriptionPageMain />} />
          <Route path="/user-dashboard/:userId/sell-voucher" element={<SellVoucher />} />
          <Route path="/user-dashboard/:userId/sold-voucher" element={<SoldVoucher />} />
          <Route path="/user-dashboard/:userId/user-geneleogy" element={<UserGeneleogyTree />} />
          <Route path="/user-dashboard/:userId/store" element={<Store />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
