import { PageBody, SubMenu } from "../customs"
import { PageConstruction } from "../customs/empty-page"

const menuItems = [
  { title: "Health", href: "/welfare/health", icon: "bx bxs-right-arrow" },
  { title: "G & C", href: "/welfare/guidance", icon: "bx bxs-right-arrow" },
]

export default function Welfare() {
  return (
    <>
      <SubMenu titleName="Welfare" titleIcon="bx bx-trophy" items={menuItems} />
      <PageBody>
        <PageConstruction feature='Welfare' />
      </PageBody>
    </>
  )
}