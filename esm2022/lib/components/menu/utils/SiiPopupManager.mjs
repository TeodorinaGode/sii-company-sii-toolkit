// Il gestore delle popup. Le popup create saranno modali
export const PopupManager = window.PopupManager = {
    popupStack: null,
    // Crea una nuova popup e la pone in cima allo stack
    // L'eventuale popup precedentemente attiva viene freezata
    //
    //  urlContenuto l'url da aprire nella finestra
    //  callerReturnFunction vedi sotto
    //  innerWidth   la larghezza utile della finestra
    //  innerHeight  l'altezza utile della finestra
    //  reloadOnClose indica che la popup causa il reload della sottostante qualora venga chiusa
    // callerReturnFunction e' una opzionale funzione javascript della popup
    // chiamante che riceve l'eventuale oggetto che la popup chiamata invia alla chiusura
    // tramite una chiamata tipo parent.PopupManager.getLastPopup().returnToCaller(valore)
    // oppure tramite parent.PopupManager.closeLastPopup() nel qualcaso non viene restituito
    // nulla
    addPopupSdac(url, newPage) {
        if (newPage) {
            const win = window.open(url, '_blank', `target=_blank,width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0`);
            var pollTimer = window.setInterval(function () {
                if (win?.closed !== false) { // !== is required for compatibility with Opera
                    window.clearInterval(pollTimer);
                    document.getElementById('btnReload')?.click();
                }
            }, 1000);
        }
        else {
            const w = 950;
            const h = 525;
            this.addPopup(url, () => { document.getElementById('btnReload')?.click(); }, w, h);
        }
    },
    addPopup(urlContenuto, callerReturnFunction, innerWidth, innerHeight, reloadOnClose) {
        if (!reloadOnClose || reloadOnClose === null) {
            reloadOnClose = false;
        }
        if (this.popupStack == null) {
            this.popupStack = new Array();
        }
        if (this.popupStack.length > 0) {
            this.popupStack[this.popupStack.length - 1].freeze();
        }
        const popup = new Popup(this.popupStack.length);
        popup.setInnerHeight(innerHeight);
        popup.setInnerWidth(innerWidth);
        popup.setSpostabile(true);
        // Forzo l'esclusione dalla cache.Serve per un bug di ie (clem)
        if (urlContenuto.indexOf('?') === -1) {
            urlContenuto += '?';
        }
        else {
            urlContenuto += '&';
        }
        urlContenuto += 'iernd=' + Math.random();
        popup.setContenuto(urlContenuto);
        popup.show();
        popup.setReloadOnClose(reloadOnClose);
        popup.setCallerReturnFunction(callerReturnFunction);
        this.popupStack.push(popup);
    },
    getLastPopup() {
        if (this.popupStack == null || this.popupStack.length === 0) {
            return null;
        }
        return this.popupStack[(this.popupStack).length - 1];
    },
    // Chiude l'ultima popup in cima allo stasck e 'scongela' l'eventuale penultima
    // La chiusura dell'ultima popup causa la chiusura della finestra.
    // oggetto e' un eventiale valore da restiotuire alla popup scongelata nel caso
    // che l'utente creandola abbia specificato l'opzione callerReturnFunction
    // reload           se true opera il reload prenotato dal chiamante, qualora sia stato specificato
    //                 per default e' true
    //                 se false non fa in nessun caso il reload
    closeLastPopup(oggetto, reload) {
        if (reload !== false) {
            reload = true;
        }
        /*if (this.popupStack == null || this.popupStack.length <= 1) {
          // alert(this.popupStack);
          setTimeout( function (){
          if (reload) {
          // Reload per sdac
            // PopupManager.reloadOpener();
          }
          // window.opener='x';//Workaround per evitare messaggio di chiusura
            try{window.close();} catch(e) {}
          },100);
        return;
        }*/
        const popup = this.popupStack.pop();
        const reloadOnClose = popup.getReloadOnClose();
        const callerReturnFunction = popup.callerReturnFunction;
        let lastPopup = null;
        if (this.popupStack.length > 0) {
            lastPopup = this.popupStack[(this.popupStack).length - 1];
        }
        setTimeout(() => {
            if (callerReturnFunction && callerReturnFunction != null && callerReturnFunction !== '') {
                if (reload) {
                    callerReturnFunction(oggetto);
                }
            }
            popup.chiudi();
            // Se la popup deve essere ricaricata l'unfreeze viene posticipato all'onload della finestra
            if (reload && lastPopup && lastPopup !== null) {
                if (!reloadOnClose) {
                    lastPopup.unfreeze();
                }
                else {
                    // le ultime due condizioni sono state aggiunte per consentire che la
                    // callerReturnFunction non venga annullata dal submit del form
                    if (lastPopup.contenutoFinestra && !reload && !(callerReturnFunction === null)) {
                        if (isIE()) {
                            lastPopup.contenutoFinestra.contentWindow.window.document.forms[0].submit();
                        }
                        else {
                            lastPopup.contenutoFinestra.contentDocument.forms[0].submit();
                        }
                    }
                }
            }
            else if (!reload) {
                lastPopup.unfreeze();
            }
        }, 100);
    },
    // Interessante, restituisce l'html attualmente renderizzato della finestra:
    // obj.document.documentElement.innerHTML
    // Sfrutto la proprieta' che la popup e' la proprieta' popup di un DIV che contiene l'iframe
    // della stessa
    getEclosingPopup(obj) {
        // forse non serve cercarlo in this.PopupManager
        let enclosing = this.getLastPopup != null ? this.getLastPopup() : this.PopupManager.getLastPopup();
        let tmp = obj;
        while (tmp && tmp != null) {
            if (tmp.body) {
                const doc = tmp;
                const frm = window.frames;
                for (let i = frm.length - 1; i >= 0; i--) {
                    const iframe = frm[i];
                    if (iframe.document === doc) {
                        // Ho trovato il frame che contiene l'obj
                        enclosing = iframe.frameElement.popup;
                        break;
                    }
                }
                break;
            }
            tmp = tmp.parentNode;
        }
        return enclosing;
    },
    reloadOpener(obj) {
        // se sono mio padre (!) evto di ricaricarmi
        if (window && window.opener && window.self && window.opener === window.self) {
            return;
        }
        if (window && window.parent && window.parent.opener && window.parent.opener.frames && window.parent.opener.frames.length > 0) {
            try {
                window.parent.opener.frames[0].location.href = window.parent.opener.frames[0].location.href;
            }
            catch (e) { }
        }
        if (window && window.parent && window.parent.opener) {
            try {
                window.parent.opener.location.href = window.parent.opener.location.href;
            }
            catch (e) { }
        }
        if (window && window.opener) {
            try {
                window.opener.location.href = window.opener.location.href;
            }
            catch (e) { }
        }
    }
};
// Il class attribute della popup : modalWindow
// Il costruttore della popup
//  zIndex lo zIndex della finestra
//
//  popupDiv           il div esterno
//  bordoFinestra
//  contenutoFinestra  l'iframe con il contenuto
function Popup(id) {
    const zIndex = 1000 + (id + 1) * 2 + 5;
    this.spostabile = false;
    this.altezzaTitoloPopup = 25;
    this.freezed = false;
    /***if (window.parent) this.popupDiv =window.parent.document.createElement('div');
    else*/ this.popupDiv = window.document.createElement('div');
    this.popupDiv.style.position = 'fixed';
    this.popupDiv.style.left = 0 + 'px';
    this.popupDiv.style.top = 0 + 'px';
    this.popupDiv.style.width = 0 + 'px';
    this.popupDiv.style.height = 0 + 'px';
    this.popupDiv.style.boxShadow = '0px 0px 3px 0px #000000b5';
    this.popupDiv.style.visibility = 'hidden';
    this.popupDiv.className = 'modalWindow';
    this.popupDiv.style.zIndex = zIndex;
    this.popupDiv.style.backgroundColor = '#FFFFFF';
    this.popupDiv.style.maxWidth = '99vw';
    this.popupDiv.style.maxHeight = '99vh';
    /***if (window.parent) this.bordoFinestra = window.parent.document.createElement('div');
    else*/ this.bordoFinestra = window.document.createElement('div');
    this.bordoFinestra.id = 'popupBordo_' + zIndex;
    this.bordoFinestra.border = '0px';
    this.bordoFinestra.style.fontSize = '0px';
    this.bordoFinestra.style.margin = '0px';
    this.bordoFinestra.style.cursor = 'move';
    this.bordoFinestra.style.backgroundColor = '#090909';
    this.bordoFinestra.style.height = this.altezzaTitoloPopup + 'px';
    this.bordoFinestra.style.width = '100%';
    this.bordoFinestra.style.maxWidth = '99vw';
    this.bordoFinestra.style.maxHeight = '99vh';
    this.bordoFinestra.style.zIndex = zIndex;
    this.popupDiv.appendChild(this.bordoFinestra);
    const closeButton = window.document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.style.fontSize = '15px';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = '2px solid white';
    closeButton.style.color = 'white';
    closeButton.style.borderRadius = '50%';
    closeButton.style.padding = '0px 5px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.zIndex = '' + zIndex;
    closeButton.onclick = (ev) => { ev.stopPropagation(); PopupManager.closeLastPopup(undefined); };
    this.bordoFinestra.appendChild(closeButton);
    /***if (window.parent) this.contenutoFinestra = window.parent.document.createElement('iframe');
    else*/ this.contenutoFinestra = window.document.createElement('iframe');
    // Mi assicuro che se un popup ricaricata e' l'ultima dello stack venga unfreezata
    this.contenutoFinestra.name = 'popupIFrame_' + zIndex;
    this.contenutoFinestra.id = 'popupIFrame_' + zIndex;
    this.contenutoFinestra.style.border = '0px';
    this.contenutoFinestra.style.margin = '0px';
    this.contenutoFinestra.frameBorder = 'no';
    this.contenutoFinestra.style.height = '100%';
    this.contenutoFinestra.style.width = '100%';
    this.contenutoFinestra.style.maxHeight = '99vh';
    this.contenutoFinestra.style.maxWidth = '99vw';
    this.contenutoFinestra.scrolling = 'yes';
    this.contenutoFinestra.style.zIndex = zIndex;
    this.popupDiv.appendChild(this.contenutoFinestra);
    this.pannelloGrigio = creaPannelloGrigio('popupPannelloGrigio_' + zIndex, zIndex + 1);
    this.popupDiv.appendChild(this.pannelloGrigio);
    // Aggiungo all'iframe della popup la popup stessa per consentirne la referenziazione nel DOM tramite window
    this.contenutoFinestra.popup = this;
    /***if (window.parent)window.parent.document.body.appendChild(this.popupDiv);
    else*/ window.document.body.appendChild(this.popupDiv);
}
Popup.prototype.returnToCaller = (oggetto) => {
    PopupManager.closeLastPopup(oggetto);
};
Popup.prototype.setCallerReturnFunction = function (callerReturnFunction) {
    this.callerReturnFunction = callerReturnFunction;
};
Popup.prototype.chiudi = function () {
    // window.document.body.removeChild(objDivWin);
    const _this = this;
    // const campo = (document.getElementById('campo_focus_per_bug_ie') as HTMLInputElement);
    // campo.value = campo.value + _this.popupDiv;
    // TODO:su ie la chiusura freeza la finestra sottostante
    setTimeout(() => {
        // _this.popupDiv.blur();
        // window.document.body.focus();
        // campo.focus();
        // _this.popupDiv.innerHTML='';
        // _this.popupDiv.style.display='none';
        // _this.popupDiv.style.visibility='hidden';
        /***if (window.parent) window.parent.document.body.removeChild(_this.popupDiv);
        else*/ window.document.body.removeChild(_this.popupDiv);
        // _this.popupDiv=null;
    }, 100);
};
Popup.prototype.setContenuto = function (src) {
    this.contenutoFinestra.src = src;
};
Popup.prototype.setSpostabile = function (spostabile) {
    this.spostabile = spostabile;
};
Popup.prototype.setTop = function (top) {
    this.popupDiv.style.top = top + 'px';
};
Popup.prototype.setLeft = function (left) {
    this.popupDiv.style.left = left + 'px';
};
Popup.prototype.setInnerHeight = function (innerHeight) {
    this.contenutoFinestra.style.height = innerHeight + 'px';
    this.setHeight(innerHeight + this.altezzaTitoloPopup);
};
Popup.prototype.setInnerWidth = function (innerWidth) {
    this.contenutoFinestra.style.width = innerWidth + 'px';
    this.setWidth(innerWidth);
};
Popup.prototype.setHeight = function (height) {
    this.popupDiv.style.height = height + 'px';
    this.pannelloGrigio.style.height = height + 'px';
};
Popup.prototype.setWidth = function (width) {
    this.popupDiv.style.width = width + 'px';
    this.pannelloGrigio.style.width = width + 'px';
    this.bordoFinestra.style.width = width + 'px';
};
Popup.prototype.isSpostabile = function () {
    return this.spostabile;
};
Popup.prototype.getTop = function () {
    return parseInt(this.popupDiv.style.top, 10);
};
Popup.prototype.getLeft = function () {
    return parseInt(this.popupDiv.style.left, 10);
};
Popup.prototype.getHeight = function () {
    return parseInt(this.popupDiv.style.height, 10);
};
Popup.prototype.getWidth = function () {
    return parseInt(this.popupDiv.style.width, 10);
};
Popup.prototype.unfreeze = function () {
    this.freezed = false;
    this.spostabile = true;
    this.mostraContenuto();
    this.bordoFinestra.popup = this;
    this.bordoFinestra.onmousedown = mouseDownListener;
};
Popup.prototype.freeze = function () {
    this.freezed = true;
    this.oscuraContenuto();
    this.spostabile = false;
    this.bordoFinestra.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
};
// Centra ed attribuisce lo z-index corretto
Popup.prototype.show = function () {
    this.centra();
    // WinLevel(this.Id);
    if (this.spostabile) {
        // Workaround per passare l'oggetto al listener
        this.bordoFinestra.popup = this;
        this.bordoFinestra.onmousedown = mouseDownListener;
    }
    this.popupDiv.style.visibility = 'visible';
};
Popup.prototype.hide = function (width) {
    this.popupDiv.style.visibility = 'hidden';
};
Popup.prototype.centra = function () {
    try {
        const _isIE = isIE();
        // let scLeft = 0;
        // let scTop = 0;
        let fullHeight = 0;
        let fullWidth = 0;
        if (!isIE()) {
            // scLeft = pageXOffset;
            // scTop = pageYOffset;
            fullWidth = window.innerWidth - 20;
            fullHeight = window.innerHeight;
            // IE 6+ in 'standards compliant mode'
        }
        else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            // scLeft = document.documentElement.scrollLeft;
            // scTop = document.documentElement.scrollTop;
            fullWidth = document.documentElement.clientWidth;
            fullHeight = document.documentElement.clientHeight;
            // IE 4 compatible
        }
        else if (document.body) {
            // scLeft = document.body.scrollLeft;
            // scTop = document.body.scrollTop;
            fullWidth = document.body.clientWidth;
            fullHeight = document.body.clientHeight;
        }
        // if (scLeft < 0) {
        //   scLeft = 0;
        // }
        // if (scTop < 0) {
        //   scTop = 0;
        // }
        if (fullHeight < 200) {
            fullHeight = screen.availHeight * .8;
        }
        if (fullWidth < 200) {
            fullWidth = screen.availWidth * .9;
        }
        let winTop = (fullHeight - this.getHeight()) / 2;
        let winLeft = (fullWidth - this.getWidth()) / 2;
        if (winTop < 10) {
            winTop = 10;
        }
        if (winLeft < 0) {
            winLeft = 0;
        }
        this.setTop(winTop);
        this.setLeft(winLeft);
    }
    catch (err) { }
};
Popup.prototype.oscuraContenuto = function () {
    this.pannelloGrigio.style.visibility = 'visible';
    this.contenutoFinestra.style.visibility = 'visible';
};
Popup.prototype.nascondiContenuto = function () {
    this.contenutoFinestra.style.visibility = 'hidden';
};
Popup.prototype.mostraContenuto = function () {
    this.pannelloGrigio.style.visibility = 'hidden';
    this.contenutoFinestra.style.visibility = 'visible';
};
Popup.prototype.stopListening = function () {
    document.onmousemove = null;
    document.onmouseup = null;
    this.mostraContenuto();
};
Popup.prototype.getIFrame = function () {
    return this.contenutoFinestra;
};
Popup.prototype.isFreezed = function () {
    return this.freezed;
};
Popup.prototype.setReloadOnClose = function (reloadOnClose) {
    this.reloadOnClose = reloadOnClose;
};
Popup.prototype.getReloadOnClose = function () {
    return this.reloadOnClose;
};
// Nota: i listener non possono essere membri
function mouseDownListener(event) {
    const popup = this.popup;
    popup.nascondiContenuto();
    popup.offX = parseInt(popup.popupDiv.style.left + 0) - (isNS() ? event.clientX : event.clientX);
    popup.offY = parseInt(popup.popupDiv.style.top + 0) - (isNS() ? event.clientY : event.clientY);
    // workaround per selezione popup da parte di ie
    document.body.ondrag = function () { return false; };
    document.body.onselectstart = function () { return false; };
    document.onmouseup = function mouseUpListener(e) {
        popup.stopListening();
    };
    document.onmousemove = function mouseMoveListener(e) {
        const xPos = (isNS() ? e.clientX : event.clientX) + popup.offX;
        const yPos = (isNS() ? e.clientY : event.clientY) + popup.offY;
        if (xPos < 0 || yPos < 0) {
            popup.stopListening();
            return false;
        }
        popup.popupDiv.style.left = xPos + 'px';
        popup.popupDiv.style.top = yPos + 'px';
        return false;
    };
    return false;
}
function inviaForm(obj) {
    // Se la popup e' freezata non ne consento il submit
    // l'utente ha aperto un'altra
    const thisPopup = parent.PopupManager.PopupManager.getEclosingPopup(obj);
    if (!thisPopup.isFreezed()) {
        const pannelloGrigio = creaPannelloGrigio('tmp', 99);
        pannelloGrigio.style.visibility = 'visible';
        pannelloGrigio.style.height = getHeight(document.body) + 'px';
        document.body.appendChild(pannelloGrigio);
        obj.form.submit();
    }
}
function addSpaces(valore, lunghezza) {
    if (!valore || valore == null) {
        valore = '';
    }
    while (valore.length < lunghezza) {
        valore += ' ';
    }
    return valore;
}
// dato un elemento del DOM ne restituisce la posizione x
function getXPos(campo) {
    let xPos = 0;
    if (campo.offsetParent) {
        while (1) {
            xPos += campo.offsetLeft;
            if (!campo.offsetParent) {
                break;
            }
            campo = campo.offsetParent;
        }
    }
    else if (campo.x) {
        xPos += campo.x;
    }
    return xPos;
}
// dato un elemento del DOM ne restituisce la posizione y
function getYPos(campo) {
    let yPos = 0;
    if (campo.offsetParent) {
        while (1) {
            yPos += campo.offsetTop;
            if (!campo.offsetParent) {
                break;
            }
            campo = campo.offsetParent;
        }
    }
    else if (campo.y) {
        yPos += campo.y;
    }
    return yPos;
}
function getWidth(campo) {
    return campo.clientWidth ? campo.clientWidth : campo.width;
}
function getHeight(campo) {
    return campo.clientHeight ? campo.clientHeight : campo.height;
}
// Fa comparire un messaggio di testo sotto un elemento del DOM
function testMessaggio(campo, messaggio) {
    const msg = new MessageBox(campo);
    msg.setMessaggio(messaggio);
    msg.show();
}
// Inizio Classe MessageBox
// Rappresenta il tasto premuto
function MessageBox(campo) {
    // this.padre = campo.parentNode;
    this.padre = document.body;
    this.xPos = getXPos(campo);
    this.yPos = getYPos(campo) + getHeight(campo);
    this.visibile = false;
    this.messaggio = '';
}
MessageBox.prototype.setMessaggio = function (messaggio) {
    this.messaggio = messaggio;
};
MessageBox.prototype.show = function () {
    const box = document.createElement('div');
    // box.style.position='absolute';
    // box.style.zIndex = 99;
    // Li do nel class attribute
    box.className = 'MessageBoxStyleClass';
    box.style.top = this.yPos + 'px';
    box.style.left = this.xPos + 'px';
    // TODO:onclick=close
    box.innerHTML = this.messaggio;
    this.padre.appendChild(box);
};
function leftTrim(stringa) {
    while (stringa.substring(0, 1) === ' ') {
        stringa = stringa.substring(1, stringa.length);
    }
    return stringa;
}
function rightTrim(stringa) {
    while (stringa.substring(stringa.length - 1, stringa.length) === ' ') {
        stringa = stringa.substring(0, stringa.length - 1);
    }
    return stringa;
}
function trim(stringa) {
    while (stringa.substring(0, 1) === ' ') {
        stringa = stringa.substring(1, stringa.length);
    }
    while (stringa.substring(stringa.length - 1, stringa.length) === ' ') {
        stringa = stringa.substring(0, stringa.length - 1);
    }
}
function creaPannelloGrigio(id, zIndex) {
    const pannelloGrigio = document.createElement('DIV');
    pannelloGrigio.id = id;
    pannelloGrigio.style.position = 'absolute';
    pannelloGrigio.style.left = 0 + 'px';
    pannelloGrigio.style.top = 0 + 'px';
    pannelloGrigio.style.zIndex = zIndex;
    pannelloGrigio.style.width = '100%';
    pannelloGrigio.style.height = '100%';
    pannelloGrigio.style.maxWidth = '99vw';
    pannelloGrigio.style.maxHeight = '99vh';
    pannelloGrigio.style.backgroundColor = '#808080';
    if (isIE()) {
        pannelloGrigio.style.filter = 'alpha(opacity=' + 40 + ')';
    }
    else {
        pannelloGrigio.style.opacity = '.4';
    }
    pannelloGrigio.style.visibility = 'hidden';
    return pannelloGrigio;
}
function isIE() {
    return navigator.userAgent.indexOf('MSIE') !== -1;
}
// Netscape o firefox
function isNS() {
    return navigator.appName.indexOf('Netscape') !== -1;
}
// Risale il dom fino a trovare la prima occorrenza di un tag
// numeroLivelli indica il numero di livelli da risalire, di default 1
function risaliByTag(obj, tag, numeroLivelli) {
    if (!numeroLivelli) {
        numeroLivelli = 1;
    }
    let res = obj;
    let livelloCorrente = 0;
    while (res && res != null && (new String(res.tagName).toLowerCase() !== tag.toLowerCase() || ++livelloCorrente < numeroLivelli)) {
        res = res.parentNode;
    }
    if (!res) {
        res = null;
    }
    return res;
}
function nextByTag(obj, tag) {
    let res = obj;
    while (res && res != null && new String(res.tagName).toLowerCase() !== tag.toLowerCase()) {
        res = res.nextSibling;
    }
    if (!res) {
        res = null;
    }
    return res;
}
// rimuove un elemento dal dom
function rimuoviElemento(obj) {
    setTimeout(function () {
        if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
        }
    }, 100);
}
// addPopupSdac('#{servlet_url}?#{rec.url}');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lpUG9wdXBNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL21lbnUvdXRpbHMvU2lpUG9wdXBNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLHlEQUF5RDtBQUN6RCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUksTUFBYyxDQUFDLFlBQVksR0FBRztJQUN6RCxVQUFVLEVBQUUsSUFBSTtJQUVoQixvREFBb0Q7SUFDcEQsMERBQTBEO0lBQzFELEVBQUU7SUFDRiwrQ0FBK0M7SUFDL0MsbUNBQW1DO0lBQ25DLGtEQUFrRDtJQUNsRCwrQ0FBK0M7SUFDL0MsNEZBQTRGO0lBRTVGLHdFQUF3RTtJQUN4RSxxRkFBcUY7SUFDckYsc0ZBQXNGO0lBQ3RGLHdGQUF3RjtJQUN4RixRQUFRO0lBRVIsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPO1FBQ3ZCLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsMEZBQTBGLENBQUMsQ0FBQztZQUNqSSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNqQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQywrQ0FBK0M7b0JBQ3hFLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7Z0JBQ2xELENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFVCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNkLElBQUksQ0FB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LENBQUM7SUFFRCxZQUFZLENBQUMsR0FBRztRQUNkLDRDQUE0QztRQUM1QyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUUsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzdILElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUFDLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwSCxDQUFDO1FBRUQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BELElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBQyxDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEcsQ0FBQztRQUVELElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1B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Q0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7UUFDekYsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDYixDQUFDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsOEJBQThCO0FBQzlCLFNBQVMsZUFBZSxDQUFDLEdBQUc7SUFDMUIsVUFBVSxDQUNSO1FBQ0UsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDLEVBQ0MsR0FBRyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsNkNBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUGFyZW50SWZyYW1lV2luZG93RHRvIGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgcG9wdXA6IGFueTtcclxufVxyXG5cclxuLy8gSWwgZ2VzdG9yZSBkZWxsZSBwb3B1cC4gTGUgcG9wdXAgY3JlYXRlIHNhcmFubm8gbW9kYWxpXHJcbmV4cG9ydCBjb25zdCBQb3B1cE1hbmFnZXIgPSAod2luZG93IGFzIGFueSkuUG9wdXBNYW5hZ2VyID0ge1xyXG4gIHBvcHVwU3RhY2s6IG51bGwsXHJcblxyXG4gIC8vIENyZWEgdW5hIG51b3ZhIHBvcHVwIGUgbGEgcG9uZSBpbiBjaW1hIGFsbG8gc3RhY2tcclxuICAvLyBMJ2V2ZW50dWFsZSBwb3B1cCBwcmVjZWRlbnRlbWVudGUgYXR0aXZhIHZpZW5lIGZyZWV6YXRhXHJcbiAgLy9cclxuICAvLyAgdXJsQ29udGVudXRvIGwndXJsIGRhIGFwcmlyZSBuZWxsYSBmaW5lc3RyYVxyXG4gIC8vICBjYWxsZXJSZXR1cm5GdW5jdGlvbiB2ZWRpIHNvdHRvXHJcbiAgLy8gIGlubmVyV2lkdGggICBsYSBsYXJnaGV6emEgdXRpbGUgZGVsbGEgZmluZXN0cmFcclxuICAvLyAgaW5uZXJIZWlnaHQgIGwnYWx0ZXp6YSB1dGlsZSBkZWxsYSBmaW5lc3RyYVxyXG4gIC8vICByZWxvYWRPbkNsb3NlIGluZGljYSBjaGUgbGEgcG9wdXAgY2F1c2EgaWwgcmVsb2FkIGRlbGxhIHNvdHRvc3RhbnRlIHF1YWxvcmEgdmVuZ2EgY2hpdXNhXHJcblxyXG4gIC8vIGNhbGxlclJldHVybkZ1bmN0aW9uIGUnIHVuYSBvcHppb25hbGUgZnVuemlvbmUgamF2YXNjcmlwdCBkZWxsYSBwb3B1cFxyXG4gIC8vIGNoaWFtYW50ZSBjaGUgcmljZXZlIGwnZXZlbnR1YWxlIG9nZ2V0dG8gY2hlIGxhIHBvcHVwIGNoaWFtYXRhIGludmlhIGFsbGEgY2hpdXN1cmFcclxuICAvLyB0cmFtaXRlIHVuYSBjaGlhbWF0YSB0aXBvIHBhcmVudC5Qb3B1cE1hbmFnZXIuZ2V0TGFzdFBvcHVwKCkucmV0dXJuVG9DYWxsZXIodmFsb3JlKVxyXG4gIC8vIG9wcHVyZSB0cmFtaXRlIHBhcmVudC5Qb3B1cE1hbmFnZXIuY2xvc2VMYXN0UG9wdXAoKSBuZWwgcXVhbGNhc28gbm9uIHZpZW5lIHJlc3RpdHVpdG9cclxuICAvLyBudWxsYVxyXG5cclxuICBhZGRQb3B1cFNkYWModXJsLCBuZXdQYWdlKSB7XHJcbiAgICBpZiAobmV3UGFnZSkge1xyXG4gICAgICBjb25zdCB3aW4gPSB3aW5kb3cub3Blbih1cmwsJ19ibGFuaycsYHRhcmdldD1fYmxhbmssd2lkdGg9NDAwLGhlaWdodD00MDAscmVzaXphYmxlPTAsc2Nyb2xsYmFycz0xLHN0YXR1cz0xLHRvb2xiYXI9MCxtZW51YmFyPTBgKTtcclxuICAgICAgdmFyIHBvbGxUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAod2luPy5jbG9zZWQgIT09IGZhbHNlKSB7IC8vICE9PSBpcyByZXF1aXJlZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIE9wZXJhXHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHBvbGxUaW1lcik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SZWxvYWQnKT8uY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB3ID0gOTUwO1xyXG4gICAgICBjb25zdCBoID0gNTI1O1xyXG4gICAgICB0aGlzLmFkZFBvcHVwKHVybCwgKCkgPT4geyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuUmVsb2FkJyk/LmNsaWNrKCk7IH0sIHcsIGgpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGFkZFBvcHVwKHVybENvbnRlbnV0bywgY2FsbGVyUmV0dXJuRnVuY3Rpb24sIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0LCByZWxvYWRPbkNsb3NlKSB7XHJcbiAgICBpZiAoIXJlbG9hZE9uQ2xvc2UgfHwgcmVsb2FkT25DbG9zZSA9PT0gbnVsbCkgeyByZWxvYWRPbkNsb3NlID0gZmFsc2U7IH1cclxuXHJcbiAgICBpZiAodGhpcy5wb3B1cFN0YWNrID09IG51bGwpIHtcclxuICAgICAgdGhpcy5wb3B1cFN0YWNrID0gbmV3IEFycmF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucG9wdXBTdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMucG9wdXBTdGFja1t0aGlzLnBvcHVwU3RhY2subGVuZ3RoIC0gMV0uZnJlZXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9wdXAgPSBuZXcgUG9wdXAodGhpcy5wb3B1cFN0YWNrLmxlbmd0aCk7XHJcbiAgICBwb3B1cC5zZXRJbm5lckhlaWdodChpbm5lckhlaWdodCk7XHJcbiAgICBwb3B1cC5zZXRJbm5lcldpZHRoKGlubmVyV2lkdGgpO1xyXG4gICAgcG9wdXAuc2V0U3Bvc3RhYmlsZSh0cnVlKTtcclxuICAgIC8vIEZvcnpvIGwnZXNjbHVzaW9uZSBkYWxsYSBjYWNoZS5TZXJ2ZSBwZXIgdW4gYnVnIGRpIGllIChjbGVtKVxyXG4gICAgaWYgKHVybENvbnRlbnV0by5pbmRleE9mKCc/JykgPT09IC0xKSB7XHJcbiAgICAgIHVybENvbnRlbnV0byArPSAnPyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cmxDb250ZW51dG8gKz0gJyYnO1xyXG4gICAgfVxyXG4gICAgdXJsQ29udGVudXRvICs9ICdpZXJuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuICAgIHBvcHVwLnNldENvbnRlbnV0byh1cmxDb250ZW51dG8pO1xyXG4gICAgcG9wdXAuc2hvdygpO1xyXG5cclxuICAgIHBvcHVwLnNldFJlbG9hZE9uQ2xvc2UocmVsb2FkT25DbG9zZSk7XHJcbiAgICBwb3B1cC5zZXRDYWxsZXJSZXR1cm5GdW5jdGlvbihjYWxsZXJSZXR1cm5GdW5jdGlvbik7XHJcbiAgICB0aGlzLnBvcHVwU3RhY2sucHVzaChwb3B1cCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0TGFzdFBvcHVwKCkge1xyXG4gICAgaWYgKHRoaXMucG9wdXBTdGFjayA9PSBudWxsIHx8IHRoaXMucG9wdXBTdGFjay5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wb3B1cFN0YWNrWyh0aGlzLnBvcHVwU3RhY2spLmxlbmd0aCAtIDFdO1xyXG4gIH0sXHJcblxyXG4gIC8vIENoaXVkZSBsJ3VsdGltYSBwb3B1cCBpbiBjaW1hIGFsbG8gc3Rhc2NrIGUgJ3Njb25nZWxhJyBsJ2V2ZW50dWFsZSBwZW51bHRpbWFcclxuICAvLyBMYSBjaGl1c3VyYSBkZWxsJ3VsdGltYSBwb3B1cCBjYXVzYSBsYSBjaGl1c3VyYSBkZWxsYSBmaW5lc3RyYS5cclxuXHJcbiAgLy8gb2dnZXR0byBlJyB1biBldmVudGlhbGUgdmFsb3JlIGRhIHJlc3Rpb3R1aXJlIGFsbGEgcG9wdXAgc2NvbmdlbGF0YSBuZWwgY2Fzb1xyXG4gIC8vIGNoZSBsJ3V0ZW50ZSBjcmVhbmRvbGEgYWJiaWEgc3BlY2lmaWNhdG8gbCdvcHppb25lIGNhbGxlclJldHVybkZ1bmN0aW9uXHJcbiAgLy8gcmVsb2FkICAgICAgICAgICBzZSB0cnVlIG9wZXJhIGlsIHJlbG9hZCBwcmVub3RhdG8gZGFsIGNoaWFtYW50ZSwgcXVhbG9yYSBzaWEgc3RhdG8gc3BlY2lmaWNhdG9cclxuICAvLyAgICAgICAgICAgICAgICAgcGVyIGRlZmF1bHQgZScgdHJ1ZVxyXG4gIC8vICAgICAgICAgICAgICAgICBzZSBmYWxzZSBub24gZmEgaW4gbmVzc3VuIGNhc28gaWwgcmVsb2FkXHJcbiAgY2xvc2VMYXN0UG9wdXAob2dnZXR0bywgcmVsb2FkPzogYm9vbGVhbikge1xyXG4gICAgaWYgKHJlbG9hZCAhPT0gZmFsc2UpIHtcclxuICAgICAgcmVsb2FkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qaWYgKHRoaXMucG9wdXBTdGFjayA9PSBudWxsIHx8IHRoaXMucG9wdXBTdGFjay5sZW5ndGggPD0gMSkge1xyXG4gICAgICAvLyBhbGVydCh0aGlzLnBvcHVwU3RhY2spO1xyXG4gICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKXtcclxuICAgICAgaWYgKHJlbG9hZCkge1xyXG4gICAgICAvLyBSZWxvYWQgcGVyIHNkYWNcclxuICAgICAgICAvLyBQb3B1cE1hbmFnZXIucmVsb2FkT3BlbmVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gd2luZG93Lm9wZW5lcj0neCc7Ly9Xb3JrYXJvdW5kIHBlciBldml0YXJlIG1lc3NhZ2dpbyBkaSBjaGl1c3VyYVxyXG4gICAgICAgIHRyeXt3aW5kb3cuY2xvc2UoKTt9IGNhdGNoKGUpIHt9XHJcbiAgICAgIH0sMTAwKTtcclxuICAgIHJldHVybjtcclxuICAgIH0qL1xyXG5cclxuICAgIGNvbnN0IHBvcHVwID0gdGhpcy5wb3B1cFN0YWNrLnBvcCgpO1xyXG4gICAgY29uc3QgcmVsb2FkT25DbG9zZSA9IHBvcHVwLmdldFJlbG9hZE9uQ2xvc2UoKTtcclxuICAgIGNvbnN0IGNhbGxlclJldHVybkZ1bmN0aW9uID0gcG9wdXAuY2FsbGVyUmV0dXJuRnVuY3Rpb247XHJcblxyXG4gICAgbGV0IGxhc3RQb3B1cCA9IG51bGwgYXMgYW55O1xyXG4gICAgaWYgKHRoaXMucG9wdXBTdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxhc3RQb3B1cCA9IHRoaXMucG9wdXBTdGFja1sodGhpcy5wb3B1cFN0YWNrKS5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAoY2FsbGVyUmV0dXJuRnVuY3Rpb24gJiYgY2FsbGVyUmV0dXJuRnVuY3Rpb24gIT0gbnVsbCAmJiBjYWxsZXJSZXR1cm5GdW5jdGlvbiAhPT0gJycpIHtcclxuICAgICAgICBpZiAocmVsb2FkKSB7XHJcbiAgICAgICAgICBjYWxsZXJSZXR1cm5GdW5jdGlvbihvZ2dldHRvKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcG9wdXAuY2hpdWRpKCk7XHJcblxyXG4gICAgICAvLyBTZSBsYSBwb3B1cCBkZXZlIGVzc2VyZSByaWNhcmljYXRhIGwndW5mcmVlemUgdmllbmUgcG9zdGljaXBhdG8gYWxsJ29ubG9hZCBkZWxsYSBmaW5lc3RyYVxyXG4gICAgICBpZiAocmVsb2FkICYmIGxhc3RQb3B1cCAmJiBsYXN0UG9wdXAgIT09IG51bGwpIHtcclxuICAgICAgICBpZiAoIXJlbG9hZE9uQ2xvc2UpIHtcclxuICAgICAgICAgIGxhc3RQb3B1cC51bmZyZWV6ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBsZSB1bHRpbWUgZHVlIGNvbmRpemlvbmkgc29ubyBzdGF0ZSBhZ2dpdW50ZSBwZXIgY29uc2VudGlyZSBjaGUgbGFcclxuICAgICAgICAgIC8vIGNhbGxlclJldHVybkZ1bmN0aW9uIG5vbiB2ZW5nYSBhbm51bGxhdGEgZGFsIHN1Ym1pdCBkZWwgZm9ybVxyXG4gICAgICAgICAgaWYgKGxhc3RQb3B1cC5jb250ZW51dG9GaW5lc3RyYSAmJiAhcmVsb2FkICYmICEoY2FsbGVyUmV0dXJuRnVuY3Rpb24gPT09IG51bGwpKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0lFKCkpIHtcclxuICAgICAgICAgICAgICBsYXN0UG9wdXAuY29udGVudXRvRmluZXN0cmEuY29udGVudFdpbmRvdy53aW5kb3cuZG9jdW1lbnQuZm9ybXNbMF0uc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGFzdFBvcHVwLmNvbnRlbnV0b0ZpbmVzdHJhLmNvbnRlbnREb2N1bWVudC5mb3Jtc1swXS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICghcmVsb2FkKSB7XHJcbiAgICAgICAgbGFzdFBvcHVwLnVuZnJlZXplKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMCk7XHJcblxyXG4gIH0sXHJcblxyXG4gIC8vIEludGVyZXNzYW50ZSwgcmVzdGl0dWlzY2UgbCdodG1sIGF0dHVhbG1lbnRlIHJlbmRlcml6emF0byBkZWxsYSBmaW5lc3RyYTpcclxuICAvLyBvYmouZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTFxyXG5cclxuICAvLyBTZnJ1dHRvIGxhIHByb3ByaWV0YScgY2hlIGxhIHBvcHVwIGUnIGxhIHByb3ByaWV0YScgcG9wdXAgZGkgdW4gRElWIGNoZSBjb250aWVuZSBsJ2lmcmFtZVxyXG4gIC8vIGRlbGxhIHN0ZXNzYVxyXG4gIGdldEVjbG9zaW5nUG9wdXAob2JqKSB7XHJcbiAgICAvLyBmb3JzZSBub24gc2VydmUgY2VyY2FybG8gaW4gdGhpcy5Qb3B1cE1hbmFnZXJcclxuICAgIGxldCBlbmNsb3NpbmcgPSB0aGlzLmdldExhc3RQb3B1cCAhPSBudWxsID8gdGhpcy5nZXRMYXN0UG9wdXAoKSA6IHRoaXMuUG9wdXBNYW5hZ2VyLmdldExhc3RQb3B1cCgpO1xyXG4gICAgbGV0IHRtcCA9IG9iajtcclxuICAgIHdoaWxlICh0bXAgJiYgdG1wICE9IG51bGwpIHtcclxuICAgICAgaWYgKHRtcC5ib2R5KSB7XHJcbiAgICAgICAgY29uc3QgZG9jID0gdG1wO1xyXG4gICAgICAgIGNvbnN0IGZybSA9IHdpbmRvdy5mcmFtZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGZybS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgY29uc3QgaWZyYW1lID0gZnJtW2ldO1xyXG4gICAgICAgICAgaWYgKGlmcmFtZS5kb2N1bWVudCA9PT0gZG9jKSB7XHJcbiAgICAgICAgICAgIC8vIEhvIHRyb3ZhdG8gaWwgZnJhbWUgY2hlIGNvbnRpZW5lIGwnb2JqXHJcbiAgICAgICAgICAgIGVuY2xvc2luZyA9IChpZnJhbWUuZnJhbWVFbGVtZW50IGFzIElQYXJlbnRJZnJhbWVXaW5kb3dEdG8pLnBvcHVwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgdG1wID0gdG1wLnBhcmVudE5vZGU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW5jbG9zaW5nO1xyXG4gIH0sXHJcblxyXG4gIHJlbG9hZE9wZW5lcihvYmopIHtcclxuICAgIC8vIHNlIHNvbm8gbWlvIHBhZHJlICghKSBldnRvIGRpIHJpY2FyaWNhcm1pXHJcbiAgICBpZiAod2luZG93ICYmIHdpbmRvdy5vcGVuZXIgJiYgd2luZG93LnNlbGYgJiYgd2luZG93Lm9wZW5lciA9PT0gd2luZG93LnNlbGYpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cucGFyZW50ICYmIHdpbmRvdy5wYXJlbnQub3BlbmVyICYmIHdpbmRvdy5wYXJlbnQub3BlbmVyLmZyYW1lcyAmJiB3aW5kb3cucGFyZW50Lm9wZW5lci5mcmFtZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0cnkgeyB3aW5kb3cucGFyZW50Lm9wZW5lci5mcmFtZXNbMF0ubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5wYXJlbnQub3BlbmVyLmZyYW1lc1swXS5sb2NhdGlvbi5ocmVmOyB9IGNhdGNoIChlKSB7IH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93ICYmIHdpbmRvdy5wYXJlbnQgJiYgd2luZG93LnBhcmVudC5vcGVuZXIpIHtcclxuICAgICAgdHJ5IHsgd2luZG93LnBhcmVudC5vcGVuZXIubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5wYXJlbnQub3BlbmVyLmxvY2F0aW9uLmhyZWY7IH0gY2F0Y2ggKGUpIHsgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cgJiYgd2luZG93Lm9wZW5lcikge1xyXG4gICAgICB0cnkgeyB3aW5kb3cub3BlbmVyLmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cub3BlbmVyLmxvY2F0aW9uLmhyZWY7IH0gY2F0Y2ggKGUpIHsgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59O1xyXG5cclxuXHJcbi8vIElsIGNsYXNzIGF0dHJpYnV0ZSBkZWxsYSBwb3B1cCA6IG1vZGFsV2luZG93XHJcbi8vIElsIGNvc3RydXR0b3JlIGRlbGxhIHBvcHVwXHJcbi8vICB6SW5kZXggbG8gekluZGV4IGRlbGxhIGZpbmVzdHJhXHJcbi8vXHJcbi8vICBwb3B1cERpdiAgICAgICAgICAgaWwgZGl2IGVzdGVybm9cclxuLy8gIGJvcmRvRmluZXN0cmFcclxuLy8gIGNvbnRlbnV0b0ZpbmVzdHJhICBsJ2lmcmFtZSBjb24gaWwgY29udGVudXRvXHJcbmZ1bmN0aW9uIFBvcHVwKHRoaXM6IGFueSwgaWQpIHtcclxuICBjb25zdCB6SW5kZXggPTEwMDArIChpZCArIDEpICogMiArIDU7XHJcbiAgdGhpcy5zcG9zdGFiaWxlID0gZmFsc2U7XHJcbiAgdGhpcy5hbHRlenphVGl0b2xvUG9wdXAgPSAyNTtcclxuICB0aGlzLmZyZWV6ZWQgPSBmYWxzZTtcclxuICAvKioqaWYgKHdpbmRvdy5wYXJlbnQpIHRoaXMucG9wdXBEaXYgPXdpbmRvdy5wYXJlbnQuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZWxzZSovIHRoaXMucG9wdXBEaXYgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuICB0aGlzLnBvcHVwRGl2LnN0eWxlLndpZHRoID0gMCArICdweCc7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS5oZWlnaHQgPSAwICsgJ3B4JztcclxuICB0aGlzLnBvcHVwRGl2LnN0eWxlLmJveFNoYWRvdyA9ICcwcHggMHB4IDNweCAwcHggIzAwMDAwMGI1JztcclxuICB0aGlzLnBvcHVwRGl2LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICB0aGlzLnBvcHVwRGl2LmNsYXNzTmFtZSA9ICdtb2RhbFdpbmRvdyc7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS56SW5kZXggPSB6SW5kZXg7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI0ZGRkZGRic7XHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS5tYXhXaWR0aCA9ICc5OXZ3JztcclxuICB0aGlzLnBvcHVwRGl2LnN0eWxlLm1heEhlaWdodCA9ICc5OXZoJztcclxuXHJcbiAgLyoqKmlmICh3aW5kb3cucGFyZW50KSB0aGlzLmJvcmRvRmluZXN0cmEgPSB3aW5kb3cucGFyZW50LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGVsc2UqLyB0aGlzLmJvcmRvRmluZXN0cmEgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLmlkID0gJ3BvcHVwQm9yZG9fJyArIHpJbmRleDtcclxuICB0aGlzLmJvcmRvRmluZXN0cmEuYm9yZGVyID0gJzBweCc7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLnN0eWxlLmZvbnRTaXplID0gJzBweCc7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG4gIHRoaXMuYm9yZG9GaW5lc3RyYS5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMDkwOTA5JztcclxuICB0aGlzLmJvcmRvRmluZXN0cmEuc3R5bGUuaGVpZ2h0ID0gdGhpcy5hbHRlenphVGl0b2xvUG9wdXAgKyAncHgnO1xyXG4gIHRoaXMuYm9yZG9GaW5lc3RyYS5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICB0aGlzLmJvcmRvRmluZXN0cmEuc3R5bGUubWF4V2lkdGggPSAnOTl2dyc7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLnN0eWxlLm1heEhlaWdodCA9ICc5OXZoJztcclxuICB0aGlzLmJvcmRvRmluZXN0cmEuc3R5bGUuekluZGV4ID0gekluZGV4O1xyXG4gIHRoaXMucG9wdXBEaXYuYXBwZW5kQ2hpbGQodGhpcy5ib3Jkb0ZpbmVzdHJhKTtcclxuXHJcbiAgIGNvbnN0IGNsb3NlQnV0dG9uID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQ9J1gnO1xyXG4gICBjbG9zZUJ1dHRvbi5zdHlsZS5mb250U2l6ZT0gJzE1cHgnO1xyXG4gICBjbG9zZUJ1dHRvbi5zdHlsZS5wb3NpdGlvbj0gJ2Fic29sdXRlJztcclxuICAgY2xvc2VCdXR0b24uc3R5bGUucmlnaHQ9ICc1cHgnO1xyXG4gICBjbG9zZUJ1dHRvbi5zdHlsZS5jdXJzb3I9ICdwb2ludGVyJztcclxuICAgY2xvc2VCdXR0b24uc3R5bGUuYm9yZGVyPSAnMnB4IHNvbGlkIHdoaXRlJztcclxuICAgY2xvc2VCdXR0b24uc3R5bGUuY29sb3I9ICd3aGl0ZSc7XHJcbiAgIGNsb3NlQnV0dG9uLnN0eWxlLmJvcmRlclJhZGl1cz0gJzUwJSc7XHJcbiAgIGNsb3NlQnV0dG9uLnN0eWxlLnBhZGRpbmc9ICcwcHggNXB4JztcclxuICAgY2xvc2VCdXR0b24uc3R5bGUuZm9udFdlaWdodD0gJ2JvbGQnO1xyXG4gICBjbG9zZUJ1dHRvbi5zdHlsZS56SW5kZXggPSAnJyt6SW5kZXg7XHJcbiAgIGNsb3NlQnV0dG9uLm9uY2xpY2s9KGV2KT0+eyBldi5zdG9wUHJvcGFnYXRpb24oKTtQb3B1cE1hbmFnZXIuY2xvc2VMYXN0UG9wdXAodW5kZWZpbmVkKX1cclxuICAgdGhpcy5ib3Jkb0ZpbmVzdHJhLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgLyoqKmlmICh3aW5kb3cucGFyZW50KSB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhID0gd2luZG93LnBhcmVudC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICBlbHNlKi8gdGhpcy5jb250ZW51dG9GaW5lc3RyYSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAvLyBNaSBhc3NpY3VybyBjaGUgc2UgdW4gcG9wdXAgcmljYXJpY2F0YSBlJyBsJ3VsdGltYSBkZWxsbyBzdGFjayB2ZW5nYSB1bmZyZWV6YXRhXHJcblxyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEubmFtZSA9ICdwb3B1cElGcmFtZV8nICsgekluZGV4O1xyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEuaWQgPSAncG9wdXBJRnJhbWVfJyArIHpJbmRleDtcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLmJvcmRlciA9ICcwcHgnO1xyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEuc3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgdGhpcy5jb250ZW51dG9GaW5lc3RyYS5mcmFtZUJvcmRlciA9ICdubyc7XHJcbiAgdGhpcy5jb250ZW51dG9GaW5lc3RyYS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgdGhpcy5jb250ZW51dG9GaW5lc3RyYS5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLm1heEhlaWdodCA9ICc5OXZoJztcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLm1heFdpZHRoID0gJzk5dncnO1xyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEuc2Nyb2xsaW5nID0gJ3llcyc7XHJcbiAgdGhpcy5jb250ZW51dG9GaW5lc3RyYS5zdHlsZS56SW5kZXggPSB6SW5kZXg7XHJcbiAgdGhpcy5wb3B1cERpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhKTtcclxuICB0aGlzLnBhbm5lbGxvR3JpZ2lvID0gY3JlYVBhbm5lbGxvR3JpZ2lvKCdwb3B1cFBhbm5lbGxvR3JpZ2lvXycgKyB6SW5kZXgsIHpJbmRleCArIDEpO1xyXG4gIHRoaXMucG9wdXBEaXYuYXBwZW5kQ2hpbGQodGhpcy5wYW5uZWxsb0dyaWdpbyk7XHJcblxyXG4gIC8vIEFnZ2l1bmdvIGFsbCdpZnJhbWUgZGVsbGEgcG9wdXAgbGEgcG9wdXAgc3Rlc3NhIHBlciBjb25zZW50aXJuZSBsYSByZWZlcmVuemlhemlvbmUgbmVsIERPTSB0cmFtaXRlIHdpbmRvd1xyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEucG9wdXAgPSB0aGlzO1xyXG4gIC8qKippZiAod2luZG93LnBhcmVudCl3aW5kb3cucGFyZW50LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wb3B1cERpdik7XHJcbiAgZWxzZSovIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucG9wdXBEaXYpO1xyXG59XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUucmV0dXJuVG9DYWxsZXIgPSAob2dnZXR0bykgPT4ge1xyXG4gIFBvcHVwTWFuYWdlci5jbG9zZUxhc3RQb3B1cChvZ2dldHRvKTtcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5zZXRDYWxsZXJSZXR1cm5GdW5jdGlvbiA9IGZ1bmN0aW9uKGNhbGxlclJldHVybkZ1bmN0aW9uKSB7XHJcbiAgdGhpcy5jYWxsZXJSZXR1cm5GdW5jdGlvbiA9IGNhbGxlclJldHVybkZ1bmN0aW9uO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmNoaXVkaSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG9iakRpdldpbik7XHJcbiAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gIC8vIGNvbnN0IGNhbXBvID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW1wb19mb2N1c19wZXJfYnVnX2llJykgYXMgSFRNTElucHV0RWxlbWVudCk7XHJcbiAgLy8gY2FtcG8udmFsdWUgPSBjYW1wby52YWx1ZSArIF90aGlzLnBvcHVwRGl2O1xyXG4gIC8vIFRPRE86c3UgaWUgbGEgY2hpdXN1cmEgZnJlZXphIGxhIGZpbmVzdHJhIHNvdHRvc3RhbnRlXHJcbiAgc2V0VGltZW91dCgoKT0+IHtcclxuICAgIC8vIF90aGlzLnBvcHVwRGl2LmJsdXIoKTtcclxuICAgIC8vIHdpbmRvdy5kb2N1bWVudC5ib2R5LmZvY3VzKCk7XHJcbiAgICAvLyBjYW1wby5mb2N1cygpO1xyXG4gICAgLy8gX3RoaXMucG9wdXBEaXYuaW5uZXJIVE1MPScnO1xyXG4gICAgICAvLyBfdGhpcy5wb3B1cERpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgICAgLy8gX3RoaXMucG9wdXBEaXYuc3R5bGUudmlzaWJpbGl0eT0naGlkZGVuJztcclxuICAgIC8qKippZiAod2luZG93LnBhcmVudCkgd2luZG93LnBhcmVudC5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKF90aGlzLnBvcHVwRGl2KTtcclxuICAgIGVsc2UqLyB3aW5kb3cuZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChfdGhpcy5wb3B1cERpdik7XHJcbiAgICAvLyBfdGhpcy5wb3B1cERpdj1udWxsO1xyXG4gIH0sIDEwMCk7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuc2V0Q29udGVudXRvID0gZnVuY3Rpb24oc3JjKSB7XHJcbiAgdGhpcy5jb250ZW51dG9GaW5lc3RyYS5zcmMgPSBzcmM7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuc2V0U3Bvc3RhYmlsZSA9IGZ1bmN0aW9uKHNwb3N0YWJpbGUpIHtcclxuICB0aGlzLnNwb3N0YWJpbGUgPSBzcG9zdGFiaWxlO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLnNldFRvcCA9IGZ1bmN0aW9uKHRvcCkge1xyXG4gIHRoaXMucG9wdXBEaXYuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5zZXRMZWZ0ID0gZnVuY3Rpb24obGVmdCkge1xyXG4gIHRoaXMucG9wdXBEaXYuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLnNldElubmVySGVpZ2h0ID0gZnVuY3Rpb24oaW5uZXJIZWlnaHQpIHtcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLmhlaWdodCA9IGlubmVySGVpZ2h0ICsgJ3B4JztcclxuICB0aGlzLnNldEhlaWdodChpbm5lckhlaWdodCArIHRoaXMuYWx0ZXp6YVRpdG9sb1BvcHVwKTtcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5zZXRJbm5lcldpZHRoID0gZnVuY3Rpb24oaW5uZXJXaWR0aCkge1xyXG4gIHRoaXMuY29udGVudXRvRmluZXN0cmEuc3R5bGUud2lkdGggPSBpbm5lcldpZHRoICsgJ3B4JztcclxuICB0aGlzLnNldFdpZHRoKGlubmVyV2lkdGgpO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uKGhlaWdodCkge1xyXG4gIHRoaXMucG9wdXBEaXYuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuICB0aGlzLnBhbm5lbGxvR3JpZ2lvLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuc2V0V2lkdGggPSBmdW5jdGlvbih3aWR0aCkge1xyXG4gIHRoaXMucG9wdXBEaXYuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgdGhpcy5wYW5uZWxsb0dyaWdpby5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcclxuICB0aGlzLmJvcmRvRmluZXN0cmEuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuaXNTcG9zdGFiaWxlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuc3Bvc3RhYmlsZTtcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gcGFyc2VJbnQodGhpcy5wb3B1cERpdi5zdHlsZS50b3AsMTApO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gcGFyc2VJbnQodGhpcy5wb3B1cERpdi5zdHlsZS5sZWZ0LDEwKTtcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gcGFyc2VJbnQodGhpcy5wb3B1cERpdi5zdHlsZS5oZWlnaHQsMTApO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHBhcnNlSW50KHRoaXMucG9wdXBEaXYuc3R5bGUud2lkdGgsMTApO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLnVuZnJlZXplID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5mcmVlemVkID0gZmFsc2U7XHJcbiAgdGhpcy5zcG9zdGFiaWxlID0gdHJ1ZTtcclxuICB0aGlzLm1vc3RyYUNvbnRlbnV0bygpO1xyXG4gIHRoaXMuYm9yZG9GaW5lc3RyYS5wb3B1cCA9IHRoaXM7XHJcbiAgdGhpcy5ib3Jkb0ZpbmVzdHJhLm9ubW91c2Vkb3duID0gbW91c2VEb3duTGlzdGVuZXI7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuZnJlZXplID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5mcmVlemVkID0gdHJ1ZTtcclxuICB0aGlzLm9zY3VyYUNvbnRlbnV0bygpO1xyXG4gIHRoaXMuc3Bvc3RhYmlsZSA9IGZhbHNlO1xyXG4gIHRoaXMuYm9yZG9GaW5lc3RyYS5vbm1vdXNlZG93biA9IG51bGw7XHJcblxyXG4gIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcclxuICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xyXG59O1xyXG5cclxuLy8gQ2VudHJhIGVkIGF0dHJpYnVpc2NlIGxvIHotaW5kZXggY29ycmV0dG9cclxuUG9wdXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmNlbnRyYSgpO1xyXG5cclxuICAvLyBXaW5MZXZlbCh0aGlzLklkKTtcclxuICBpZiAodGhpcy5zcG9zdGFiaWxlKSB7XHJcbiAgICAvLyBXb3JrYXJvdW5kIHBlciBwYXNzYXJlIGwnb2dnZXR0byBhbCBsaXN0ZW5lclxyXG4gICAgdGhpcy5ib3Jkb0ZpbmVzdHJhLnBvcHVwID0gdGhpcztcclxuICAgIHRoaXMuYm9yZG9GaW5lc3RyYS5vbm1vdXNlZG93biA9IG1vdXNlRG93bkxpc3RlbmVyO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5wb3B1cERpdi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbih3aWR0aCkge1xyXG4gIHRoaXMucG9wdXBEaXYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmNlbnRyYSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBfaXNJRSA9IGlzSUUoKTtcclxuICAgIC8vIGxldCBzY0xlZnQgPSAwO1xyXG4gICAgLy8gbGV0IHNjVG9wID0gMDtcclxuICAgIGxldCBmdWxsSGVpZ2h0ID0gMDtcclxuICAgIGxldCBmdWxsV2lkdGggPSAwO1xyXG4gICAgaWYgKCFpc0lFKCkpIHtcclxuICAgICAgLy8gc2NMZWZ0ID0gcGFnZVhPZmZzZXQ7XHJcbiAgICAgIC8vIHNjVG9wID0gcGFnZVlPZmZzZXQ7XHJcbiAgICAgIGZ1bGxXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjA7XHJcbiAgICAgIGZ1bGxIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgIC8vIElFIDYrIGluICdzdGFuZGFyZHMgY29tcGxpYW50IG1vZGUnXHJcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpKSB7XHJcbiAgICAgIC8vIHNjTGVmdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAvLyBzY1RvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgIGZ1bGxXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgZnVsbEhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgIC8vIElFIDQgY29tcGF0aWJsZVxyXG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgIC8vIHNjTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcclxuICAgICAgLy8gc2NUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgICAgZnVsbFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICAgICAgZnVsbEhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgLy8gaWYgKHNjTGVmdCA8IDApIHtcclxuICAgIC8vICAgc2NMZWZ0ID0gMDtcclxuICAgIC8vIH1cclxuICAgIC8vIGlmIChzY1RvcCA8IDApIHtcclxuICAgIC8vICAgc2NUb3AgPSAwO1xyXG4gICAgLy8gfVxyXG4gICAgaWYgKGZ1bGxIZWlnaHQgPCAyMDApIHtcclxuICAgICAgZnVsbEhlaWdodCA9IHNjcmVlbi5hdmFpbEhlaWdodCAqIC44O1xyXG4gICAgfVxyXG4gICAgaWYgKGZ1bGxXaWR0aCA8IDIwMCkge1xyXG4gICAgICBmdWxsV2lkdGggPSBzY3JlZW4uYXZhaWxXaWR0aCAqIC45O1xyXG4gICAgfVxyXG4gICAgbGV0IHdpblRvcCA9ICAoZnVsbEhlaWdodCAtIHRoaXMuZ2V0SGVpZ2h0KCkpIC8gMjtcclxuICAgIGxldCB3aW5MZWZ0ID0gKGZ1bGxXaWR0aCAtIHRoaXMuZ2V0V2lkdGgoKSkgLyAyO1xyXG4gICAgaWYgKHdpblRvcCA8IDEwKSB7XHJcbiAgICAgIHdpblRvcCA9IDEwO1xyXG4gICAgfVxyXG4gICAgaWYgKHdpbkxlZnQgPCAwKSB7XHJcbiAgICAgIHdpbkxlZnQgPSAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRUb3Aod2luVG9wKTtcclxuICAgIHRoaXMuc2V0TGVmdCh3aW5MZWZ0KTtcclxuICB9IGNhdGNoIChlcnIpIHsgfVxyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLm9zY3VyYUNvbnRlbnV0byA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMucGFubmVsbG9HcmlnaW8uc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUubmFzY29uZGlDb250ZW51dG8gPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxufTtcclxuXHJcblBvcHVwLnByb3RvdHlwZS5tb3N0cmFDb250ZW51dG8gPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnBhbm5lbGxvR3JpZ2lvLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbn07XHJcblxyXG5cclxuUG9wdXAucHJvdG90eXBlLnN0b3BMaXN0ZW5pbmcgPSBmdW5jdGlvbigpIHtcclxuICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7XHJcbiAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcclxuICB0aGlzLm1vc3RyYUNvbnRlbnV0bygpO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmdldElGcmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmNvbnRlbnV0b0ZpbmVzdHJhO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmlzRnJlZXplZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmZyZWV6ZWQ7XHJcbn07XHJcblxyXG5Qb3B1cC5wcm90b3R5cGUuc2V0UmVsb2FkT25DbG9zZSA9IGZ1bmN0aW9uKHJlbG9hZE9uQ2xvc2UpIHtcclxuICB0aGlzLnJlbG9hZE9uQ2xvc2UgPSByZWxvYWRPbkNsb3NlO1xyXG59O1xyXG5cclxuUG9wdXAucHJvdG90eXBlLmdldFJlbG9hZE9uQ2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5yZWxvYWRPbkNsb3NlO1xyXG59O1xyXG5cclxuXHJcblxyXG4vLyBOb3RhOiBpIGxpc3RlbmVyIG5vbiBwb3Nzb25vIGVzc2VyZSBtZW1icmlcclxuXHJcbmZ1bmN0aW9uIG1vdXNlRG93bkxpc3RlbmVyKHRoaXM6IGFueSwgZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICBjb25zdCBwb3B1cCA9IHRoaXMucG9wdXA7XHJcbiAgcG9wdXAubmFzY29uZGlDb250ZW51dG8oKTtcclxuICBwb3B1cC5vZmZYID0gcGFyc2VJbnQocG9wdXAucG9wdXBEaXYuc3R5bGUubGVmdCArIDApIC0gKGlzTlMoKSA/IGV2ZW50LmNsaWVudFggOiBldmVudC5jbGllbnRYKTtcclxuICBwb3B1cC5vZmZZID0gcGFyc2VJbnQocG9wdXAucG9wdXBEaXYuc3R5bGUudG9wICsgMCkgLSAoaXNOUygpID8gZXZlbnQuY2xpZW50WSA6IGV2ZW50LmNsaWVudFkpO1xyXG5cclxuICAvLyB3b3JrYXJvdW5kIHBlciBzZWxlemlvbmUgcG9wdXAgZGEgcGFydGUgZGkgaWVcclxuICBkb2N1bWVudC5ib2R5Lm9uZHJhZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH07XHJcbiAgZG9jdW1lbnQuYm9keS5vbnNlbGVjdHN0YXJ0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfTtcclxuXHJcbiAgZG9jdW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24gbW91c2VVcExpc3RlbmVyKGUpIHtcclxuICAgIHBvcHVwLnN0b3BMaXN0ZW5pbmcoKTtcclxuICB9O1xyXG5cclxuICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIG1vdXNlTW92ZUxpc3RlbmVyKGUpIHtcclxuICAgIGNvbnN0IHhQb3MgPSAoaXNOUygpID8gZS5jbGllbnRYIDogZXZlbnQuY2xpZW50WCkgKyBwb3B1cC5vZmZYO1xyXG4gICAgY29uc3QgeVBvcyA9IChpc05TKCkgPyBlLmNsaWVudFkgOiBldmVudC5jbGllbnRZKSArIHBvcHVwLm9mZlk7XHJcbiAgICBpZiAoeFBvcyA8IDAgfHwgeVBvcyA8IDApIHtcclxuICAgICAgcG9wdXAuc3RvcExpc3RlbmluZygpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwb3B1cC5wb3B1cERpdi5zdHlsZS5sZWZ0ID0geFBvcyArICdweCc7XHJcbiAgICBwb3B1cC5wb3B1cERpdi5zdHlsZS50b3AgPSB5UG9zICsgJ3B4JztcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnZpYUZvcm0ob2JqKSB7XHJcbiAgLy8gU2UgbGEgcG9wdXAgZScgZnJlZXphdGEgbm9uIG5lIGNvbnNlbnRvIGlsIHN1Ym1pdFxyXG4gIC8vIGwndXRlbnRlIGhhIGFwZXJ0byB1bidhbHRyYVxyXG4gIGNvbnN0IHRoaXNQb3B1cCA9IChwYXJlbnQgYXMgYW55KS5Qb3B1cE1hbmFnZXIuUG9wdXBNYW5hZ2VyLmdldEVjbG9zaW5nUG9wdXAob2JqKTtcclxuICBpZiAoIXRoaXNQb3B1cC5pc0ZyZWV6ZWQoKSkge1xyXG4gICAgY29uc3QgcGFubmVsbG9HcmlnaW8gPSBjcmVhUGFubmVsbG9HcmlnaW8oJ3RtcCcsIDk5KTtcclxuICAgIHBhbm5lbGxvR3JpZ2lvLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICBwYW5uZWxsb0dyaWdpby5zdHlsZS5oZWlnaHQgPSBnZXRIZWlnaHQoZG9jdW1lbnQuYm9keSkgKyAncHgnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYW5uZWxsb0dyaWdpbyk7XHJcbiAgICBvYmouZm9ybS5zdWJtaXQoKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNwYWNlcyh2YWxvcmUsIGx1bmdoZXp6YSkge1xyXG4gIGlmICghdmFsb3JlIHx8IHZhbG9yZSA9PSBudWxsKSB7XHJcbiAgICB2YWxvcmUgPSAnJztcclxuICB9XHJcbiAgd2hpbGUgKHZhbG9yZS5sZW5ndGggPCBsdW5naGV6emEpIHtcclxuICAgIHZhbG9yZSArPSAnICc7XHJcbiAgfVxyXG4gIHJldHVybiB2YWxvcmU7XHJcbn1cclxuXHJcbi8vIGRhdG8gdW4gZWxlbWVudG8gZGVsIERPTSBuZSByZXN0aXR1aXNjZSBsYSBwb3NpemlvbmUgeFxyXG5mdW5jdGlvbiBnZXRYUG9zKGNhbXBvKSB7XHJcbiAgbGV0IHhQb3MgPSAwO1xyXG4gIGlmIChjYW1wby5vZmZzZXRQYXJlbnQpIHtcclxuICAgIHdoaWxlICgxKSB7XHJcbiAgICAgIHhQb3MgKz0gY2FtcG8ub2Zmc2V0TGVmdDtcclxuICAgICAgaWYgKCFjYW1wby5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYW1wbyA9IGNhbXBvLm9mZnNldFBhcmVudDtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGNhbXBvLngpIHtcclxuICAgIHhQb3MgKz0gY2FtcG8ueDtcclxuICB9XHJcbiAgcmV0dXJuIHhQb3M7XHJcbn1cclxuXHJcbi8vIGRhdG8gdW4gZWxlbWVudG8gZGVsIERPTSBuZSByZXN0aXR1aXNjZSBsYSBwb3NpemlvbmUgeVxyXG5mdW5jdGlvbiBnZXRZUG9zKGNhbXBvKSB7XHJcbiAgbGV0IHlQb3MgPSAwO1xyXG4gIGlmIChjYW1wby5vZmZzZXRQYXJlbnQpIHtcclxuICAgIHdoaWxlICgxKSB7XHJcbiAgICAgIHlQb3MgKz0gY2FtcG8ub2Zmc2V0VG9wO1xyXG4gICAgICBpZiAoIWNhbXBvLm9mZnNldFBhcmVudCkge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbXBvID0gY2FtcG8ub2Zmc2V0UGFyZW50O1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoY2FtcG8ueSkge1xyXG4gICAgeVBvcyArPSBjYW1wby55O1xyXG4gIH0gcmV0dXJuIHlQb3M7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdpZHRoKGNhbXBvKSB7XHJcbiAgcmV0dXJuIGNhbXBvLmNsaWVudFdpZHRoID8gY2FtcG8uY2xpZW50V2lkdGggOiBjYW1wby53aWR0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SGVpZ2h0KGNhbXBvKSB7XHJcbiAgcmV0dXJuIGNhbXBvLmNsaWVudEhlaWdodCA/IGNhbXBvLmNsaWVudEhlaWdodCA6IGNhbXBvLmhlaWdodDtcclxufVxyXG5cclxuXHJcbi8vIEZhIGNvbXBhcmlyZSB1biBtZXNzYWdnaW8gZGkgdGVzdG8gc290dG8gdW4gZWxlbWVudG8gZGVsIERPTVxyXG5mdW5jdGlvbiB0ZXN0TWVzc2FnZ2lvKGNhbXBvLCBtZXNzYWdnaW8pIHtcclxuICBjb25zdCBtc2cgPSBuZXcgTWVzc2FnZUJveChjYW1wbyk7XHJcbiAgbXNnLnNldE1lc3NhZ2dpbyhtZXNzYWdnaW8pO1xyXG4gIG1zZy5zaG93KCk7XHJcbn1cclxuXHJcbi8vIEluaXppbyBDbGFzc2UgTWVzc2FnZUJveFxyXG4vLyBSYXBwcmVzZW50YSBpbCB0YXN0byBwcmVtdXRvXHJcbmZ1bmN0aW9uIE1lc3NhZ2VCb3godGhpczogYW55LCBjYW1wbykge1xyXG4gIC8vIHRoaXMucGFkcmUgPSBjYW1wby5wYXJlbnROb2RlO1xyXG4gIHRoaXMucGFkcmUgPSBkb2N1bWVudC5ib2R5O1xyXG4gIHRoaXMueFBvcyA9IGdldFhQb3MoY2FtcG8pO1xyXG4gIHRoaXMueVBvcyA9IGdldFlQb3MoY2FtcG8pICsgZ2V0SGVpZ2h0KGNhbXBvKTtcclxuICB0aGlzLnZpc2liaWxlID0gZmFsc2U7XHJcbiAgdGhpcy5tZXNzYWdnaW8gPSAnJztcclxufVxyXG5cclxuTWVzc2FnZUJveC5wcm90b3R5cGUuc2V0TWVzc2FnZ2lvID0gZnVuY3Rpb24obWVzc2FnZ2lvKSB7XHJcbiAgdGhpcy5tZXNzYWdnaW8gPSBtZXNzYWdnaW87XHJcbn07XHJcblxyXG5NZXNzYWdlQm94LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgLy8gYm94LnN0eWxlLnBvc2l0aW9uPSdhYnNvbHV0ZSc7XHJcbiAgLy8gYm94LnN0eWxlLnpJbmRleCA9IDk5O1xyXG4gIC8vIExpIGRvIG5lbCBjbGFzcyBhdHRyaWJ1dGVcclxuICBib3guY2xhc3NOYW1lID0gJ01lc3NhZ2VCb3hTdHlsZUNsYXNzJztcclxuICBib3guc3R5bGUudG9wID0gdGhpcy55UG9zICsgJ3B4JztcclxuICBib3guc3R5bGUubGVmdCA9IHRoaXMueFBvcyArICdweCc7XHJcbiAgLy8gVE9ETzpvbmNsaWNrPWNsb3NlXHJcbiAgYm94LmlubmVySFRNTCA9IHRoaXMubWVzc2FnZ2lvO1xyXG4gIHRoaXMucGFkcmUuYXBwZW5kQ2hpbGQoYm94KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGxlZnRUcmltKHN0cmluZ2EpIHtcclxuICB3aGlsZSAoc3RyaW5nYS5zdWJzdHJpbmcoMCwgMSkgPT09ICcgJykge1xyXG4gICAgc3RyaW5nYSA9IHN0cmluZ2Euc3Vic3RyaW5nKDEsIHN0cmluZ2EubGVuZ3RoKTtcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ2E7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0VHJpbShzdHJpbmdhKSB7XHJcbiAgd2hpbGUgKHN0cmluZ2Euc3Vic3RyaW5nKHN0cmluZ2EubGVuZ3RoIC0gMSwgc3RyaW5nYS5sZW5ndGgpID09PSAnICcpIHtcclxuICAgIHN0cmluZ2EgPSBzdHJpbmdhLnN1YnN0cmluZygwLCBzdHJpbmdhLmxlbmd0aCAtIDEpO1xyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nYTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHJpbShzdHJpbmdhKSB7XHJcbiAgd2hpbGUgKHN0cmluZ2Euc3Vic3RyaW5nKDAsIDEpID09PSAnICcpIHtcclxuICAgIHN0cmluZ2EgPSBzdHJpbmdhLnN1YnN0cmluZygxLCBzdHJpbmdhLmxlbmd0aCk7XHJcbiAgfVxyXG4gIHdoaWxlIChzdHJpbmdhLnN1YnN0cmluZyhzdHJpbmdhLmxlbmd0aCAtIDEsIHN0cmluZ2EubGVuZ3RoKSA9PT0gJyAnKSB7XHJcbiAgICBzdHJpbmdhID0gc3RyaW5nYS5zdWJzdHJpbmcoMCwgc3RyaW5nYS5sZW5ndGggLSAxKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjcmVhUGFubmVsbG9HcmlnaW8oaWQsIHpJbmRleCkge1xyXG4gIGNvbnN0ICBwYW5uZWxsb0dyaWdpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gIHBhbm5lbGxvR3JpZ2lvLmlkID0gaWQ7XHJcbiAgcGFubmVsbG9HcmlnaW8uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIHBhbm5lbGxvR3JpZ2lvLnN0eWxlLmxlZnQgPSAwICsgJ3B4JztcclxuICBwYW5uZWxsb0dyaWdpby5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuICBwYW5uZWxsb0dyaWdpby5zdHlsZS56SW5kZXggPSB6SW5kZXg7XHJcbiAgcGFubmVsbG9HcmlnaW8uc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgcGFubmVsbG9HcmlnaW8uc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gIHBhbm5lbGxvR3JpZ2lvLnN0eWxlLm1heFdpZHRoID0gJzk5dncnO1xyXG4gIHBhbm5lbGxvR3JpZ2lvLnN0eWxlLm1heEhlaWdodCA9ICc5OXZoJztcclxuICBwYW5uZWxsb0dyaWdpby5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzgwODA4MCc7XHJcbiAgaWYgKGlzSUUoKSkge1xyXG4gICAgcGFubmVsbG9HcmlnaW8uc3R5bGUuZmlsdGVyID0gJ2FscGhhKG9wYWNpdHk9JyArIDQwICsgJyknO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwYW5uZWxsb0dyaWdpby5zdHlsZS5vcGFjaXR5ID0gJy40JztcclxuICB9XHJcbiAgcGFubmVsbG9HcmlnaW8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gIHJldHVybiBwYW5uZWxsb0dyaWdpbztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNJRSgpIHtcclxuICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFJykgIT09IC0xO1xyXG59XHJcblxyXG4vLyBOZXRzY2FwZSBvIGZpcmVmb3hcclxuZnVuY3Rpb24gaXNOUygpIHtcclxuICByZXR1cm4gbmF2aWdhdG9yLmFwcE5hbWUuaW5kZXhPZignTmV0c2NhcGUnKSAhPT0gLTE7XHJcbn1cclxuXHJcbi8vIFJpc2FsZSBpbCBkb20gZmlubyBhIHRyb3ZhcmUgbGEgcHJpbWEgb2Njb3JyZW56YSBkaSB1biB0YWdcclxuLy8gbnVtZXJvTGl2ZWxsaSBpbmRpY2EgaWwgbnVtZXJvIGRpIGxpdmVsbGkgZGEgcmlzYWxpcmUsIGRpIGRlZmF1bHQgMVxyXG5mdW5jdGlvbiByaXNhbGlCeVRhZyhvYmosIHRhZywgbnVtZXJvTGl2ZWxsaSkge1xyXG4gIGlmICghbnVtZXJvTGl2ZWxsaSkge1xyXG4gICAgbnVtZXJvTGl2ZWxsaSA9IDE7XHJcbiAgfVxyXG4gIGxldCByZXMgPSBvYmo7XHJcbiAgbGV0IGxpdmVsbG9Db3JyZW50ZSA9IDA7XHJcbiAgd2hpbGUgKHJlcyAmJiByZXMgIT0gbnVsbCAmJiAoIG5ldyBTdHJpbmcocmVzLnRhZ05hbWUpLnRvTG93ZXJDYXNlKCkgIT09IHRhZy50b0xvd2VyQ2FzZSgpIHx8ICsrbGl2ZWxsb0NvcnJlbnRlIDwgbnVtZXJvTGl2ZWxsaSkpIHtcclxuICAgIHJlcyA9IHJlcy5wYXJlbnROb2RlO1xyXG4gIH1cclxuICBpZiAoIXJlcykge1xyXG4gICAgcmVzID0gbnVsbDtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dEJ5VGFnKG9iaiwgdGFnKSB7XHJcbiAgbGV0IHJlcyA9IG9iajtcclxuICB3aGlsZSAocmVzICYmIHJlcyAhPSBudWxsICYmIG5ldyBTdHJpbmcocmVzLnRhZ05hbWUpLnRvTG93ZXJDYXNlKCkgIT09IHRhZy50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICByZXMgPSByZXMubmV4dFNpYmxpbmc7XHJcbiAgfVxyXG4gIGlmICghcmVzKSB7XHJcbiAgICByZXMgPSBudWxsO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyByaW11b3ZlIHVuIGVsZW1lbnRvIGRhbCBkb21cclxuZnVuY3Rpb24gcmltdW92aUVsZW1lbnRvKG9iaikge1xyXG4gIHNldFRpbWVvdXQoXHJcbiAgICBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKG9iaiAmJiBvYmoucGFyZW50Tm9kZSkge1xyXG4gICAgICAgIG9iai5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9iaik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICwgMTAwKTtcclxufVxyXG4vLyBhZGRQb3B1cFNkYWMoJyN7c2VydmxldF91cmx9PyN7cmVjLnVybH0nKTtcclxuXHJcbiJdfQ==