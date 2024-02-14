const println = console.log;

/*
point type is defined as { x: number, y:number }
*/
var plines = []; // type:  point[][]
var points = []; // type: point[]

var svgString = "";
var frame = 4;
var previousSvg = "";

// Dimensions should match the div
const width = 500;
const height = 200;

const svgHeader = "";
// '<?xml version="1.0" encoding="utf-8"?>'+
// '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>`;
const svgPolyline = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">{{POLYLINES}}</svg>`;
const xmlPolyline =
  '<polyline points="{{POINTS}}" fill="none" stroke="black" stroke-width="5"/>';

const pointsToString = (points) =>
  points.map((item) => `${item.x},${item.y}`).join(" ");

const combineCurrentPointSet = (_plines, _points) => {
  return [..._plines, _points];
};

const plinesToSvg = (plines) => {
  if (!plines) return "";

  let plist = "";
  for (var j = 0; j < plines.length; j++) {
    const pline = plines[j];
    if (Array.isArray(pline)) {
      plist += xmlPolyline.replace("{{POINTS}}", pointsToString(pline)) + "\n";
    }
  }

  if (!plist) return "";
  const svg = svgPolyline.replace("{{POLYLINES}}", plist);

  return svg;
};

const svgUpdate = (plines) => {
  if (plines.length === 0) svgString = emptySvg;
  const svg = plinesToSvg(plines);
  if (!svg) return;

  if (previousSvg !== svg) svgString = svg;
  previousSvg = svg;

  const output = document.getElementById("signature_input");
  output.style.backgroundImage = `url(data:image/svg+xml;base64,${btoa(svgString)})`;
};

const canvasUpdate = svgUpdate;

function clearSignature() {
  plines = [];
  points = [];
  const output = document.getElementById("signature_input");
  output.style.backgroundImage = ""
}

function saveSignature() {
  println(previousSvg);
}

function sigMouseMove(evt) {
  if (evt.buttons > 0) {
    xPos = evt.clientX;
    yPos = evt.clientY;

    const pt = { x: xPos, y: yPos };
    points.push(pt);

    if (frame === 4) {
      if (canvasUpdate) canvasUpdate(combineCurrentPointSet(plines, points));
      frame = 0;
    }
    frame++;
  }
}

function sigMouseUp(evt) {
  xPos = evt.clientX;
  yPos = evt.clientY;

  const pt = { x: xPos, y: yPos };
  points.push(pt);
  plines.push(points);
  points = [];
  if (canvasUpdate) canvasUpdate(plines);
}
