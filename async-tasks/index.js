exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event, null, 3));
  const task = JSON.parse(event.Records[0].body);
  console.log(JSON.stringify(task, null, 3));
  try {
    await require(`./tasks/${task.action}`)(task);
  } catch (err) {
    console.error(err);
  }
  return;
};
