import Paper from "@mui/material/Paper";
import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";

function MyChart({ dataset, signals, sx: propsSx }) {
    const chartData = useMemo(() => {
        return {
            labels: dataset.map(el => el.timestamp),
            datasets: signals.map((signal, index, array) => {
                // Cool method for setting unique colors found online
                const hue = (index * 360 / array.length) % 360;
                const color = `hsl(${hue}, 70%, 50%)`;

                return {
                    label: signal,
                    data: dataset.map(el => el.streams[0].values[signal]),
                    borderColor: color,
                    backgroundColor: color
                };
            })
        };
    }, [dataset, signals]);

    return (
        <Paper elevation={3} sx={{ ...propsSx }}>
            <Line
                options={{
                    responsive: true,
                    aspectRatio: 1.6,
                    elements: {
                        point: { radius: 0 }
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
                        }
                    }
                }}
                data={chartData}
            />
        </Paper>
    );
}

export default memo(MyChart);