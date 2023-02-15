console.log("hello world")

fetch('http://www.omdbapi.com/?apikey=1cb42be6&t=Breaking+Bad&Season=2&Episode=5')
   .then(response => response.text())
   .then(text => console.log(text))