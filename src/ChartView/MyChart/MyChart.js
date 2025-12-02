import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { memo, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";

const LIGHTER_GREEN = "#02ab1cff";

const myScales = {
    // Dummy scale, created to add some padding and not color the grid red
    gridScale: {
        min: -1,
        max: 10,
        display: true,
        type: "linear",
        axis: "y",
        ticks: { // Disable the ticks, but keep the padding
            display: true,
            padding: 10,
            callback: function () {
                return "";
            }
        },
        grid: {
            drawTicks: false
        },
        border: {
            display: false
        }
    },
    ySmall: {
        min: -1,
        max: 10,
        display: "auto",
        type: "linear",
        title: {
            display: false,
            // text: "0-10",
            font: {
                size: 16,
                weight: "bold"
            }
        },
        grid: {
            drawOnChartArea: false,
            color: "red"
        },
        ticks: {
            color: "red",
            padding: 6
        },
        border: {
            color: "red",
            dashOffset: 5
        }
    },
    yMedium: {
        min: -10,
        max: 100,
        display: "auto",
        type: "linear",
        title: {
            display: false,
            // text: "0-100",
            font: {
                size: 16,
                weight: "bold"
            }
        },
        // position: "right",
        grid: {
            drawOnChartArea: false,
            color: LIGHTER_GREEN,
        },
        ticks: {
            color: LIGHTER_GREEN,
            padding: 6
        },
        border: {
            color: LIGHTER_GREEN
        }
    },
    yLarge: {
        min: -100,
        max: 1000,
        display: "auto",
        type: "linear",
        title: {
            display: false,
            // text: "0-1000",
            font: {
                size: 16,
                weight: "bold"
            }
        },
        // position: "right",
        grid: {
            drawOnChartArea: false,
            color: "blue",
        },
        ticks: {
            color: "blue",
            padding: 6
        },
        border: {
            color: "blue"
        }
    },
}

function pickAxis(signalData) {
    const signalMin = Math.min(...signalData);
    const signalMax = Math.max(...signalData);

    if (signalMin >= -10 && signalMax <= 10) {
        return "ySmall";
    } else if (signalMin >= -100 && signalMax <= 100) {
        return "yMedium";
    } else {
        return "yLarge";
    }
}

function MyChart({ dataset, signals, sx: propsSx }) {
    const chartRef = useRef(null);

    const handleResetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    const chartData = useMemo(() => {
        return {
            labels: dataset.map(el => el.timestamp),
            datasets: signals.map((signal, index, array) => {
                // Cool method for setting unique colors found online
                const hue = (index * 360 / array.length) % 360;
                const color = `hsl(${hue}, 70%, 50%)`;
                const signalData = dataset.map(el => el.streams[0].values[signal]);
                const axis = pickAxis(signalData);

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
                        legend: {
                            position: "top"
                        },
                        title: {
                            display: true,
                            text: "Vehicle data",
                            font: {
                                size: 24
                            }
                        },
                        tooltip: {
                            position: "nearest",
                            callbacks: {
                                title: function (context) {
                                    return `Timestamp: ${Number(context[0].label).toFixed(3)} s`;
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
                                pinch: {
                                    enabled: true
                                }
                            },
                            pan: {
                                enabled: true,
                                mode: "xy"
                            },
                            limits: {
                                gridScale: { min: -10, max: 10 },
                                ySmall: { min: -10, max: 10 },
                                yMedium: { min: -100, max: 100 },
                                yLarge: { min: -1000, max: 1000 }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Timestamp [s]",
                                font: {
                                    size: 16,
                                    weight: "bold"
                                }
                            },
                            ticks: {
                                callback: function (value, index, ticks) {
                                    const label = this.getLabelForValue(value);

                                    return Number(label).toFixed(3);
                                }
                            }
                        },
                        ...myScales
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
                <Button variant="contained" onClick={handleResetZoom} size="large">Reset</Button>
            </Stack>
        </Paper>
    );
}

export default memo(MyChart);