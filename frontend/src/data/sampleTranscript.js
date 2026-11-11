
const sampleTranscript = [
  {
    id: 1,
    time: '00:00',
    seconds: 0,
    text: 'Welcome to this lecture on Operating Systems. Today we will understand the fundamentals of processes and how an operating system manages them.'
  },
  {
    id: 2,
    time: '00:32',
    seconds: 32,
    text: 'A process is a program that is currently under execution. Unlike a program, which is a passive entity, a process is an active entity.'
  },
  {
    id: 3,
    time: '01:05',
    seconds: 65,
    text: 'Every process has its own process control block, commonly known as PCB. It stores important information about the process.'
  },
  {
    id: 4,
    time: '01:42',
    seconds: 102,
    text: 'The process control block contains the process ID, process state, program counter, CPU registers and memory management information.'
  },
  {
    id: 5,
    time: '02:18',
    seconds: 138,
    text: 'A process can be in different states during its lifetime. The five common states are New, Ready, Running, Waiting and Terminated.'
  },
  {
    id: 6,
    time: '03:02',
    seconds: 182,
    text: 'The operating system uses a scheduler to decide which process gets the CPU. The CPU scheduler selects a process from the ready queue.'
  },
  {
    id: 7,
    time: '03:45',
    seconds: 225,
    text: 'Context switching occurs when the CPU switches from one process to another. The operating system saves the current process state and loads the next one.'
  },
  {
    id: 8,
    time: '04:30',
    seconds: 270,
    text: 'Understanding process management is essential because it helps us understand multitasking, CPU scheduling and resource management.'
  }
]

export default sampleTranscript
