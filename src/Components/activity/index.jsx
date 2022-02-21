import { PageBody, SubMenu } from "../customs"
import { PageConstruction } from "../customs/empty-page"

const menuItems = [
  { title: "Dashboard", href: "/activity", icon: "bx bxs-right-arrow", exact: true },
  { title: "Events", href: "/activity/books", icon: "bx bxs-right-arrow" },
  { title: "Clubs and Societies", href: "/activity/borrrows", icon: "bx bxs-right-arrow" },
  { title: "Games", href: "/activity/borrows-teacher", icon: "bx bxs-right-arrow" },
]

export default function Activity() {
  return (
    <>
      <SubMenu titleName="Activity" titleIcon="bx bx-trophy" items={menuItems} />
      <PageBody>
        <PageConstruction feature='Activities' />
      </PageBody>
    </>
  )
}