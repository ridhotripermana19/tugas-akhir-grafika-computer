const api = "https://disease.sh/v3/covid-19/historical/indonesia?lastdays=30";

var ctx = document.getElementById("myChart").getContext("2d");

class Covid {
  constructor(jsonResponse) {
    this.country = Object.values(jsonResponse.country);
    this.date = Object.keys(jsonResponse.timeline.cases);
    this.cases = Object.values(jsonResponse.timeline.cases);
    this.deaths = Object.values(jsonResponse.timeline.deaths);
    this.recovered = Object.values(jsonResponse.timeline.recovered);
  }

  static async getData() {
    const response = await fetch(api);
    if (response.ok) {
      const jsonResponse = await response.json();
      return new Covid(jsonResponse);
    } else {
      return Promise.reject(response.status);
    }
  }
}

Covid.getData().then((covid) => {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: covid.date,
      datasets: [
        {
          label: "Cases",
          data: covid.cases,
          borderColor: "rgba(255, 99, 132)",
          fill: false,
        },
        {
          label: "Deaths",
          data: covid.deaths,
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
        {
          label: "Recovered",
          data: covid.recovered,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Number of Cases",
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Date(MM/DD/YY)",
            },
          },
        ],
      },
      title: {
        display: true,
        text: `Coronavirus Cases in Indonesia for 30 Days`,
      },
    },
  });
}, console.error);
