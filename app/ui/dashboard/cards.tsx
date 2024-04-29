import {
    CurrencyDollarIcon,
    ScaleIcon,
    ReceiptPercentIcon,
    HashtagIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  revenue: CurrencyDollarIcon,
  profit: ScaleIcon,
    sales: HashtagIcon,
    expenses: ReceiptPercentIcon
};

export default async function CardWrapper() {
  const {
    revenue,
    profit,
    sales,
    expenses,
  } = await fetchCardData();
  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <Card title="YTD Revenue" value={revenue} type="revenue" />
      <Card title="YTD Profit/Loss" value={profit} type="profit" />
      <Card title="YTD Sales" value={sales} type="sales" />
      <Card title="YTD Expenses" value={expenses} type="expenses"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'revenue' | 'profit' | 'sales' | 'expenses';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
