class Resources extends Application {
    isOpen = false;
    content = "";

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/sfrpg-houserules-raavi/templates/resources.html";
        options.popOut = false;
        options.resizable = false;
        return options;
    }

    setPos(pos) {
        return new Promise(resolve => {
            function check() {
                let elmnt = document.getElementById("resources-disp-container");
                if (elmnt) {
                    elmnt.style.bottom = null;
                    let xPos = (pos.left) > window.innerWidth ? window.innerWidth - 200 : pos.left;
                    let yPos = (pos.top) > window.innerHeight - 20 ? window.innerHeight - 100 : pos.top;
                    elmnt.style.top = (yPos) + "px";
                    elmnt.style.left = (xPos) + "px";
                    elmnt.style.position = 'fixed';
                    elmnt.style.zIndex = 100;
                    resolve();
                } else {
                    setTimeout(check, 30);
                }
            }

            check();
        });
    }

    loadSettings() {
        let flag = game.user.getFlag('sfrpg-houserules-raavi', 'resourcesDisplay');
        if (flag !== undefined && flag !== null) {
            let pos = flag.resourcesPos;
            this.setPos(pos);
        }
    }

    resetPos() {
        let pos = {bottom: 8, left: 15}
        return new Promise(resolve => {
            function check() {
                let elmnt = document.getElementById("resources-disp-container");
                if (elmnt) {
                    console.log('resources-display | Resetting Resources Display Position');
                    elmnt.style.top = null;
                    elmnt.style.bottom = (pos.bottom) + "%";
                    elmnt.style.left = (pos.left) + "%";
                    let pos = {top: elmnt.offsetTop, left: elmnt.offsetLeft};
                    game.user.update({flags: {'sfrpg-houserules-raavi': {'resourcesDisplay': {'resourcesPos': pos}}}});
                    elmnt.style.bottom = null;
                    resolve();
                } else {
                    setTimeout(check, 30);
                }
            }

            check();
        })
    }

    async toggleResources() {
        console.log('resources-display | Toggling Resources Display.');
        let templatePath = "modules/sfrpg-houserules-raavi/templates/resources.html";
        if (this.isOpen) {
            this.isOpen = false;
            await this.close();
        } else {
            this.isOpen = true;

            this.content = await renderTemplate(templatePath, localData.starshipResources);
            await this.render(true);
        }
    }

    updateDisplay() {
        for (let prop in localData.starshipResources) {
            let element = document.getElementById("resources-" + prop);
            if (localData.starshipResources[prop].max <= 0) {
                element.innerHTML = parseInt(localData.starshipResources[prop].value).toLocaleString('ru-RU') + " " + element.dataset.resunit;
            } else {
                element.innerHTML = parseInt(localData.starshipResources[prop].value).toLocaleString('ru-RU') + " " + element.dataset.resunit + " / " +
                    parseInt(localData.starshipResources[prop].max).toLocaleString('ru-RU') + " " + element.dataset.resunit;
            }
        }
    }

    toObject() {
        return {
            isOpen: this.isOpen
        }
    }

    async createDialog(type, data) {
        let updateRes = false;
        let dialogContent = await renderTemplate("modules/sfrpg-houserules-raavi/templates/resource-mod-dialog.html", {resource: data});

        new Dialog({
            title: `Modify resource: ` + type,
            content: dialogContent,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: "Update",
                    callback: () => (updateRes = true),
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: "Cancel",
                    callback: () => (updateRes = false),
                }
            },
            default: "yes",
            close: async (html) => {
                if (updateRes) {
                    await this.updateResources(type, html);
                    this.updateDisplay();
                }
            },
        }).render(true);
    }

    async updateResources(type, html) {
        let newValue = parseInt(html.find('[id=resource-value]')[0].value);
        let newMax = parseInt(html.find('[id=resource-max]')[0].value);

        localData.starshipResources[type] = {value: newValue, max: newMax};
        await updateDataInSettings("starshipResources", localData.starshipResources);
    }

    activateListeners(html) {
        const displays = '.resDisp';
        const resourcesMove = '#resources-move';

        html.find(displays).click(async ev => {
            ev.preventDefault();
            if (game.user.isGM) {
                let resName = ev.target.dataset.resname;
                if (resName !== undefined && resName !== null) {
                    await this.createDialog(resName, localData.starshipResources[resName]);
                }
            }
        });

        html.find(resourcesMove).mousedown(async ev => {
            ev.preventDefault();
            ev = ev || window.event;
            let isRightMB = false;
            if ("which" in ev) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                isRightMB = ev.which === 3;
            } else if ("button" in ev) { // IE, Opera
                isRightMB = ev.button === 2;
            }

            if (!isRightMB) {
                dragElement(document.getElementById("resources-disp-container"));
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                function dragElement(elmnt) {
                    elmnt.onmousedown = dragMouseDown;

                    function dragMouseDown(e) {
                        e = e || window.event;
                        e.preventDefault();
                        pos3 = e.clientX;
                        pos4 = e.clientY;

                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // set the element's new position:
                        elmnt.style.bottom = null
                        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                        elmnt.style.position = 'fixed';
                        elmnt.style.zIndex = 100;
                    }

                    function closeDragElement() {
                        // stop moving when mouse button is released:
                        elmnt.onmousedown = null;
                        document.onmouseup = null;
                        document.onmousemove = null;
                        let xPos = (elmnt.offsetLeft - pos1) > window.innerWidth ? window.innerWidth - 200 : (elmnt.offsetLeft - pos1);
                        let yPos = (elmnt.offsetTop - pos2) > window.innerHeight - 20 ? window.innerHeight - 100 : (elmnt.offsetTop - pos2)
                        xPos = xPos < 0 ? 0 : xPos;
                        yPos = yPos < 0 ? 0 : yPos;
                        if (xPos !== (elmnt.offsetLeft - pos1) || yPos !== (elmnt.offsetTop - pos2)) {
                            elmnt.style.top = (yPos) + "px";
                            elmnt.style.left = (xPos) + "px";
                        }

                        let pos = {top: yPos, left: xPos};
                        game.user.update({flags: {'sfrpg-houserules-raavi': {'resourcesDisplay': {'resourcesPos': pos}}}});
                    }
                }
            } else if (isRightMB) {
                await this.resetPos();
            }
        });
    }
}