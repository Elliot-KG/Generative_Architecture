
const MARGIN = 10;
const LINE_HEIGHT = 500;
const WINDOW_OFFSET = 38;
const REFRESH_TIME = 2000; //in ms
const MIN_X = 20;
const MIN_Y = 20;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Element {
    constructor(x, y, size, ImgSrc, context, onLoadCallback) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.img = new Image();
        this.img.src = ImgSrc;
        this.context = context;
        let self = this
        this.img.onload = function () {
            self.nativeSize = {
                width: this.width,
                height: this.height
            }
            onLoadCallback();
        };
    }

    render() {
        this.context.drawImage(this.img, this.x, this.y, this.size.width, this.size.height);
    }
}

class Column {
    constructor(x, y, size, context, onLoadCallback) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.totalImages = 5;
        this.context = context;
        this.imagesLoaded = 0;
        this.onLoadCallback = onLoadCallback;

        this.columnTop = new Image();
        this.columnTop.onload = this.imageLoaded.bind(this);
        this.columnTop.src = "img/columnTop.png";

        this.column = new Image();
        this.column.onload = this.imageLoaded.bind(this);
        this.column.src = "img/column.png";

        this.columnMid = new Image();
        this.columnMid.onload = this.imageLoaded.bind(this);
        this.columnMid.src = "img/columnMid.png";

        this.columnII = new Image();
        this.columnII.onload = this.imageLoaded.bind(this);
        this.columnII.src = "img/column_II.png";

        this.columnBottom = new Image();
        this.columnBottom.onload = this.imageLoaded.bind(this);
        this.columnBottom.src = "img/columnBottom.png";

    }

    imageLoaded() {
        this.imagesLoaded += 1;
        if (this.imagesLoaded >= this.totalImages) {
            this.onLoadCallback();
        }
    }

    imageHeight(img) {
        //w : h = w : x
        return (img.height * this.size.width) / img.width;
    }

    render() {
        let columnTopHeight = this.imageHeight(this.columnTop);
        let columnHeight = this.imageHeight(this.column);
        let columnMidHeight = this.imageHeight(this.columnMid);
        let columnIIHeight = this.imageHeight(this.columnII);
        let columnBottomHeight = this.imageHeight(this.columnBottom);
        let y = this.y;

        this.context.drawImage(this.columnTop, this.x, y, this.size.width, columnTopHeight);
        y += columnTopHeight;
        this.context.drawImage(this.column, this.x, y, this.size.width, columnHeight);
        y += columnHeight;
        this.context.drawImage(this.columnMid, this.x, y, this.size.width, columnMidHeight);
        y += columnMidHeight;
        this.context.drawImage(this.columnII, this.x, y, this.size.width, columnIIHeight);
        y += columnIIHeight;
        this.context.drawImage(this.columnBottom, this.x, y, this.size.width, columnBottomHeight);
    }
}

window.onload = generate;

function generate() {
    let loadedImages = 0;
    let doneAdding = false; //Changed when finished adding elements

    //2713 : 3269
    let windowSize = {
        width: 271.3,
        height: 326.9
    }

    let columnSize = {
        width: 100,
        height: 1000 //random for now 
    }

    let x = MIN_X;
    let y = MIN_Y;
    let widestX = 0;
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    let elements = [];

    for (let i = 0; i < 5; i += 1) {
        if (getRandomInt(0, 1) === 0) {
            let yHeight = (y + WINDOW_OFFSET);
            let window = new Element(x, yHeight, windowSize, "img/window.png", context, finishedLoading);
            elements.push(window);
            x += windowSize.width + MARGIN;
        } else {
            let column = new Column(x, y, columnSize, context, finishedLoading);
            elements.push(column);
            x += columnSize.width + MARGIN;
        }

        if (x > widestX) { //Keep track of the widest point for the background
            widestX = x;
        }

        //Greater than canvas
        if (x + windowSize.width > 1000) {
            break;
        }
    }

    function generateBox() {
        let lineSize = {
            width: 10,
            height: (y + 500)
        }

        let lineSize_h = {
            width: widestX,
            height: 10
        }

        let backgroundSize = {
            width: widestX,
            height: (y + 500)
        }

        let box = [];

        let background = new Element(MIN_X, MIN_Y, backgroundSize, "img/background.png", context, finishedLoading);
        box.push(background);

        let topLine = new Element(MIN_X, MIN_Y, lineSize_h, "img/lineI_h.png", context, finishedLoading);
        box.push(topLine);

        let leftLine = new Element(MIN_X, MIN_Y, lineSize, "img/lineI.png", context, finishedLoading);
        box.push(leftLine);

        let rightLine = new Element(widestX, MIN_Y, lineSize, "img/lineII.png", context, finishedLoading);
        box.push(rightLine);

        let bottomLine = new Element(MIN_X, (y + 500), lineSize_h, "img/lineII_h.png", context, finishedLoading);
        box.push(bottomLine);

        return box;
    }


    elements = generateBox().concat(elements);//Add to beginning of array so it is rendered first


    doneAdding = true;
    isFinished(); //Call just in case all of the images are loaded



    function finishedLoading() {
        loadedImages += 1;
        isFinished();
    }

    function isFinished() {
        if (loadedImages >= elements.length && doneAdding) {
            window.requestAnimationFrame(renderAll);
        }
    }

    function renderAll(timelapse) {
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach(function (element) {
            element.render();
        });
        setTimeout(function () {
            generate();
        }, REFRESH_TIME);
    }
}