// URL Endpoint dari Web Service / REST API
const api = "https://disease.sh/v3/covid-19/historical/indonesia?lastdays=30";

// Mengambil Canvas element dari document HTML.
const canvas = document.getElementById("myChart");

// Set lebar dari canvas.
canvas.width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

// Set tinggi dari canvas.
canvas.height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

// Mengambil drawing context dari canvas, dengan tipe drawing context 2d.
const ctx = canvas.getContext("2d");

class Covid {
  constructor(jsonResponse) {
    // Mengambil property keys yang terdapat pada object cases, dimana object cases sendiri
    // terdapat didalam object timeline (nested object), dan mengembalikan Array dengan element
    // berupa key-key yang terdapat pada object cases, dan Array tersebut di assign ke property date.
    this.date = Object.keys(jsonResponse.timeline.cases);

    // Mengambil values dari object dengan key country, kemudian value yang didapatkan tersebut
    // di assign kedalam property country.
    this.country = jsonResponse.country;

    // Mengambil property values yang terdapat pada object cases, dimana object cases sendiri
    // terdapat didalam object timeline (nested object), dan mengembalikan Array dengan element
    // berupa values atau nilai-nilai yang terdapat pada object cases, dan Array tersebut di assign ke property cases.
    this.cases = Object.values(jsonResponse.timeline.cases);

    // Mengambil property values yang terdapat pada object deaths, dimana object cases sendiri
    // terdapat didalam object timeline (nested object), dan mengembalikan Array dengan element
    // berupa values atau nilai-nilai yang terdapat pada object deaths, dan Array tersebut di assign ke property deaths.
    this.deaths = Object.values(jsonResponse.timeline.deaths);

    // Mengambil property values yang terdapat pada object recovered, dimana object cases sendiri
    // terdapat didalam object timeline (nested object), dan mengembalikan Array dengan element
    // berupa values atau nilai-nilai yang terdapat pada object recovered, dan Array tersebut di assign ke property recovered.
    this.recovered = Object.values(jsonResponse.timeline.recovered);
  }

  /**
   * Fetch data dari URL Endpoint.
   *
   * @returns Promise dengan resolve value berupa Covid object atau rejected value berupa
   * status dari response ketika fetch data.
   */
  static async getData() {
    // Mengambil data dari URL yang terdapat pada constant variable api menggunakan fetch function.
    // Fetch function sendiri mengembalikan Promise bertipe Response, sehingga diperlukan await keyword
    // untuk menunggu pengeksekusian Promise function fetch. Promise dari fetch tidak akan mereject Promise
    // ketika HTTP Status 404 atau 500 sekalipun. Sebagai gantinya, Promise akan tetap di resolve dengan
    // response status ok diset menjadi false.
    const response = await fetch(api);

    // Check status dari response

    // Jika property ok dari response object bernilai true
    if (response.ok) {
      // Memparsing Response Body menjadi JSON menggunakan json method.
      // Dikarenakan json method mengembalikan Promise bertipe any, sehingga diperlukan await keyword
      // untuk menunggu pengeksekusian Promise json method.
      const jsonResponse = await response.json();

      // Mengembalikan instansiasi dari class Covid dengan memberikan Response Body yang sebelumnya telah
      // di parsing sebagai argument parameter.
      return new Covid(jsonResponse);

      // Property ok bernilai false, terdapat kesalahan
      // atau error ketika memfetch data dari URL.
    } else {
      // Kembalikan rejected Promise dengan reason value
      // dari response status yang didapatkan.
      return Promise.reject(response.status);
    }
  }
}

