import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";
import { PhoneFrame } from "@/components/layout/phone-frame";
import { SplashScreen } from "@/components/layout/splash-screen";
import Home from "@/pages/home";
import Transactions from "@/pages/transactions";
import TransactionDetail from "@/pages/transaction-detail";
import Credit from "@/pages/credit";
import Plan from "@/pages/plan";
import Discover from "@/pages/discover";
import AddMoney from "@/pages/add-money";
import DirectDeposit from "@/pages/direct-deposit";
import MoveMoney from "@/pages/move-money";
import Profile from "@/pages/profile";
import AccountSettings from "@/pages/account-settings";
import MyBalances from "@/pages/my-balances";
import MonthlyStatements from "@/pages/monthly-statements";
import CoverPage from "@/pages/cover";
import CashbackPage from "@/pages/cashback";
import CryptoPage from "@/pages/crypto";
import SaveInterest from "@/pages/save-interest";
import VaultPage from "@/pages/vault";
import RoundUpsPage from "@/pages/roundups";
import GoalsPage from "@/pages/goals";
import Cards from "@/pages/cards";
import Notifications from "@/pages/notifications";
import SendMoney from "@/pages/send-money";
import RequestMoney from "@/pages/request-money";
import PayBill from "@/pages/pay-bill";
import CreditBuilding from "@/pages/credit-building";
import SecuredCredit from "@/pages/secured-credit";
import RentReporting from "@/pages/rent-reporting";
import BillSplit from "@/pages/bill-split";
import CardLibrary from "@/pages/card-library";
import FeaturePage from "@/pages/feature-page";
import PaymentMethods from "@/pages/payment-methods";
import PersonalDetails from "@/pages/personal-details";
import AccountLimits from "@/pages/account-limits";
import VoidCheque from "@/pages/void-cheque";
import Statement from "@/pages/statement";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import GoalDetail from "@/pages/goal-detail";
import Insights from "@/pages/insights";

const AUTH_KEY = "koho_authed";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30_000,
      staleTime: 10_000,
    },
  },
});

function AuthedRouter({ onLogout }: { onLogout: () => void }) {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/transactions/:id" component={TransactionDetail} />
        <Route path="/credit" component={Credit} />
        <Route path="/plan" component={Plan} />
        <Route path="/discover" component={Discover} />
        <Route path="/add-money" component={AddMoney} />
        <Route path="/direct-deposit" component={DirectDeposit} />
        <Route path="/move-money" component={MoveMoney} />
        <Route path="/profile" component={Profile} />
        <Route path="/account-settings" component={AccountSettings} />
        <Route path="/my-balances" component={MyBalances} />
        <Route path="/monthly-statements" component={MonthlyStatements} />
        <Route path="/cover" component={CoverPage} />
        <Route path="/cashback" component={CashbackPage} />
        <Route path="/crypto" component={CryptoPage} />
        <Route path="/save-interest" component={SaveInterest} />
        <Route path="/vault" component={VaultPage} />
        <Route path="/roundups" component={RoundUpsPage} />
        <Route path="/goals" component={GoalsPage} />
        <Route path="/goals/:id" component={GoalDetail} />
        <Route path="/cards" component={Cards} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/send-money" component={SendMoney} />
        <Route path="/request-money" component={RequestMoney} />
        <Route path="/pay-bill" component={PayBill} />
        <Route path="/credit-building" component={CreditBuilding} />
        <Route path="/secured-credit" component={SecuredCredit} />
        <Route path="/rent-reporting" component={RentReporting} />
        <Route path="/bill-split" component={BillSplit} />
        <Route path="/card-library" component={CardLibrary} />
        <Route path="/payment-methods" component={PaymentMethods} />
        <Route path="/personal-details" component={PersonalDetails} />
        <Route path="/account-limits" component={AccountLimits} />
        <Route path="/void-cheque" component={VoidCheque} />
        <Route path="/statement/:month" component={Statement} />
        <Route path="/insights" component={Insights} />
        <Route path="/feature/:slug" component={FeaturePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function GuestRouter({ onLogin }: { onLogin: () => void }) {
  return (
    <Switch>
      <Route path="/onboarding">
        <Onboarding onLogin={onLogin} />
      </Route>
      <Route>
        <Login onLogin={onLogin} />
      </Route>
    </Switch>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [authed, setAuthed] = useState<boolean>(() => {
    try { return localStorage.getItem(AUTH_KEY) === "1"; } catch { return false; }
  });

  const login = () => {
    try { localStorage.setItem(AUTH_KEY, "1"); } catch {}
    setAuthed(true);
  };

  const logout = () => {
    try { localStorage.removeItem(AUTH_KEY); } catch {}
    setAuthed(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <PhoneFrame>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            {authed
              ? <AuthedRouter onLogout={logout} />
              : <GuestRouter onLogin={login} />
            }
          </WouterRouter>
        </PhoneFrame>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
