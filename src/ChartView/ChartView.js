import { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import { Checkbox, Divider, IconButton, InputBase, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { faker } from "@faker-js/faker";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * 
 * @param {Number} number The number of desired random signal names
 * @returns The object containing the id of a signal and its name
 *          or a list of such objects, when {@link number} is defined
 */
function createRandomSignal(number) {
    const prefix = "CAN.";
    const newManufacturerName = () => faker.vehicle.manufacturer().replace(/\s/g, ""); // Remove whitespaces

    if (number) {
        const signalNames = [];

        for (let i = 0; i < number; i++) {
            const signalName = `${prefix}${newManufacturerName()}`;

            signalNames.push({ id: i, name: signalName });
        }

        return signalNames;
    }
    else {
        const signalName = `${prefix}${newManufacturerName()}`;

        return { id: 0, name: signalName };
    }
}

// Taken from stackoverflow
const shuffleArray = (array) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export default function ChartView(props) {
    const [signals, setSignals] = useState([]);
    const [checked, setChecked] = useState([]);
    const [searchText, setSearchText] = useState("");

    const filteredSignals = useMemo(() => {
        return signals.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()));
    }, [signals, searchText]);

    useEffect(() => {
        const generatedSignals = createRandomSignal(5);

        shuffleArray(generatedSignals);
        setSignals(generatedSignals);
    }, [])

    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <Container sx={{
            pt: 8
        }}>
            <Paper elevation={3}
                sx={{
                    width: 400,
                    height: 600,
                    overflow: "auto"
                }}>
                <List
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
                    {filteredSignals.map(signal => (
                        <ListItem key={signal.id}>
                            <ListItemButton role={undefined} onClick={() => handleToggle(signal.id)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.includes(signal.id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText id={signal.name} primary={signal.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}