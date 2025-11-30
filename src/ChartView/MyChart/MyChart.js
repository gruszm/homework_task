import Paper from "@mui/material/Paper";
import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";

function MyChart({ dataset, sx: propsSx }) {
    const chartData = useMemo(() => {
        return {
            labels: dataset.map(el => el.timestamp),
            datasets: [
                {
                    label: "CIN_Accel_Pedal_Value",
                    data: dataset.map(el => el.streams[0].values["CIN_Accel_Pedal_Value"]),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)"
                }
            ]
        };
    }, [dataset]);

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
                        },
                        decimation: {
                            enabled: true,
                            algorithm: "lttb",
                            samples: 1000
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