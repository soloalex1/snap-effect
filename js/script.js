$().ready(() => {

	let dataArray = [];
	let canvasCount = 30;

	$("#btn-snap").click(() => {
		alert("snap!");
		html2canvas($("#content")[0]).then(canvas => {
			let canvasContext = canvas.getContext("2d");
			let imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
			let pixelArray = imageData.data;
		});
	});
});