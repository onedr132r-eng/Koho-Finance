import { useParams } from "wouter";
import { Link } from "wouter";
import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import NotificationSettings from "@/pages/feature-notification-settings";
import DisplayIcon from "@/pages/feature-display-icon";
import LoadMethods from "@/pages/feature-load-methods";
import Autodeposit from "@/pages/feature-autodeposit";
import LegalDocs from "@/pages/feature-legal-docs";
import TaxReceipts from "@/pages/feature-tax-receipts";
import Support from "@/pages/feature-support";
import Security from "@/pages/feature-security";
import Biometrics from "@/pages/feature-biometrics";
import Merchants from "@/pages/feature-merchants";
import PayLater from "@/pages/feature-pay-later";
import CreditReport from "@/pages/feature-credit-report";
import ESim from "@/pages/feature-esim";
import { TenantInsurance, TravelInsurance } from "@/pages/feature-insurance";
import SendInternational from "@/pages/feature-send-international";
import Rewards from "@/pages/feature-rewards";
import Referrals from "@/pages/feature-referrals";
import UpgradePlan from "@/pages/feature-upgrade-plan";
import {
  VirtualCardInfo, InteracETransfer, DisputedTransactions,
  StatusPage, FeatureRequests, JointAccount, CreditUtilization,
  PayeeNumber, LimitsUnverified, LimitsRegular, LimitsPaid,
  DebitCardDeposit, CashDeposit,
} from "@/pages/feature-misc";

const FEATURE_COMPONENTS: Record<string, React.ComponentType> = {
  "notification-settings": NotificationSettings,
  "display-icon": DisplayIcon,
  "load-methods": LoadMethods,
  "autodeposit": Autodeposit,
  "legal-docs": LegalDocs,
  "tax-receipts": TaxReceipts,
  "support": Support,
  "security": Security,
  "biometrics": Biometrics,
  "merchants": Merchants,
  "pay-later": PayLater,
  "credit-report": CreditReport,
  "esim": ESim,
  "tenant-insurance": TenantInsurance,
  "travel-insurance": TravelInsurance,
  "send-international": SendInternational,
  "rewards": Rewards,
  "referrals": Referrals,
  "upgrade-plan": UpgradePlan,
  "virtual-card-info": VirtualCardInfo,
  "interac-etransfer": InteracETransfer,
  "disputed-transactions": DisputedTransactions,
  "status": StatusPage,
  "feature-requests": FeatureRequests,
  "joint-account": JointAccount,
  "credit-utilization": CreditUtilization,
  "payee-number": PayeeNumber,
  "limits-unverified": LimitsUnverified,
  "limits-regular": LimitsRegular,
  "limits-paid": LimitsPaid,
  "debit-card": DebitCardDeposit,
  "cash-deposit": CashDeposit,
};

export default function FeaturePage() {
  const { slug } = useParams();

  if (slug && FEATURE_COMPONENTS[slug]) {
    const Component = FEATURE_COMPONENTS[slug];
    return <Component />;
  }

  const title = slug
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "Feature";

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title={title} />
      <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h1>
        <p className="text-gray-500 max-w-[280px] mx-auto leading-relaxed">
          We are working hard to bring you the {title} feature. Stay tuned for updates!
        </p>
        <Link href="/" className="mt-8 inline-block px-6 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          Go back
        </Link>
      </div>
    </div>
  );
}
