var ping = require('net-ping'); //electron magic

var currentUrl = '';
var session = ping.createSession({
	retries: 0,
	timeout: 1500
});
var maxPing = 50;
var pinger;
$('#pingButton').click(function (evt) {
	if(!pinger) {
		currentUrl = $('#pingAddr').val();
		$('#addrTitle').text('Pinging: '+currentUrl);
		pinger = setInterval(pingTicker, $('#pingInt').val() * 1000);
		$(this).html('Stop Pings');
		//plotting stuff
		var trace = {
			x: [],
			type: 'histogram',
			xbins: {
				start: -1,
				end: 50,
				size: 5
			}
		};
		var data = [trace];
		var layout = {
			title: 'Histogram',
  			xaxis: {
    			tick0: 0,
    			tickcolor: '#000',
				range: [-1, 50]
  			},
			yaxis: {
				tick0: 0,
				dtick: 1
			}
		}
		Plotly.newPlot('histogram', data, layout);
		trace = {
			type: 'scatter',
			y: [],
			mode: 'lines+markers', 
  			marker: {color: 'pink', size: 8},
  			line: {width: 4}
		};
		data = [trace];
		Plotly.newPlot('scatter', data);
	}
	else {
		$(this).html('Start Pings');
		$('#addrTitle').text('No Address Set');
		clearInterval(pinger);
	}
	$(this).toggleClass('red lighten-1');
});
function pingTicker () {
	session.pingHost(currentUrl, function(err, target, sent, rcvd) {
		var lag = rcvd - sent;
		if(err) {
			console.log(err);
		}
		else {
			if(lag > maxPing) {
				maxPing = lag;
				Plotly.relayout('histogram', {'xaxis.range': [-1, maxPing]});
				Plotly.restyle('histogram', {xbins: {
					start: -1,
					end: maxPing,
					size: 1
				}});
			}
			Plotly.extendTraces('histogram', {x: [[lag]]}, [0]);
			Plotly.extendTraces('scatter', {y: [[lag]]}, [0]);
		}
	});
}