
const sampleNotes = {
  title: 'Operating Systems',
  subject: 'Introduction to Processes',

  summary:
    'A process is a program in execution. The operating system manages processes by maintaining their states, allocating CPU time and handling context switching. Every process has a Process Control Block (PCB), which stores all essential information required for its execution.',

  keyConcepts: [
    {
      title: 'Process',
      description:
        'A process is an active instance of a program that is currently being executed by the CPU.'
    },
    {
      title: 'Process Control Block (PCB)',
      description:
        'A data structure maintained by the operating system that stores information about a process, such as its ID, state, program counter and CPU registers.'
    },
    {
      title: 'Process States',
      description:
        'A process generally moves through five states: New, Ready, Running, Waiting and Terminated.'
    },
    {
      title: 'CPU Scheduling',
      description:
        'The operating system scheduler selects a process from the ready queue and allocates CPU time to it.'
    },
    {
      title: 'Context Switching',
      description:
        'The process of saving the current process state and loading another process state so that the CPU can switch execution.'
    }
  ],

  importantPoints: [
    'A program is passive, whereas a process is active.',
    'Each process has a unique Process ID (PID).',
    'PCB stands for Process Control Block.',
    'The scheduler selects processes from the ready queue.',
    'Context switching introduces overhead because the CPU must save and restore process states.',
    'Process management is essential for multitasking.'
  ],

  revision: [
    {
      question: 'What is a process?',
      answer: 'A program currently under execution.'
    },
    {
      question: 'What is PCB?',
      answer: 'A data structure that stores information about a process.'
    },
    {
      question: 'Name the five process states.',
      answer: 'New, Ready, Running, Waiting and Terminated.'
    },
    {
      question: 'What is context switching?',
      answer: 'Saving one process state and loading another process state.'
    }
  ]
}

export default sampleNotes
