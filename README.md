SimBlock Visualizer
===

[![Build Status](https://travis-ci.com/dsg-titech/simblock-visualizer.svg?branch=master)](https://travis-ci.com/dsg-titech/simblock-visualizer)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub version](https://badge.fury.io/gh/dsg-titech%2Fsimblock-visualizer.svg)](https://badge.fury.io/gh/dsg-titech%2Fsimblock-visualizer)

An online visualizer for SimBlock.

SimBlock is a blockchain network simulator, whose web site is [here](https://dsg-titech.github.io/simblock/).

![](/public/screenshot.png)

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
    - The color is associated with the flowing block.
    - Bold edge: a propagation just received at the timestamp.

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

## Changelog

### [v1.1.0](https://github.com/dsg-titech/simblock-visualizer/tree/v1.1.0) ― 2019-07-09

- Draw each propagation not only at the timestamp of the block reception, but between the transmission and the reception.

### [v1.0.0](https://github.com/dsg-titech/simblock-visualizer/tree/v1.0.0) ― 2019-06-27

- Make this repository public.
