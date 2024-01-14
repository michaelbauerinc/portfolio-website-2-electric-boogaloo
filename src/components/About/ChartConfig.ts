export const bigFiveData = {
  labels: [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
  ],
  datasets: [
    {
      label: "Score",
      data: [94, 90, 95, 85, 65],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      pointBackgroundColor: "rgba(54, 162, 235, 1)",
    },
  ],
};

export const options = {
  scales: {
    r: {
      angleLines: { display: true },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { display: false },
      pointLabels: { display: true },
    },
  },
  plugins: {
    legend: { display: false },
  },
};
