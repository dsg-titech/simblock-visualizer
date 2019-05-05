import Mappa from "mappa-mundi";

import Region from "@/js/Region.js";
import Node from "@/js/Node.js";
import Link from "@/js/Link.js";
import Block from "@/js/Block.js";

import staticData from "@/assets/static.json";
import dynamicData from "@/assets/output.json";

export default class Manager {
  constructor(ctx) {
    this.loadStaticData();
    this.loadDynamicData();
    this.ctx = ctx;
    const mappa = new Mappa("Leaflet");
    this.worldMap = mappa.tileMap({
      lat: 0,
      lng: 0,
      zoom: 2,
      style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
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

  run() {
    const draw = () => {
      if (typeof this.ctx === "undefined") return;
      this.ctx.clearRect(
        0,
        0,
        this.ctx.canvas.clientWidth,
        this.ctx.canvas.clientHeight
      );
      this.nodes.forEach(node =>
        node.draw(this.ctx, this.worldMap, this.timestamps[this.step])
      );
    };
    setInterval(draw, 100);

    const move = () => {
      //
    };
    setInterval(move, 33);
  }

  // initData() {
  //   const timestamp = this.timestamps[0];
  //   const mapData = [];
  //   for (const node of this.nodes) {
  //     if (typeof node === "undefined") continue;
  //     mapData.push(node.makeCircle(this.chart, timestamp));
  //   }
  // }

  updateTimeStep(step) {
    this.step = step;
  }

  loadStaticData() {
    this.regions = [];
    for (const value of staticData.region) {
      this.regions[value["id"]] = new Region(value["id"], value["name"]);
    }
  }

  loadDynamicData() {
    this.timestamps = [];
    let lastTimestamp = -1;
    for (const value of dynamicData) {
      const content = value["content"];
      if (content.hasOwnProperty("timestamp")) {
        const timestamp = content["timestamp"];
        if (timestamp < lastTimestamp) {
          console.warn("Unexpected timestamp order");
          break;
        }
        if (timestamp === lastTimestamp) continue;
        this.timestamps.push((lastTimestamp = timestamp));
      }
      // TODO: reception-timestamp
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
              content["timestamp"],
              parseInt(content["block-id"]),
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
        case "simulation_end":
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
}
