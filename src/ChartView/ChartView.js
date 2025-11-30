import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Container from "@mui/material/Container";
import { Checkbox, Divider, IconButton, InputBase, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Box from "@mui/material/Box";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend,
    Title,
    Tooltip,
    Decimation
} from "chart.js";
import MyChart from "./MyChart/MyChart";

import rawDataset from "../data.json";
const DATASET = rawDataset;

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Decimation, Legend, Tooltip, Title)

const SignalItem = memo(({ signal, handleToggle, checkedItemsArray }) => (
    <ListItem>
        <ListItemButton role={undefined} onClick={() => handleToggle(signal)}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checkedItemsArray.includes(signal)}
                    tabIndex={-1}
                    disableRipple
                />
            </ListItemIcon>
            <ListItemText id={signal} primary={signal} title={signal} sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }} />
        </ListItemButton>
    </ListItem>
));

export default function ChartView(props) {
    const [signals, setSignals] = useState([]);
    const [checkedSignals, setCheckedSignals] = useState([]);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 150);

    const filteredSignals = useMemo(() => {
        return signals.filter(s => s.toLowerCase().includes(debouncedSearchText.toLowerCase()));
    }, [signals, debouncedSearchText]);

    useEffect(() => {
        setSignals(Object.keys(DATASET[0].streams[0].values));
    }, [])

    const handleToggle = useCallback((value) => {
        const currentIndex = checkedSignals.indexOf(value);
        const newChecked = [...checkedSignals];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedSignals(newChecked);
    }, [checkedSignals]);

    return (
        <Container maxWidth="xl" disableGutters
            sx={{
                pt: 8,
                display: "flex",
                justifyContent: "space-between"
            }}>
            <Paper elevation={3}
                sx={{
                    width: 400,
                    height: 600
                }}>
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%"
                    }}
                    subheader={
                        <ListSubheader>
                            Available signals
                        </ListSubheader>
                    }>
                    <Paper elevation={3} sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        mx: 2,
                        mt: 1
                    }}>
                        <SearchIcon sx={{ mr: 1 }} />
                        <InputBase sx={{ flex: 1 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <IconButton edge="end" onClick={() => setSearchText("")}>
                            <ClearIcon />
                        </IconButton>
                    </Paper>
                    <Divider sx={{ mt: 2 }} />
                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}>
                        {filteredSignals.map(signal => (
                            <SignalItem key={signal} signal={signal} handleToggle={handleToggle} checkedItemsArray={checkedSignals} />
                        ))}
                    </Box>
                </List>
            </Paper>

            <MyChart dataset={DATASET} sx={{
                width: "70%",
                height: "fit-content",
                px: 1,
                pb: 2
            }} />
        </Container>
    );
}