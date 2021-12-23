import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

export function DropdownMenu(props) {
  const { options, row } = props

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <div>
    <IconButton
      id="basic-button"
      aria-controls="basic-menu"
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}>
      <MoreVertIcon />
    </IconButton>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {(options || []).map(option =>
        <MenuItem key={option.title} onClick={(e) => { handleClose(); option.action(row) }}>
          <ListItemIcon>
            {option.icon}
          </ListItemIcon>
          <ListItemText>{option.title}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  </div >

}