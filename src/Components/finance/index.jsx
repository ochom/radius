import { PageBody, SubMenu } from "../customs"
import { PageConstruction } from "../customs/empty-page"

const menuItems = [
    { title: "Fee payment", href: "/finance", icon: "bx bxs-right-arrow", exact: true },
    { title: "Invoices", href: "/finance/invoices", icon: "bx bxs-right-arrow" },
    { title: "Fee Structure", href: "/finance/fee-structure", icon: "bx bxs-right-arrow" },
    { title: "Fee Balance", href: "/finance/fee-balances", icon: "bx bxs-right-arrow" },
    { title: "Expense", href: "/finance/expenses", icon: "bx bxs-right-arrow" },
    { title: "Income", href: "/finance/income", icon: "bx bxs-right-arrow" },
]

export default function Finance() {
    return (
        <>
            <SubMenu titleName="Finance" titleIcon="bx bxs-graduation" items={menuItems} />
            <PageBody>
                <PageConstruction feature='Finance' />
            </PageBody>
        </>
    )
}