// Mengeksekusi static method getData dari class Covid.
// Dikarenakan getData method mengembalikan sebuah Promise, resolve value
// didapatkan dari thennable Promise. Then method dari Promise menerima 1 buah
// callback yaitu nilai kembalian / resolve value dari Promise berupa covid object dari class Covid.
// didalam then method akan dijalankan sebuah operasi untuk menampilkan chart berdasarkan data yang didapat
// dari resolve atau nilai kembalian Promise.
Covid.getData().then((covid) => {
  // Instansiasi class chart dengan memberikan drawing context dari canvas dan memberikan
  // konfigurasi dan data untuk menampilkan chart / grafik dalam bentuk object.
  new Chart(ctx, {
    // Struktur dari data yang akan ditampilkan.
    data: {
      // Label atau keterangan data yang akan ditampilkan.
      // Labels didapatkan dari date property yang diakses dari object covid.
      labels: covid.date,
      // Datasets atau sekumpulan data yang akan ditampilkan
      // kedalam chart grafik batang / line graph chart.
      datasets: [
        {
          // Untuk dataset yang pertama diberikan label atau keterangan
          // data ini dengan nama Cases.
          label: "Cases",
          // Data yang akan ditampilkan kedalam grafik batang dengan label Cases.
          // Data didapatkan dari property cases yang diakses dari object covid.
          data: covid.cases,
          // Warna garis atau border dari grafik batang yang diberikan.
          borderColor: "rgba(255, 99, 132)",
          // Tidak memberikan warna didalam grafik batang.
          fill: false,
        },
        {
          // Untuk dataset yang kedua diberikan label atau keterangan
          // data ini dengan nama Deaths.
          label: "Deaths",
          // Data yang akan ditampilkan kedalam grafik batang dengan label Deaths.
          // Data didapatkan dari property deaths yang diakses dari object covid.
          data: covid.deaths,
          // Warna garis atau border dari grafik batang yang diberikan.
          borderColor: "rgba(153, 102, 255, 1)",
          // Tidak memberikan warna didalam grafik batang.
          fill: false,
        },
        {
          // Untuk dataset yang ketiga diberikan label atau keterangan
          // data ini dengan nama Recovered.
          label: "Recovered",
          // Data yang akan ditampilkan kedalam grafik batang dengan label Recovered.
          // Data didapatkan dari property recovered yang diakses dari object covid.
          data: covid.recovered,
          // Warna garis atau border dari grafik batang yang diberikan.
          borderColor: "rgba(75, 192, 192, 1)",
          // Tidak memberikan warna didalam grafik batang.
          fill: false,
        },
      ],
    },
    // Tipe grafik / graph yang akan ditampilkan
    // menggunakan tipe grafik batang / line graph.
    type: "line",
    // Opsi saat menampilkan grafik.
    options: {
      // Resize / Membuat chart size berdasarkan window size
      responsive: true,
      // Maintain / menjaga original aspect ratio dari canvas
      // ketika resizing.
      maintainAspectRatio: true,
      // Menetapkan skala untuk X-Axis dan Y-Axis dari grafik.
      scales: {
        yAxes: [
          {
            // Untuk Y-Axis label tersebut akan ditampilkan dengan menetapkan
            // display value dengan nilai true. Kemudian label yang akan ditampilkan
            // adalah Number of Cases untuk Y-Axis.
            scaleLabel: {
              display: true,
              labelString: "Number of Cases",
            },
          },
        ],
        xAxes: [
          {
            // Untuk X-Axis label tersebut akan ditampilkan dengan menetapkan
            // display value dengan nilai true. Kemudian label yang akan ditampilkan
            // adalah Date(MM/DD/YY) untuk X-Axis.
            scaleLabel: {
              display: true,
              labelString: "Date(MM/DD/YY)",
            },
          },
        ],
      },
      // Menetapkan title / judul dari grafik dengan menetapkan display value dengan
      // nilai true. Kemudian label dari judul yang akan ditampilkan adalah
      // Coronavirus Cases in Indonesia for 30 Days.
      title: {
        display: true,
        text: `Coronavirus Cases in ${covid.country} for 30 Days`,
      },
    },
  });
  // Jika Promise dari getData method di reject, maka tampilkan error ke console, dengan
  // pesan error didapatkan dari reason value dari rejected Promise.
}, console.error);
