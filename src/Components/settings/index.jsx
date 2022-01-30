import { PageBody, SubMenu } from "../customs"

const menuItems = [
  { title: "School Profile", href: "/settings", icon: "bx bxs-right-arrow", exact: true },
  { title: "Users", href: "/settings/users", icon: "bx bxs-right-arrow" },
  { title: "User groups", href: "/settings/user-groups", icon: "bx bxs-right-arrow" },
  { title: "SMS Account", href: "/settings/sms", icon: "bx bxs-right-arrow" },
  { title: "Billing", href: "/settings/billing", icon: "bx bxs-right-arrow" },
]

function Settings() {
  return (
    <div>
      <SubMenu titleName="Settings" titleIcon="bx bx-cog" items={menuItems} />
      <PageBody children={"hello settings"} />
    </div>
  )
}

export default Settings