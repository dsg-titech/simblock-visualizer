export default class Block {
  constructor(buildingTimestamp, id, ownerNode) {
    this.buildingTimestamp = buildingTimestamp;
    this.id = id;
    this.ownerNode = ownerNode;
    this.receivingTimestamp = buildingTimestamp;
  }

  flow(targetNode, receivingTimestamp) {
    const block = new Block(this.buildingTimestamp, this.id, this.ownerNode);
    block.receivingTimestamp = receivingTimestamp;
    targetNode.blockList.push(block);
  }
}
