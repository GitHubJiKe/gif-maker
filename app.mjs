const defaultOpt = {
    quality: 1,
    width: 800,
    height: 800,
    background: "#fff",
    transparent: "#fff",
};
const container = document.querySelector(".grid");
const sortable = new Sortable(container, {
    animation: 150,
    ghostClass: "sortable-ghost",
});
const speedEle = document.querySelector("#speed");
const resultEle = document.querySelector("#result");
const startEle = document.querySelector("#start");
const clearEle = document.querySelector("#clear");
const downloadEle = document.querySelector("#download");
const uploadEle = document.querySelector("#upload");
const items = Array.from(document.querySelectorAll(".item"))
    .map((item) => item.querySelector("img"))
    .filter((item) => !!item.src);

clearEle.addEventListener("click", () => {
    items.forEach((img, idx) => {
        img.src = `upload-svgrepo-com.svg`;
        img.classList.replace("img", "img-small");
    });
});

function setImg(file, imgEle) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target.result;
        const img = new Image();

        img.onload = function () {
            imgEle.src = img.src;
            imgEle.classList.replace("img-small", "img");
        };

        img.src = imageUrl;
    };
    reader.readAsDataURL(file);
}

uploadEle.addEventListener("change", () => {
    const files = uploadEle.files;
    if (files.length > 9) {
        alert("最多只能上传9个图片");
        uploadEle.value = ""; // 清空文件选择
        return;
    }

    const clickitem = Number(uploadEle.getAttribute("data-clickitem"));
    if (files.length === 1) {
        setImg(files[0], items[clickitem]);
        return;
    }

    Array.from(files).forEach((file, idx) => {
        setImg(file, items[idx + clickitem]);
    });
});

items.forEach((ele, idx) => {
    ele.addEventListener("click", () => {
        uploadEle.setAttribute("data-clickitem", idx);
        uploadEle.click();
    });
});
function createGif(options) {
    const opt = {
        ...defaultOpt,
        ...options,
    };
    const gif = new GIF({
        ...opt,
        workers: items.length,
    });
    const delay = Number(speedEle.value) * 100;

    items.forEach((item) => {
        if (item.classList.contains("img")) {
            console.log(item.src);
            gif.addFrame(item, { delay });
        }
    });

    gif.on("finished", finishCreate);

    gif.render();
}

function startCreate() {
    resultEle.src = "loading.svg";
    resultEle.classList.add("loading");
}

function finishCreate(blob) {
    resultEle.classList.remove("loading");
    resultEle.src = URL.createObjectURL(blob);
}

function getOpt(img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    console.log(width, height);
    const opt = {};

    if (width && width !== 800) {
        opt.width = width;
    }

    if (height && height !== 800) {
        opt.height = height;
    }

    return opt;
}

startEle.addEventListener("click", () => {
    startCreate();

    createGif(getOpt(items[0]));
});

downloadEle.addEventListener("click", () => {
    const url = document.querySelector("#result").src;
    if (!url) {
        return alert("Create Gif First");
    }
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "gif.gif");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
});

speedEle.addEventListener("input", () => {
    speedEle.setAttribute("data-speed", speedEle.value);
});
