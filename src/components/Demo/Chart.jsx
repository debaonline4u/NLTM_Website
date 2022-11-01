import React, { useEffect } from "react";

let chart;

function Chart(props) {
    async function drawChart() {
        const ctx = document.getElementById("chart-holder").getContext("2d");

        chart = new window.Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.values(props.data.lab2lang), // to get the list of keys from the data
                datasets: [
                    {
                        label: "",
                        data: [10, 20, 10, 20, 40, 60, 90, 10, 20, 20, 30, 5],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Prediction Probability of each Language",
                        },
                        beginAtZero: true,
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Languages",
                        },
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    return (
        <div
            style={{
                width: "100%",
            }}
        >
            <canvas
                id="chart-holder"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
            ></canvas>

            {/* To run the chart when the data is available */}
            {props.data &&
                "" &&
                setTimeout(() => {
                    console.log("first");
                    drawChart();
                }, 1000)}
        </div>
    );
}

export default Chart;
