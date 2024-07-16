const defaultOpt = {
    quality: 1,
    width: 800,
    height: 800,
    background: '#fff',
    transparent: '#fff'
}
const imgs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const speedEle = document.querySelector('#speed');
const resultEle = document.querySelector('#result');
const startEle = document.querySelector('#start');
const resetEle = document.querySelector('#reset');
const downloadEle = document.querySelector('#download');
const uploadEle = document.querySelector('#upload');
const widthEle = document.querySelector('#width');
const heightEle = document.querySelector('#height');
const items = Array.from(document.querySelectorAll('.item')).map(item => item.querySelector('img'));

resetEle.addEventListener('click', () => {
    items.forEach((img, idx) => {
        img.src = `${imgs[idx]}.svg`
    })
})

uploadEle.addEventListener('change', () => {
    const files = uploadEle.files;
    if (files.length > 9) {
        alert('最多只能上传9个图片');
        uploadEle.value = ''; // 清空文件选择
        return;
    }

    const clickitem = Number(uploadEle.getAttribute('data-clickitem'));
    if (files.length === 1) {
        items[clickitem].setAttribute('src', URL.createObjectURL(files[0]));
        return;
    }

    Array.from(files).forEach((file, idx) => {
        items[idx + clickitem].setAttribute('src', URL.createObjectURL(file))
    })

})

items.forEach((ele, idx) => {
    ele.addEventListener('click', () => {
        uploadEle.setAttribute('data-clickitem', idx)
        uploadEle.click()
    })
})
function createGif(options) {
    const opt = {
        ...defaultOpt,
        ...options
    }
    const gif = new GIF({
        ...opt,
        workers: items.length,
    });
    const delay = Number(speedEle.value) * 100
    items.forEach(item => {
        gif.addFrame(item, { delay });
    })

    gif.on('finished', finishCreate);

    gif.render();
}

function startCreate() {
    resultEle.src = 'loading.svg';
    resultEle.classList.add('loading')
}

function finishCreate(blob) {
    resultEle.classList.remove('loading')
    resultEle.src = URL.createObjectURL(blob)
}

function getOpt() {
    const width = widthEle.value;
    const height = heightEle.value;
    const opt = {};

    if (width && width !== 800) {
        opt.width = width;
    }

    if (height && height !== 800) {
        opt.height = height;
    }

    return opt;
}


startEle.addEventListener('click', () => {
    startCreate()
    createGif(getOpt())
})


downloadEle.addEventListener('click', () => {
    const url = document.querySelector('#result').src;
    if (!url) {
        return alert('Create Gif First')
    }
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'gif.gif')
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
})




speedEle.addEventListener('input', () => {
    speedEle.setAttribute('data-speed', speedEle.value);
})