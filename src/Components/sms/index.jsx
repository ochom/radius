import { PageBody, SubMenu } from "../customs"
import { PageConstruction } from "../customs/empty-page";

const menuItems = [
  { title: "Compose", href: "/sms", icon: "bx bx-plus-medical", exact: true },
  { title: "Outbox", href: "/sms/outbox", icon: "bx bxs-archive-out" },
  { title: "Contact groups", href: "/sms/groups", icon: "bx bxs-group" },
  { title: "Contacts", href: "/sms/contacts", icon: "bx bxs-contact" },
  { title: "SMS Templates", href: "/sms/templates", icon: "bx bxs-file" },
  { title: "SMS Preferences", href: "/sms/preferences", icon: "bx bxs-cog" },
]

const SMS = () => {
  return (
    <>
      <SubMenu titleName="SMS" titleIcon="bx bx-chat" items={menuItems} />
      <PageBody>
        <PageConstruction feature='SMS' />
      </PageBody>
    </>
  );
};

export default SMS;
