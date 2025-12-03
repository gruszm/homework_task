import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Container from "@mui/material/Container";
import { Divider, IconButton, InputBase, ListSubheader, Paper } from "@mui/material";
import List from "@mui/material/List";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SignalItem from "./SignalItem/SignalItem";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend,
    Title,
    Tooltip
} from "chart.js";
import SignalChart from "./SignalChart/SignalChart";
import zoomPlugin from "chartjs-plugin-zoom";

import rawDataset from "../data.json";
const DATASET = rawDataset;

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title, zoomPlugin);

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

    const handleTextChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleTextClearClick = () => {
        setSearchText("");
    };

    const handleDeselectAllClick = () => {
        setCheckedSignals([]);
    }

    const handleSignalItemClick = useCallback((value) => () => {
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
        <Container maxWidth={false} disableGutters
            sx={{
                pt: 6,
                px: 4,
                display: "flex",
                justifyContent: "space-around"
            }}>
            <Paper elevation={3}
                sx={{
                    width: { xs: 200, lg: 300, xl: 400 },
                    height: { xs: 500, lg: 600, xl: 700 }
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
                        <InputBase sx={{ flex: 1 }} value={searchText} onChange={handleTextChange} />
                        <IconButton edge="end" onClick={handleTextClearClick}>
                            <ClearIcon />
                        </IconButton>
                    </Paper>
                    <Button variant="contained" sx={{ alignSelf: "flex-start", mt: 2, ml: 2 }} onClick={handleDeselectAllClick}>Deselect All</Button>
                    <Divider sx={{ mt: 2 }} />
                    <Box sx={{
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}>
                        {filteredSignals.map(signal => (
                            <SignalItem key={signal} signal={signal} onClick={handleSignalItemClick} checkedItemsArray={checkedSignals} />
                        ))}
                    </Box>
                </List>
            </Paper>

            <SignalChart dataset={DATASET} signals={checkedSignals} sx={{
                width: "70%",
                height: "auto",
                px: 1,
                pb: 2
            }} />
        </Container>
    );
}