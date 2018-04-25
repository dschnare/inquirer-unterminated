const iq = require('inquirer')

/*
Run this script like:
`node ./unterminated-process-test`
*/

// When `when` is falsey AND `timeConsumingTaskDuration` is more than 0 the
// process does not terminate as expected. Instead the process must be terminated
// by pressing Enter or Ctrl+C.

// When either `when` is truthy OR `timeConsumingTaskDuration` is 0 (meaning
// no time is consumed) then the process terminates as expected.

const when = false
const timeConsumingTaskDuration = 100 // milliseconds

function timeConsumingTask () {
  return new Promise(resolve => {
    if (timeConsumingTaskDuration <= 0) {
      resolve()
    } else {
      setTimeout(resolve, timeConsumingTaskDuration)
    }
  })
}

function askOne () {
  return iq.prompt([
    {
      type: 'list',
      name: 'driver',
      message: 'Choose your database driver',
      choices: [ 'One', 'Two' ],
      when
    },
    {
      type: 'input',
      name: 'migrationTable',
      message: 'What should the migration table name be?',
      default: 'migration',
      when
    },
    {
      type: 'input',
      name: 'migrationDir',
      message: 'What directory should migrations be written to?',
      default: 'migrations',
      when
    }
  ]).then(async (a) => {
    await timeConsumingTask(0)
    return a
  })
}

function askTwo () {
  return iq.prompt([{
    type: 'list',
    name: 'migrationType',
    message: 'Choose the type of migration',
    choices: [
      { name: 'Create table', value: 'create-table' },
      { name: 'Alter table', value: 'alter-table' },
      { name: 'Other', value: 'other' }
    ],
    when
  },
  {
    type: 'input',
    name: 'table',
    message: a => {
      return a.migrationType === 'other'
        ? 'What table is being migrated (optional)?'
        : 'What table is being migrated?'
    },
    validate: (table, a) => {
      if (a.migrationType !== 'other' && !table) {
        throw new Error('Please specify the table being migrated')
      } else {
        return true
      }
    },
    when
  },
  {
    type: 'input',
    name: 'migrationName',
    message: 'What is the file name of the migration?',
    default: (a) => {
      return Promise.resolve('hi')
    },
    when
  }])
}

async function test () {
  const a = await askOne()
  const b = await askOne()
  const c = await askTwo()
  console.log(a, b, c)
}

test()
