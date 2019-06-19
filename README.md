# SimBlock Visualizer

An online visualizer for SimBlock.

SimBlock is a blockchain network simulator, whose web site is [here](https://dsg-titech.github.io/simblock/).

![](/public/demo.png)

## Usage

This visualizer is available from:
- https://dsg-titech.github.io/simblock-visualizer/

You can see the visualization by uploading `output.json` via the UPLOAD button.
- `output.json`, one of the SimBlock's output files, is listing occurred events during a simulation.
- If no files have been uploaded yet, this visualizer displays the visualization for the default output file as a demonstration.
- Note: This visualizer supports only the default setting for a list of regions ― `BlockChainSimulator.settings.NetworkConfiguration#REGION_LIST`.

The correspondence of each visible object is as follows:
- Circle: a blockchain node.
    - The coordinates (latitude and longitude) are randomly determined around the region of the node.
    - The color is associated with the latest block of the node.
- Large circle: a miner of the block corresponding to the color.
- Edge: a propagation from a node to another node at the timestamp.

## For developers

#### Setup

```sh
$ yarn install
```

#### Compiles and hot-reloads

```sh
$ yarn serve
```

#### Files for SimBlock

There are the default output files of SimBlock in:
- `src/assets/static.json`
- `src/assets/output.json`

## License

[Apache License 2.0](LICENSE)

Copyright 2019, Distributed Systems Group

## Contact

E-mail: dsg-titech at googlegroups.com
