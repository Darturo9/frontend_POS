import { formatCurrency } from "@/src/utils"

type AmountProps = {
    label: string
    amount: number
    discount?: boolean
}

export default function Amount({ label, amount, discount }: AmountProps) {
    return (
        <div className={`flex justify-between p-1 ${discount ? 'bg-green-400 text-green-900' : ''}`}>
            <dt className="font-bold">{label}</dt>
            <dd className="text-gray-900">
                {discount ? '-' : ''}{formatCurrency(amount)}
            </dd>
        </div>
    )
}