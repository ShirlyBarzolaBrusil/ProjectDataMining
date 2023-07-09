let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let modelo = null;
let inputSize = 150;

(async () => {
    console.log("Cargando modelo...");
    modelo = await tf.loadLayersModel("model.json");
    console.log("Modelo cargado...");
})();

imageInput.addEventListener("change", function(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.onload = function() {
            canvas.width = inputSize;
            canvas.height = inputSize;
            ctx.clearRect(0, 0, inputSize, inputSize);
            ctx.drawImage(img, 0, 0, inputSize, inputSize);
            predecir();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function predecir() {
    if (modelo != null) {
        var tensor4 = tf.browser.fromPixels(canvas).toFloat();
        tensor4 = tf.image.resizeBilinear(tensor4, [inputSize, inputSize]);
        tensor4 = tensor4.expandDims();

        var resultados = modelo.predict(tensor4).dataSync();
        var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados));

        var clases = ['Fresa', 'Naranja', 'Platano'];
        console.log("Prediccion", clases[mayorIndice]);
        document.getElementById("resultado").innerHTML = `La imagen ingresada es : ${clases[mayorIndice]}`;
    }
}