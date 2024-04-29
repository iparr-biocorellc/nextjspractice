import ProfitMonthlyChart from "@/app/ui/finances/profit-monthly-chart";
import ProfitYearlyChart from "@/app/ui/finances/profit-yearly-chart";

export default async function Page() {
    const year = 2023;
    return (
        <main>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <ProfitYearlyChart type={"accrual"}/>
                <ProfitMonthlyChart year={year} type={"accrual"}/>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <ProfitYearlyChart type={"cash"}/>
                <ProfitMonthlyChart year={year} type={"cash"}/>
            </div>
        </main>
    );
}