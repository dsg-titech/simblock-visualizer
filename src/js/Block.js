export default class Block {
  constructor(worldMap, buildingTimestamp, id, ownerNode) {
    this.worldMap = worldMap;
    this.buildingTimestamp = buildingTimestamp;
    this.id = id;
    this.ownerNode = ownerNode;
    this.receivingTimestamp = buildingTimestamp;
  }

  flow(targetNode, sendingTimestamp, receivingTimestamp) {
    const block = new Block(
      this.worldMap,
      this.buildingTimestamp,
      this.id,
      this.ownerNode
    );
    block.receivingTimestamp = receivingTimestamp;
    targetNode.blockList.push(block);
  }
}
