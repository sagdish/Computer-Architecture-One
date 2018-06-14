const RAM = require('./ram');
const CPU = require('./cpu');

const fs = require('fs');

const file = process.argv 

if (file.length !== 3) {
  console.error("error, please provide a file: <filename>.ls8");
  process.exit(1);
}
const fileName = file[2];

const filedata = fs.readFileSync(fileName, "utf8");

const arr = filedata.trim().split(/[\r\n\s\D]+/g).filter(item => {
  return item.length === 8;
});


/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < arr.length; i++) {
        cpu.poke(i, parseInt(arr[i], 2));
    }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();