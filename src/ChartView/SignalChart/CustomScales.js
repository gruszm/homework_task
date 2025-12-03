const LIGHTER_GREEN = "#02ab1cff";

export const CustomScales = {
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
            callback: () => ""
        },
        grid: { drawTicks: false },
        border: { display: false }
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
        border: { color: "red" }
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
        border: { color: LIGHTER_GREEN }
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
        border: { color: "blue" }
    },
}

export function pickAxisForArray(array) {
    const arrayMin = Math.min(...array);
    const arrayMax = Math.max(...array);

    if (arrayMin >= -10 && arrayMax <= 10) {
        return "ySmall";
    } else if (arrayMin >= -100 && arrayMax <= 100) {
        return "yMedium";
    } else {
        return "yLarge";
    }
}