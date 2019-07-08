export default class Block {
  constructor(worldMap, buildingTimestamp, id, ownerNode) {
    this.worldMap = worldMap;
    this.buildingTimestamp = buildingTimestamp;
    this.id = id;
    this.ownerNode = ownerNode;
    this.sendingTimestamp = buildingTimestamp;
    this.receivingTimestamp = buildingTimestamp;
    this.fromNode = null;
  }

  flow(fromNode, toNode, sendingTimestamp, receivingTimestamp) {
    const block = new Block(
      this.worldMap,
      this.buildingTimestamp,
      this.id,
      this.ownerNode
    );
    block.sendingTimestamp = sendingTimestamp;
    block.receivingTimestamp = receivingTimestamp;
    block.fromNode = fromNode;
    toNode.blockList.push(block);
  }
}
