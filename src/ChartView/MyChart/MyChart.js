import Paper from "@mui/material/Paper";
import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";

const LIGHTER_GREEN = "#02ab1cff";

const myScales = {
    // Dummy scale, created to add some padding and not color the grid red
    gridScale: {
        min: 0,
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
        min: 0,
        max: 10,
        display: "auto",
        type: "linear",
        title: {
            display: true,
            text: "0-10",
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
            color: "red"
        },
        border: {
            color: "red",
            dashOffset: 5
        }
    },
    yMedium: {
        min: 10,
        max: 100,
        display: "auto",
        type: "linear",
        title: {
            display: true,
            text: "10-100",
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
            color: LIGHTER_GREEN
        },
        border: {
            color: LIGHTER_GREEN
        }
    },
    yLarge: {
        min: 100,
        max: 1000,
        display: "auto",
        type: "linear",
        title: {
            display: true,
            text: "100-1000",
            font: {
                size: 16,
                weight: "bold"
            }
        },
        // position: "right",
        grid: {
            drawOnChartArea: false
        }
    }
}

function pickAxis(signalData) {
    const signalMax = Math.max(...signalData);

    if (signalMax <= 10) {
        return "ySmall";
    } else if (signalMax <= 100) {
        return "yMedium";
    } else {
        return "yLarge";
    }
}

function MyChart({ dataset, signals, sx: propsSx }) {
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
        <Paper elevation={3} sx={{ ...propsSx }}>
            <Line
                options={{
                    responsive: true,
                    interaction: {
                        mode: 'index',
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
                            position: 'nearest',
                            callbacks: {
                                title: function (context) {
                                    return `Timestamp: ${Number(context[0].label).toFixed(3)} s`;
                                }
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
        </Paper>
    );
}

export default memo(MyChart);