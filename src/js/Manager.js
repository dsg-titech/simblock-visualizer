import Region from "@/js/Region.js";
import Node from "@/js/Node.js";
import Link from "@/js/Link.js";
import Block from "@/js/Block.js";

import regionData from "@/assets/region.json";
import dynamicData from "@/assets/sample.json";

export default class Manager {
  constructor(map) {
    this.map = map;
    this.loadRegionData();
    this.loadDynamicData();
  }

  loadRegionData() {
    this.regions = [];
    for (let value of regionData) {
      const content = value["content"];
      switch (value["kind"]) {
        case "region":
          {
            this.regions[content.id] = new Region(content.id, content.name);
          }
          break;
        default: {
          console.warn("Unexpected value: ", value);
        }
      }
    }
  }

  loadDynamicData() {
    this.nodes = [];
    this.links = [];
    const blocks = [];
    for (let value of dynamicData) {
      const content = value["content"];
      switch (value["kind"]) {
        case "add-node":
          {
            this.nodes[content["node-id"]] = new Node(
              content["timestamp"],
              content["node-id"],
              this.regions[content["area-id"]]
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
              content["block-id"],
              this.nodes[content["node-id"]]
            );
            blocks[content["block-id"]] = block;
            block.flow(
              this.nodes[content["node-id"]],
              content["timestamp"]
            );
          }
          break;
        case "flow-block":
          {
            const block = blocks[content["block-id"]];
            block.flow(
              this.nodes[content["end-node-id"]],
              content["timestamp"]
            );
          }
          break;
        default: {
          console.warn("Unexpected value: ", value);
        }
      }
    }
  }
}
