import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { memo, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import { CustomScales, pickAxisForArray } from "./CustomScales";

function SignalChart({ dataset, signals, sx: propsSx }) {
    const chartRef = useRef(null);
    const minTimestamp = dataset[0].timestamp;
    const maxTimestamp = dataset[dataset.length - 1].timestamp;

    const handleResetClick = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    const chartData = useMemo(() => {
        return {
            datasets: signals.map((signal, index, array) => {
                // Cool method for setting unique colors found online
                const hue = (index * 360 / array.length) % 360;
                const color = `hsl(${hue}, 70%, 50%)`;
                const signalData = dataset.map(el => ({
                    x: el.timestamp,
                    y: el.streams[0].values[signal]
                }));
                const axis = pickAxisForArray(signalData.map(data => data.y));

                return {
                    label: signal,
                    data: signalData,
                    yAxisID: axis,
                    borderColor: color,
                    backgroundColor: color,
                    pointHoverBorderWidth: 1,
                    pointHoverBorderColor: "black"
                };
            })
        };
    }, [dataset, signals]);

    return (
        <Paper elevation={3} sx={{
            ...propsSx,
            display: "flex",
            flexDirection: "column"
        }}>
            <Line
                ref={chartRef}
                options={{
                    responsive: true,
                    interaction: {
                        mode: "index",
                        intersect: false
                    },
                    aspectRatio: 1.6,
                    elements: {
                        point: { radius: 1 },
                        line: { tension: 0.3 }
                    },
                    plugins: {
                        legend: { position: "top" },
                        title: {
                            display: true,
                            text: "Vehicle data",
                            font: { size: 24 }
                        },
                        tooltip: {
                            position: "nearest",
                            callbacks: {
                                title: (context) => `Timestamp: ${context[0].parsed.x.toFixed(3)} s`,
                                label: (context) => {
                                    // Set 3 decimal points and then trim the zeros
                                    return `${context.dataset.label}: ${parseFloat(context.parsed.y.toFixed(3))}`;
                                }
                            }
                        },
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true,
                                    speed: 0.075
                                },
                                drag: {
                                    enabled: true,
                                    modifierKey: "ctrl",
                                    borderWidth: 1
                                },
                                pinch: { enabled: true }
                            },
                            pan: {
                                enabled: true,
                                mode: "xy"
                            },
                            limits: {
                                x: { min: minTimestamp - 2, max: maxTimestamp + 2 }, // Add some room on the left and right
                                gridScale: { min: -10, max: 10 },
                                ySmall: { min: -10, max: 10 },
                                yMedium: { min: -100, max: 100 },
                                yLarge: { min: -1000, max: 1000 }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: "linear",
                            min: minTimestamp,
                            max: maxTimestamp,
                            title: {
                                display: true,
                                text: "Timestamp [s]",
                                font: {
                                    size: 16,
                                    weight: "bold"
                                }
                            },
                            ticks: { stepSize: 1 }
                        },
                        ...CustomScales
                    }
                }}
                data={chartData}
            />

            <Stack direction="row" sx={{
                justifyContent: "space-between",
                alignItems: "flex-end"
            }}>
                <Stack direction="column">
                    <Typography variant="caption" color="text.secondary">Tips:</Typography>
                    <Typography variant="caption" color="text.secondary">Hold Ctrl to drag</Typography>
                    <Typography variant="caption" color="text.secondary">Scroll or pinch to zoom</Typography>
                </Stack>
                <Button variant="contained" onClick={handleResetClick} size="large">Reset</Button>
            </Stack>
        </Paper>
    );
}

export default memo(SignalChart);