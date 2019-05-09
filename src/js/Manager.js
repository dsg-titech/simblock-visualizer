import Mappa from "mappa-mundi";

import Region from "@/js/Region.js";
import Node from "@/js/Node.js";
import Link from "@/js/Link.js";
import Block from "@/js/Block.js";

import staticData from "@/assets/static.json";
import dynamicData from "@/assets/output.json";

export default class Manager {
  constructor(ctx) {
    this.ctx = ctx;
    this._initWorldMap();
    this._loadStaticData();
    this._loadDynamicData();
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

  updateTimeStep(step) {
    this.step = step;
  }

  getTimestamp() {
    return this.timestamps[this.step];
  }

  _initWorldMap() {
    const mappa = new Mappa("Leaflet");
    this.worldMap = mappa.tileMap({
      lat: 0,
      lng: 0,
      zoom: 2,
      style: "https://{s}.tile.osm.org/{z}/{x}/{y}.png"
    });
    this.worldMap.overlay(this.ctx.canvas);

    const disableZoom = () => {
      if (typeof this.worldMap.map === "undefined") {
        setTimeout(disableZoom, 100);
        return;
      }
      // workaround
      const map = this.worldMap.map;
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.zoomControl.remove();
    };
    disableZoom();
  }

  _loadStaticData() {
    this.regions = [];
    for (const value of staticData.region) {
      this.regions[value["id"]] = new Region(
        this.worldMap,
        value["id"],
        value["name"]
      );
    }
  }

  _loadDynamicData() {
    this.timestamps = [];
    let lastTimestamp = -1;
    const f = (content, label) => {
      if (content.hasOwnProperty(label)) {
        const timestamp = content[label];
        if (timestamp < lastTimestamp) {
          console.warn("Unexpected timestamp order");
          return;
        }
        if (timestamp === lastTimestamp) {
          return;
        }
        this.timestamps.push((lastTimestamp = timestamp));
      }
    };
    for (const value of dynamicData) {
      const content = value["content"];
      f(content, "timestamp");
      f(content, "reception-timestamp");
    }

    this.nodes = [];
    this.links = [];
    const blocks = [];
    for (const value of dynamicData) {
      const content = value["content"];
      switch (value["kind"]) {
        case "add-node":
          {
            this.nodes[content["node-id"]] = new Node(
              this.worldMap,
              content["timestamp"],
              content["node-id"],
              this.regions[content["region-id"]]
            );
          }
          break;
        case "add-link":
          {
            this.links.push(
              new Link(
                this.worldMap,
                content["timestamp"],
                this.nodes[content["begin-node-id"]],
                this.nodes[content["end-node-id"]]
              )
            );
          }
          break;
        case "add-block":
          {
            const block = new Block(
              this.worldMap,
              content["timestamp"],
              content["block-id"],
              this.nodes[content["node-id"]]
            );
            blocks[parseInt(content["block-id"])] = block;
            block.flow(
              this.nodes[content["node-id"]],
              content["timestamp"],
              content["timestamp"]
            );
          }
          break;
        case "flow-block":
          {
            const block = blocks[parseInt(content["block-id"])];
            block.flow(
              this.nodes[content["end-node-id"]],
              content["transmission-timestamp"],
              content["reception-timestamp"]
            );
          }
          break;
        case "simulation-end":
          {
            //
          }
          break;
        default: {
          console.warn("Unexpected value: ", value);
        }
      }
    }
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
