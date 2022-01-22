import { PageBody, SubMenu } from "../../components"

const menuItems = [
  { title: "Dashboard", href: "/library", icon: "bx bxs-right-arrow", exact: true },
  { title: "Books", href: "/library/books", icon: "bx bxs-right-arrow" },
  { title: "Issue/Return", href: "/library/issue", icon: "bx bxs-right-arrow" },
  { title: "Users", href: "/library/borrows-staff", icon: "bx bxs-right-arrow" },
  { title: "Authors", href: "/library/authors", icon: "bx bxs-right-arrow" },
]

function Library() {

  return (
    <div>
      <SubMenu titleName="Library" titleIcon="bx bx-book-open" items={menuItems} />
      <PageBody>
      </PageBody>
    </div>
  )
}

export default Library