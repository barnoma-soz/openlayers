import Feature from '../src/ol/Feature.js';
import Map from '../src/ol/Map.js';
import Point from '../src/ol/geom/Point.js';
import TileJSON from '../src/ol/source/TileJSON.js';
import VectorSource from '../src/ol/source/Vector.js';
import View from '../src/ol/View.js';
import {Icon, Style} from '../src/ol/style.js';
import {Tile as TileLayer, Vector as VectorLayer} from '../src/ol/layer.js';

const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const clearWidthButton = document.getElementById('clear-width-button');
const clearHeightButton = document.getElementById('clear-height-button');
const scaleSpan = document.getElementById('scale');

const iconFeature = new Feature({
  geometry: new Point([0, 0]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500,
});
const iconStyle = new Style({
  image: new Icon({
    src: 'data/icon.png',
    width: Number(widthInput.value),
    height: Number(heightInput.value),
  }),
});
iconFeature.setStyle(iconStyle);

const image = iconStyle.getImage().getImage();
image.addEventListener('load', () => {
  scaleSpan.innerText = formatScale(iconStyle.getImage().getScale());
});

widthInput.addEventListener('input', (event) => {
  const currentIcon = iconStyle.getImage();
  iconStyle.setImage(
    new Icon({
      src: 'data/icon.png',
      width: Number(event.target.value),
      height: currentIcon.getHeight(),
    })
  );
  iconFeature.setStyle(iconStyle);
  scaleSpan.innerText = formatScale(iconStyle.getImage().getScale());
});
heightInput.addEventListener('input', (event) => {
  const currentIcon = iconStyle.getImage();
  iconStyle.setImage(
    new Icon({
      src: 'data/icon.png',
      height: Number(event.target.value),
      width: currentIcon.getWidth(),
    })
  );
  iconFeature.setStyle(iconStyle);
  scaleSpan.innerText = formatScale(iconStyle.getImage().getScale());
});
clearWidthButton.addEventListener('click', () => {
  const currentIcon = iconStyle.getImage();
  iconStyle.setImage(
    new Icon({
      src: 'data/icon.png',
      height: currentIcon.getHeight(),
    })
  );
  iconFeature.setStyle(iconStyle);
  widthInput.value = Math.round(iconStyle.getImage().getWidth());
  scaleSpan.innerText = formatScale(iconStyle.getImage().getScale());
  iconFeature.changed();
});
clearHeightButton.addEventListener('click', () => {
  const currentIcon = iconStyle.getImage();
  iconStyle.setImage(
    new Icon({
      src: 'data/icon.png',
      width: currentIcon.getWidth(),
    })
  );
  iconFeature.setStyle(iconStyle);
  heightInput.value = Math.round(iconStyle.getImage().getHeight());
  scaleSpan.innerText = formatScale(iconStyle.getImage().getScale());
  iconFeature.changed();
});

const vectorSource = new VectorSource({
  features: [iconFeature],
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
  source: new TileJSON({
    url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
    crossOrigin: '',
  }),
});

new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 3,
  }),
});

function formatScale(scale) {
  return Array.isArray(scale)
    ? '[' + scale?.map((v) => v.toFixed(2)).join(', ') + ']'
    : scale;
}
