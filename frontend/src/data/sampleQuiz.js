
const sampleQuiz = {
  title: 'Operating Systems',
  subtitle: 'Introduction to Processes',

  questions: [
    {
      id: 1,
      question: 'What is a process in an operating system?',
      options: [
        'A program stored on a hard disk',
        'A program currently under execution',
        'A collection of files',
        'A type of memory'
      ],
      correctAnswer: 1,
      explanation:
        'A process is an active instance of a program that is currently being executed by the CPU.'
    },
    {
      id: 2,
      question: 'What is the full form of PCB?',
      options: [
        'Program Control Block',
        'Process Communication Buffer',
        'Process Control Block',
        'Program Communication Block'
      ],
      correctAnswer: 2,
      explanation:
        'PCB stands for Process Control Block. It stores information about a process.'
    },
    {
      id: 3,
      question: 'Which of the following is NOT a common process state?',
      options: [
        'Ready',
        'Running',
        'Waiting',
        'Compiling'
      ],
      correctAnswer: 3,
      explanation:
        'The five common process states are New, Ready, Running, Waiting and Terminated.'
    },
    {
      id: 4,
      question: 'Which component selects a process from the ready queue?',
      options: [
        'Compiler',
        'CPU Scheduler',
        'File Manager',
        'Memory Allocator'
      ],
      correctAnswer: 1,
      explanation:
        'The CPU scheduler selects a process from the ready queue for execution.'
    },
    {
      id: 5,
      question: 'What happens during context switching?',
      options: [
        'A process is permanently deleted',
        'The CPU is turned off',
        'The current process state is saved and another is loaded',
        'The program is compiled again'
      ],
      correctAnswer: 2,
      explanation:
        'Context switching saves the state of the currently running process and restores the state of another process.'
    },
    {
      id: 6,
      question: 'Which information is stored in a PCB?',
      options: [
        'Process ID',
        'Process state',
        'CPU registers',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation:
        'A PCB contains the PID, process state, program counter, CPU registers and other process information.'
    },
    {
      id: 7,
      question: 'Which state indicates that a process is waiting for an event?',
      options: [
        'Ready',
        'Running',
        'Waiting',
        'Terminated'
      ],
      correctAnswer: 2,
      explanation:
        'A process enters the Waiting or Blocked state when it waits for an event, such as I/O completion.'
    },
    {
      id: 8,
      question: 'What is the main purpose of process scheduling?',
      options: [
        'To manage CPU allocation among processes',
        'To delete unused files',
        'To increase disk size',
        'To compile source code'
      ],
      correctAnswer: 0,
      explanation:
        'Process scheduling determines which ready process gets CPU time.'
    }
  ]
}

export default sampleQuiz
