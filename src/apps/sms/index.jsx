import { SubMenu } from "../../components"

const menuItems = [
    { title: "Compose", href: "/sms", icon: "bx bxs-right-arrow" },
    { title: "Outbox", href: "/sms/outbox", icon: "bx bxs-right-arrow" },
    { title: "Contact groups", href: "/sms/groups", icon: "bx bxs-right-arrow" },
    { title: "Contacts", href: "/sms/contacts", icon: "bx bxs-right-arrow" },
    { title: "SMS Templates", href: "/sms/templates", icon: "bx bxs-right-arrow" },
    { title: "SMS Preferences", href: "/sms/preferences", icon: "bx bxs-right-arrow" },
]

function SMS() {
    return (
        <div>
            <SubMenu titleName="SMS" titleIcon="bx bx-chat" items={menuItems} />
        </div>
    )
}

export default SMS