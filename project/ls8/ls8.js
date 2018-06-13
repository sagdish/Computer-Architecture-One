const RAM = require('./ram');
const CPU = require('./cpu');

const fs = require('fs');

const file = process.argv 

if (file.length !== 3) {
  console.error("error: please provide a file");
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

    // Hardcoded program to print the number 8 on the console

    const program = [ // print8.ls8
        // "10011001", // LDI R0,8  Store 8 into R0
        // "00000000",
        // "00001000",
        // "01000011", // PRN R0    Print the value in R0
        // "00000000",
        // "00000001"  // HLT       Halt and quit
    
        // mult.ls8
        '10011001', // LDI R0,8
        '00000000',
        '00001000',
        '10011001', // LDI R1,9
        '00000001',
        '00001001',
        '10101010', // MUL R0,R1 <---
        '00000000',
        '00000001',
        '01000011', // PRN R0
        '00000000',
        '00000001' // HLT
    ];

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