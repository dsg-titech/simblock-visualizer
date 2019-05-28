import Mappa from "mappa-mundi";

import Loader from "@/js/Loader.js";

import defaultStaticData from "@/assets/static.json";
import defaultDynamicData from "@/assets/output.json";

export default class Manager {
  constructor(ctx) {
    this.ctx = ctx;
    this._initWorldMap();
    this.loadCallbacks = [];
    this.loader = new Loader(this.worldMap);
    this.load(defaultStaticData, defaultDynamicData);
  }

  run() {
    const draw = () => {
      this.ctx.clearRect(
        0,
        0,
        this.ctx.canvas.clientWidth,
        this.ctx.canvas.clientHeight
      );
      this.nodes.forEach(node => node.draw(this.ctx, this.getTimestamp()));
      this.links.forEach(link => link.draw(this.ctx, this.getTimestamp()));
    };
    setInterval(draw, 100);
    this.worldMap.onChange(draw);

    this.selectedNode = null;

    this.ctx.canvas.addEventListener("mousedown", () => {
      if (this.selectedNode !== null) {
        this.selectedNode.unselect();
        this.selectedNode = null;
      }
    });
    window.addEventListener("mouseup", event => {
      const offsetX = this.ctx.canvas.getBoundingClientRect().left;
      const offsetY = this.ctx.canvas.getBoundingClientRect().top;
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
      const node = this._getCollidedNode(x, y);
      if (node !== null) {
        node.select();
        this.selectedNode = node;
        console.log(node); // DEBUG
      }
    });
  }

  load(staticData, dynamicData) {
    const result = this.loader.load(staticData, dynamicData);
    if (result.success) {
      this.timestamps = result.timestamps;
      this.nodes = result.nodes;
      this.links = result.links;
      for (const callback of this.loadCallbacks) {
        callback();
      }
    }
    return result.success;
  }

  loadDynamicData(dynamicData) {
    return this.load(defaultStaticData, dynamicData);
  }

  updateTimeStep(step) {
    this.step = step;
  }

  getTimestamp() {
    return this.timestamps[this.step];
  }

  setLoadCallback(callback) {
    this.loadCallbacks.push(callback);
  }

  _initWorldMap() {
    const mappa = new Mappa("Leaflet");
    this.worldMap = mappa.tileMap({
      lat: 0,
      lng: 0,
      zoom: 2,
      style: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    });
    this.worldMap.overlay(this.ctx.canvas);

    const disableZoom = () => {
      if (typeof this.worldMap.map === "undefined") {
        setTimeout(disableZoom, 100);
        return;
      }
      const map = this.worldMap.map;
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    };

    const clampZoom = () => {
      if (typeof this.worldMap.map === "undefined") {
        setTimeout(clampZoom, 100);
        return;
      }
      const map = this.worldMap.map;
      map.options.minZoom = 1;
      map.options.maxZoom = 3;
    };

    const addAttribution = () => {
      if (typeof this.worldMap.map === "undefined") {
        setTimeout(addAttribution, 100);
        return;
      }
      const map = this.worldMap.map;
      map.attributionControl.addAttribution(
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      );
    };

    disableZoom();
    clampZoom();
    addAttribution();
  }

  _getCollidedNode(mouseX, mouseY) {
    const timestamp = this.getTimestamp();
    for (const node of this.nodes) {
      if (typeof node === "undefined") continue;
      if (node.collide(mouseX, mouseY, timestamp)) {
        return node;
      }
    }
    return null;
  }
}
