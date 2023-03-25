let json = {
    'movie-id':'',
    'series-id': '',
    'comment':'I LOVE JAVASCRIPT',
    'user-id':'1',
}

fetch('http://localhost:9004/query', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json),
})
.then(response => response.text())
.then(text => console.log(JSON.parse(text)))
.catch(error => console.log(error));