const express = require('express');
const Papa = require('papaparse');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/export', function(req, res) {
	const url = req.query.url;
	if (!url) {
		return res.status(400).send('URL is required');
	}

	Papa.parse(url, {
		download: true,
		complete: function(results) {
			const csv = Papa.unparse(results.data);
			res.attachment('export.csv');
			res.send(csv);
		},
		error: function(error) {
			console.error(error);
			res.status(500).send('Failed to export CSV');
		}
	});
});

const port = 3000;
app.listen(port, function() {
	console.log(`Server listening on port ${port}`);
});
