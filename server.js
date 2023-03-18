const https = require('https');
const express = require('express');
const Papa = require('papaparse');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/export', function(req, res) {
	const baseId = 'YOUR_BASE_ID'; // replace with your own base ID
	const tableName = 'YOUR_TABLE_NAME'; // replace with your own table name
	const apiKey = 'key8uxv4B4ahMA6xw'; // replace with your own API key
	const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?api_key=${apiKey}`;

	https.get(url, function(response) {
		if (response.statusCode !== 200) {
			return res.status(500).send('Failed to fetch Airtable data');
		}

		var data = '';
		response.on('data', function(chunk) {
			data += chunk;
		});

		response.on('end', function() {
			const records = JSON.parse(data).records;
			const csv = Papa.unparse(records.map(function(record) {
				return record.fields;
			}));
			const filename = 'export.csv';
			res.setHeader('Content-Type', 'text/csv');
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.send(csv);
		});

	}).on('error', function(error) {
		console.error(error);
		res.status(500).send('Failed to fetch Airtable data');
	});
});

const port = 3000;
app.listen(port, function() {
	console.log(`Server listening on port http://localhost:${port}`);
});
