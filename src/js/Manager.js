import Region from "@/js/Region.js";
import Node from "@/js/Node.js";
import Link from "@/js/Link.js";
import Block from "@/js/Block.js";

import staticData from "@/assets/static.json";
import dynamicData from "@/assets/output.json";

export default class Manager {
  constructor(map) {
    this.map = map;
    this.loadStaticData();
    this.loadDynamicData();
  }

  loadStaticData() {
    this.regions = [];
    for (let value of staticData.region) {
      this.regions[value["id"]] = new Region(value["id"], value["name"]);
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
