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

			for (let i = 0; i < pixelArray.length; i++) {
				let pixel = Math.floor((i / pixelArray.length) * canvasCount);
				let arr = dataArray[weightedRandomDistrib(pixel)];
				arr[i] = pixelArray[i];
				arr[i + 1] = pixelArray[i + 1];
				arr[i + 2] = pixelArray[i + 2];
				arr[i + 3] = pixelArray[i + 3];

			}

			for (let i = 0; i < canvasCount; i++) {
				let c = newCanvasFromImageData(dataArray[i], canvas.width, canvas.height);
				c.classList.add("dust");
				$("body").append(c);
			}
			// limpa todos os filhos, exceto o canvas
			$(".content").children().not(".dust").fadeOut(3500);

			$(".dust").each(index => {
				animateBlur($(this), 0.8, 800);
				setTimeout(() => {
					animateTransform($(this), 100, -100, chance.integer({ min: -15, max: 15 }), 800 + (110 * index));
				}, (70 * index));

				$(this).delay(70 * index).fadeOut((110 * index) + 800, "easeInQuint", () => {
					$(this).remove();
				});
			});
		});
	});

	// cria a imagem como um array de pixels vazios usando um scanline básico
	const createBlankData = imgData => {
		for (let i = 0; i < canvasCount; i++) {
			let arr = new Uint8ClampedArray(imgData.data);
			for (let j = 0; j < arr.length; j++) {
				arr[j] = 0;
			}
			dataArray.push(arr);
		}
	}

	// função que cria um novo canvas a partir dos dados de uma imagem passada
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
		pra dar o efeito de um fadeout top-bottom, não dá pra simplesmente usar um
		random, entao preciso utilizar uma distribuição ponderada pra sumir
		gradualmente com os pixels da imagem, aumentando a probabilidade da maioria dos
		pixels do topo da imagem de estar no primeiro grupo de canvas criados.
	*/


	// funcao de distribuição ponderada
	const weightedRandomDistrib = peak => {
		let prob = [],
			seq = [];
		for (let i = 0; i < canvasCount; i++) {
			prob.push(Math.pow(canvasCount - Math.abs(peak - i), 3));
			seq.push(i);
		}
		return chance.weighted(seq, prob);
	}

	// função que faz a animação de ease-out com blur das fumacinhas
	const animateBlur = (el, radius, time) => {
		let r = 0;
		$({ rad: 0 }).animate({ rad: radius }, {
			duration: time,
			easing: "easeOutQuad",
			step: now => {
				el.css({ filter: `blur(${now}px)` });
			}
		});
	}

	// função que aplica um transform nos canvas e rotaciona/move eles pra dar o efeito da poeira voando
	const animateTransform = (el, sx, sy, ang, time) => {
		let td, tx, ty = 0;

		$({	x: 0, y: 0,	deg: 0 }).animate({ x: sx, y: sy, deg: ang }, {
			duration: time,
			easing: "easeInQuad",
			step: (now, fx) => {
				switch (fx.prop) {
					case 'x':
						tx = now;
						break;
					case 'y':
						ty = now;
						break;
					case 'deg':
						td = now;
						break;
				}

				el.css({ transform: `rotate(${td}deg); translate(${tx}px, ${ty}px)` });
			}
		});
	}
});
