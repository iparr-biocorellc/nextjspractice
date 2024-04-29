import { generateYAxisMonth } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchProfitAccrualMonthly, fetchProfitCashMonthly } from '@/app/lib/data';

export default async function ProfitMonthlyChart({year, type}: {year: number, type: string}) {
    let profit;
    if (type === "accrual") {
        profit = await fetchProfitAccrualMonthly(year);
    } else {
        profit = await fetchProfitCashMonthly(year);
    }

    const chartHeight = 350;

    // Generate labels for the y-axis
    const { yAxisLabels, topLabel } = generateYAxisMonth(profit);

    if (!profit || profit.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
    }

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Monthly Profit/Loss {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
                    <div
                        className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
                        style={{ height: `${chartHeight}px` }}
                    >
                        {yAxisLabels.map((label) => (
                            <p key={label}>{label}</p>
                        ))}
                    </div>

                    {profit.map((month) => (
                        <div key={month.month} className="flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-md"
                                style={{
                                    height: `${Math.abs((chartHeight / topLabel) * month.dollar)}px`,
                                    backgroundColor: month.dollar >= 0 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(255, 99, 132, 0.7)' // Conditional coloring
                                }}
                                title={`$${month.dollar.toLocaleString()}`} // Tooltip shows formatted dollar amount
                            ></div>
                            <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                                {month.month}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500">2023</h3>
                </div>
            </div>
        </div>
    );
}
