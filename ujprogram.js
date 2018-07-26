var elemek = [],
    ticking = false;
function mobilmenu(){
    document.getElementById("menuPontok").classList.toggle("mobilmenuclick");
}
function menuikonvaltas(){
    document.getElementById("menugomb").classList.toggle("menuikonvaltas");
}
function mobilmenuhitel(){
    document.getElementById("hiteltipusmenu").classList.toggle("hiteltipusclick");
}
function menuhitelvaltas(){
    document.getElementById("hitel-gomb").classList.toggle("menuhitelvaltas");
}
function hivo(elem, x) {
    if (x === undefined) {
        x = elemek.length;
    }
    elemek[x] = new function () {
        if (elem.length === undefined) {
            elem = [elem];
        }
        this.el = elem;
        this.eT = [];
        this.eM = [];
        this.eB = [];
        this.eC = [];
        (function (th) {
            for (var i = 0, len = th.el.length; i < len; i++) {
                var el = th.el[i];
                if (getComputedStyle(el).position === "static") {
                    el.style.position = "relative";
                }
                if (getComputedStyle(el).position === "fixed" || el.offsetParent === null) {
                    th.eT[i] = el.offsetTop;
                } else {
                    var elC = el;
                    th.eT[i] = 0;
                    do {
                        th.eT[i] += elC.offsetTop;
                        elC = elC.offsetParent;
                    }
                    while (elC !== document.body);
                }
                th.eM[i] = el.offsetHeight;
                th.eB[i] = th.eT[i] + th.eM[i];
                th.eC[i] = th.eT[i] + (th.eM[i] / 2);
            }
        })(this);
    }
}


var sect = document.querySelectorAll("section"),
    menuk = document.querySelectorAll("#menuPontok>li>a"),
    kezdohatter = document.querySelector(".kezdohatter"),
    tipusokHatter = document.querySelector("img.hatter"),
    tipusok = document.querySelector("section.hiteltipusok"),
    cons = document.querySelectorAll("div.cons>p");


window.onload = function () {
    var tipusoktarolomag = document.querySelector("div.bg-wr").offsetHeight;
    tipusok.style.height = tipusoktarolomag + "px";
    if (tipusoktarolomag > window.innerHeight) {
        tipusokHatter.style.top = 0;
    } else {
        tipusokHatter.style.bottom = 0;
    }
    hivo(sect);
    for (var i = 0, len = elemek[0].el.length; i < len; i++) {
        var el = elemek[0].el[i],
            eM = elemek[0].eM[i];
        if (el.parentNode.className !== "tarolo") {
            var tarolo = document.createElement("div");
            tarolo.className = "tarolo";
            el.parentNode.appendChild(tarolo);
            tarolo.appendChild(el);
            tarolo.style.height = eM + "px";
            tarolo.style.zIndex = i;
            tarolo.style.backgroundColor = "white";
        }
    }
};
window.onresize = function () {
    var tarolo = document.querySelectorAll(".tarolo");
    tarolo.forEach((tar, i) => tar.style.height = sect[i].offsetHeight + "px")
}
window.onscroll = function () {
    var wT = window.pageYOffset,
        wM = window.innerHeight,
        wB = wT + wM,
        wC = wT + (wM / 2);
    if (!ticking) {
        requestAnimationFrame(sectionok);
        ticking = true;
    }

    function sectionok(){
        var x = 0;
        for (var i = 1, len = elemek[x].el.length; i < len; i++) {
            var e = elemek[x].el[i],
                eT = elemek[x].eT[i],
                eM = elemek[x].eM[i],
                eB = elemek[x].eB[i],
                eC = elemek[x].eC[i],
                elemCentValt = -Math.abs((wC - eC) / ((eM + wM) / 2)) + 1;

            //kezdohatter parralax
            if (elemek[0].eB[0] > wT) {
                kezdohatter.style.transform = "translateY(" + wT / 2 + "px)";
                kezdohatter.style.willChange = "transform";
            }

            //menük színváltása scrollpostól függően
            if (i > 0) {
                if (eT < wB && eB > wT) {
                    menuk[i - 1].style.color = "rgba(" + (Math.round(elemCentValt * 8) + 247) + ", " + (Math.round(elemCentValt * 108) + 147) + ", " + (Math.round(elemCentValt * 225) + 30) + ", 1)";
                    menuk[i - 1].style.background =
                        "linear-gradient(to bottom,rgba(247,147,30," + elemCentValt.toFixed(2) + ") 85%, transparent)";
                } else {
                    menuk[i - 1].style.color = "orange";
                    menuk[i - 1].style.background = "none";
                }
            }

            //hajlítás effektus
            var hajl, hajlx, tar = document.querySelectorAll("div.tarolo")[i];
            if (eM > wM) {
                hajl = (eT - wT) / wM;
            } else {
                hajl = (eB - wB) / eM;
            }
            if (hajl <= 0) {
                hajl = 0;
            }
            if (hajl >= 1) {
                hajl = 1;
            }
            hajlx = Math.pow(hajl, 2);
            cons[i].innerHTML = hajl
            if (hajl < 1 && hajl > 0) {
                e.style.willChange = "transform";
                e.style.transform = "rotateX(" + hajlx * 90 + "deg)";
                tar.style.perspective = "100vh";
                tar.style.perspectiveOrigin = "50% 0%";
                tar.style.overflow = "hidden";

            } else {
                e.style.willChange = "auto";
                e.style.transform = "none";
                tar.style.perspective = "none";
            }
            e.style.transformOrigin = "top";
            e.style.opacity = 1 - hajl;

        }
        ticking = false;
    }
};