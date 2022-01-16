import Avatar, { genConfig } from 'react-nice-avatar'
import { Avatar as CustomAvatar } from '@mui/material'
import { API_ROOT } from '../API/config'


export const UserAvatar = (props) => {
  const { sex, src, alt } = props
  let avatarConfig = genConfig({
    shirtStyle: "polo",
    hatStyle: "none",
    bgColor: "linear-gradient(45deg, #1729ff 0%, #ff56f7 100%)"
  })

  if (src) {
    return <CustomAvatar className="user-thumbnail" src={`${API_ROOT}/${src}`} alt={alt} />
  }

  return <Avatar {...avatarConfig} className="user-thumbnail" sex={sex === "male" ? "man" : "woman"} hairStyle={sex === "male" ? "thick" : "womanLong"} />
}
