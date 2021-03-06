/**
 * LS-8 v2.0 emulator skeleton code
 */

const LDI = 0b10011001;
const PRN = 0b01000011;
const MUL = 0b10101010;
const HLT = 0b00000001;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const RET = 0b00001001;
const ADD = 0b10101000;

const CMP = 0b10100000;
const JMP = 0b01010000;
const JEQ = 0b01010001;
const JNE = 0b01010010;

const SP = 7;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        this.reg[SP] = 0xf4; //244
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.L = 0;
        this.G = 0;
        this.E = 0;
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
      switch (op) {
        case 'MUL':
          this.reg[regA] *= this.reg[regB] & 0xff;
          break;
          
        case 'ADD':
          this.reg[regA] += this.reg[regB] & 0xff;
          break;
      }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        let IR = this.ram.read(this.PC);

        // !!! IMPLEMENT ME

        // Debugging output
        //console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);
        let nextIns = true;
        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        
        //console.log(IR);
        switch(IR) {
          case LDI:
            this.reg[operandA] = operandB;
            //console.log(this.reg[operandA]);
            //this.PC += 3;
            break;
            
          case MUL:
            this.alu("MUL", operandA, operandB);
            break;
            
          case ADD:
            this.alu("ADD", operandA, operandB);
            // if (!nextIns) {
            //   nextIns = true;
            // }
            break;
            
          case PRN:
            console.log(this.reg[operandA]);
            //this.PC += 2;
            break;
            
          case HLT:
            this.stopClock();
            //this.PC += 1;
            break;
            
          case PUSH:
            this.reg[SP]--;
            this.ram.write(this.reg[SP], this.reg[operandA]);
            break;
          
          case POP:
            this.reg[operandA] = this.ram.read(this.reg[SP])
            this.reg[SP]++;
            break;
            
          case CMP:
            if (this.reg[operandA] === this.reg[operandB]) {
              this.E = 1;
            } else if (this.reg[operandA] < this.reg[operandB]) {
              this.L = 1;
            } else if (this.reg[operandA] > this.reg[operandB]) {
              this.G = 1;
            }
            break;
            
          case JMP:
            this.PC = this.reg[operandA];
            nextIns = false;
            break;
            
          case JEQ:
            if (this.E === 1) {
              this.PC = this.reg[operandA];
              nextIns = false;
            }
            break;
            
          case JNE:
            if (this.E === 0) {
              this.PC = this.reg[operandA];
              nextIns = false;
            }
            break;
            
          case CALL:
            this.reg[SP]--;
            this.ram.write(this.reg[SP], this.PC + 2);
            //console.log(this.PC+2);
            //console.log(this.ram[this.reg[SP]]);
            this.PC = this.reg[operandA];
            
            nextIns = false;
            break;
            
          case RET:
            this.PC = this.ram.read(this.reg[SP]);
            this.reg[SP]--;
            //console.log('this.PC ', this.PC);
            break;
            
          default:
            console.log("unknown instruction: " + IR.toString(2));
            this.stopClock();
            return;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
        if (nextIns) {
          const instLen = (IR >> 6) + 1;
          this.PC += instLen;
        }
    }
}

module.exports = CPU;
