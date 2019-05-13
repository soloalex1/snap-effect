$().ready(() => {

	let dataArray = [];
	let canvasCount = 30;

	$("#btn-snap").click(() => {
		alert("WHAT'D YOU DO?");
		html2canvas($("#content")[0]).then(canvas => {
			let canvasContext = canvas.getContext("2d");
			let imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
			let pixelArray = imageData.data;

			createBlankData(imageData);

			for(let i = 0; i < pixelArray.length; i++){
				let pixel = Math.floor((i / pixelArray.length) * canvasCount);
				let arr = dataArray[weightedRandomDistrib(pixel)];
				arr[i] = pixelArray[i];
				arr[i + 1] = pixelArray[i + 1];
				arr[i + 2] = pixelArray[i + 2];
				arr[i + 3] = pixelArray[i + 3];

			}

			for(let i = 0; i < canvasCount; i++){
				let c = newCanvasFromImageData(dataArray[i], canvas.width, canvas.height);
				c.classList.add("dust");
				$("body").append(c);
			}
			// limpa todos os filhos, exceto o canvas
			$(".content").children().not(".dust").fadeOut(3500);

			// TODO aplicar animacoes
		});
	});


	const createBlankData = imgData => {
		for(let i = 0; i < canvasCount; i++){
			let arr = new Uint8ClampedArray(imgData.data);
			for (let j = 0; j < arr.length; j++) {
				arr[j] = 0;
			}
			dataArray.push(arr);
		}
	}

	// funçao que cria um novo canvas a partir dos dados de uma imagem passada
	const newCanvasFromImageData = (imgDataArray, width, height) => {
		let canvas = document.createElement('canvas');

		// setando altura e largura
		canvas.width = width;
		canvas.height = height;

		// usando o context do canvas pra inserir o elemento
		tempContext = canvas.getContext("2d");
		tempContext.putImageData(new ImageData(imgDataArray, width, height), 0, 0);

		return canvas;

	}

	/* 
		pra dar o efeito de um fadeout top-bottom, nao da pra simplesmente usar um
		random, entao preciso utilizar uma distribuicao ponderada pra sumir
		gradualmente com os pixels da imagem, aumentando a probabilidade da maioria dos
		pixels do topo da imagem de estar no primeiro grupo de canvas criados.
	*/


	// funcao de distribuicao ponderada
	const weightedRandomDistrib = peak => {
		let prob = [], seq = [];
		for(let i = 0; i < canvasCount; i++) {
		  prob.push(Math.pow(canvasCount - Math.abs(peak - i), 3));
		  seq.push(i);
		}
		return chance.weighted(seq, prob);
	  }


	  // TODO implementar funcoes de animacao (que o jQuery deveria ter nativamente)

	  const animateBlur = (el, radius, time) => {

	  }

	  const animateTransform = (el, sx, sy, ang, time) => {

	  }

});