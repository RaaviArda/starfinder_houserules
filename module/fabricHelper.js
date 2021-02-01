function generateCanvasContents() {
    starMapCoords = createText(1070, 819);
    starMapCanvas.add(starMapCoords);
    starMapSysName = createText(1070, 799);
    starMapCanvas.add(starMapSysName);

    starMapFuelCost = createText(1070, 759);
    starMapFuelCost.text = '';
    starMapFuelCost.fill = '#FF0000';
    starMapCanvas.add(starMapFuelCost);
    starMapCreditCost = createText(1070, 779);
    starMapCreditCost.text = '';
    starMapCreditCost.fill = '#00FF00';
    starMapCanvas.add(starMapCreditCost);

    let shiplineX = makeLine([localDataSFRPG.currentSystem.cx, 0, localDataSFRPG.currentSystem.cx, 828], '#FF0000');
    shiplineX.stroke = '#FF0000';
    shiplineX.strokeWidth = 1;
    starMapCanvas.add(shiplineX);
    let shiplineY = makeLine([0, localDataSFRPG.currentSystem.cy, 1080, localDataSFRPG.currentSystem.cy], '#FF0000');
    shiplineY.stroke = '#FF0000';
    shiplineY.strokeWidth = 1;
    starMapCanvas.add(shiplineY);
}

function makeLine(starMapCoords, color) {
    return new fabric.Line(starMapCoords, {
        fill: color,
        stroke: color,
        strokeWidth: 3,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center'
    });
}

function makeJumpLine(starMapCoords, aboveMax) {
    let colorFill = '#00FF00';
    if (aboveMax) {
        colorFill = '#FF0000';
    }
    let line = makeLine(starMapCoords, colorFill);
    line.jump = true;
    return line;
}

function makeTargetLine(starMapCoords) {
    return makeLine(starMapCoords, "#00FF00");
}

function makeCircle(x, y, owner, contestant, systemid, systemname) {
    let tmp = new fabric.Circle({
        radius: 15,
        fill: owner,
        strokeWidth: 1,
        stroke: '#FF0000',
        originX: 'center',
        originY: 'center',
        selectable: false,
        top: y,
        left: x,
        systemname: systemname,
        systemid: systemid,
        hoverCursor: 'pointer'
    });
    if (contestant != null) {
        tmp.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: tmp.width,
            y2: 0,
            colorStops: {
                0: owner,
                0.5: owner,
                0.51: contestant,
                1: contestant
            }
        });
    }
    return tmp;
}

function makePolygon(x, y, owner, contestant, systemid, systemname, sides) {
    let points = regularPolygonPoints(sides, 17);

    let tmp = new fabric.Polygon(points, {
        stroke: '#FF0000',
        fill: owner,
        left: x,
        top: y,
        strokeWidth: 1,
        strokeLineJoin: 'bevil',
        originX: 'center',
        originY: 'center',
        selectable: false,
        systemname: systemname,
        systemid: systemid,
        hoverCursor: 'pointer'
    }, false);

    if (contestant != null) {
        tmp.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: tmp.width,
            y2: 0,
            colorStops: {
                0: owner,
                0.5: owner,
                0.51: contestant,
                1: contestant
            }
        });
    }

    return tmp;
}

function regularPolygonPoints(sideCount, radius) {
    let sweep = Math.PI * 2 / sideCount;
    let cx = radius;
    let cy = radius;
    let points = [];
    for (let i = 0; i < sideCount; i++) {
        let x = cx + radius * Math.cos(i * sweep);
        let y = cy + radius * Math.sin(i * sweep);
        points.push({
            x: x,
            y: y
        });
    }
    return (points);
}

function createText(x, y) {
    return new fabric.Text('', {
        left: x,
        top: y,
        fontFamily: 'Lucida Console',
        textAlign: 'right',
        originX: 'right',
        originY: 'bottom',
        fontSize: 20,
        fill: '#FFFFFF',
        selectable: false
    });
}

function updatestarMapCoords(e) {
    if (e.target != null && e.target.systemname != null) {
        let x = e.target.getCenterPoint().x;
        let y = e.target.getCenterPoint().y;
        starMapCoords.text = x + ';' + y;
        if (game.user.isGM) {
            starMapSysName.text = e.target.systemname + ' [' + e.target.systemid + ']';
        } else {
            starMapSysName.text = e.target.systemname;
        }


        removeJumpLines();
        calcRouteToSystem(e.target.systemid, true);
        starMapCanvas.remove(selSysX);
        starMapCanvas.remove(selSysY);
        selSysX = makeTargetLine([x, 0, x, 828]);
        selSysY = makeTargetLine([0, y, 1080, y]);
        starMapCanvas.add(selSysX);
        starMapCanvas.add(selSysY);
        starMapCanvas.renderAll();
    } else {
        let x = e.e.layerX;
        let y = e.e.layerY;
        starMapCoords.text = x + ';' + y;
        starMapSysName.text = '';
        starMapFuelCost.text = '';
        starMapCreditCost.text = '';
    }
    starMapCanvas.renderAll();
}

async function selectSystem(e) {
    if (e.target != null && e.target.systemid != null) {
        await showSystem(e.target.systemid);
    }
}

function removeJumpLines() {
    let objects = starMapCanvas.getObjects('line');
    for (let i in objects) {
        if (objects[i].jump === true) {
            starMapCanvas.remove(objects[i]);
        }
    }
    starMapCanvas.renderAll();
}