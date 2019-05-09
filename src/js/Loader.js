import Region from "@/js/Region.js";
import Node from "@/js/Node.js";
import Link from "@/js/Link.js";
import Block from "@/js/Block.js";

export default class Loader {
  constructor(worldMap) {
    this.worldMap = worldMap;
  }

  load(staticData, dynamicData) {
    this.loadSuccess = true;
    this._loadStaticData(staticData);
    this._loadDynamicData(dynamicData);
    return {
      success: this.loadSuccess,
      regions: this.regions,
      timestamps: this.timestamps,
      nodes: this.nodes,
      links: this.links
    };
  }

  _loadStaticData(staticData) {
    this.regions = [];
    for (const value of staticData.region) {
      this.regions[value["id"]] = new Region(
        this.worldMap,
        value["id"],
        value["name"]
      );
    }
  }

  _loadDynamicData(dynamicData) {
    if (typeof dynamicData[Symbol.iterator] !== "function") {
      this._fail("Unexpected format for dynamic data");
      return;
    }

    this.timestamps = [];
    let lastTimestamp = -1;
    const f = (content, label) => {
      if (content.hasOwnProperty(label)) {
        const timestamp = content[label];
        if (timestamp < lastTimestamp) {
          this._fail("Unexpected timestamp order");
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
              this.nodes[content["begin-node-id"]],
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
          this._fail("Unexpected value: ", value);
        }
      }
    }
  }

  _fail(message, ...args) {
    this.loadSuccess = false;
    console.warn(message, args);
  }
}
