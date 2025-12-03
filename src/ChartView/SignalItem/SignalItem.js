import { memo } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

function SignalItem({ signal, onClick: handleClick, checkedItemsArray }) {
    return (
        <ListItem>
            <ListItemButton onClick={handleClick(signal)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={checkedItemsArray.includes(signal)}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={signal} title={signal}
                    sx={{ overflow: "hidden" }}
                    slotProps={{
                        primary: {
                            fontSize: { xs: "0.8rem", lg: "0.9rem", xl: "1rem" }
                        }
                    }} />
            </ListItemButton>
        </ListItem>
    );
}

export default memo(SignalItem);