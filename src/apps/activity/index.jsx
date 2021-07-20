import { SubMenu } from "../../components"

const menuItems = [
    { title: "Dashboard", href: "/activity", icon: "bx bxs-right-arrow" , exact:true },
    { title: "Events", href: "/activity/books", icon: "bx bxs-right-arrow" },
    { title: "Clubs and Societies", href: "/activity/borrrows", icon: "bx bxs-right-arrow" },
    { title: "Games", href: "/activity/borrows-staff", icon: "bx bxs-right-arrow" },
]

function Activity() {
    return (
        <div>
            <SubMenu titleName="Activity" titleIcon="bx bx-trophy" items={menuItems} />
        </div>
    )
}

export default Activity