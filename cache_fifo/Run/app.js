window.onload = () => {
  const form = document.querySelector('#form');
  form.onsubmit = sumbitForm.bind(form);
}

const sumbitForm = (event) => {
  event.preventDefault();

  let inputs = event.target.querySelector('#inputs').value;
  let size = event.target.querySelector('#size').value;

  inputs = inputs.split(',').map(input => parseInt(input));
  size = parseInt(size);

  if (inputs.findIndex(input => isNaN(input)) !== -1) {
    return alert('Form inputs are not valid.');
  }

  if (isNaN(size)) {
    return alert('Form size is not valid.');
  }

  return fifo(inputs, size);
};

const fifo = (inputs, size) => {
  let miss = 0;
  let hit = 0;
  let lastIndex = 0;

  const stack = new Array(size);
  const history = new Array(size);
  const hitIndexs = new Array();

  inputs.forEach((input, index) => {
    if (stack.indexOf(input) === -1) {
      miss = miss + 1;

      stack[lastIndex] = input;

      if (lastIndex < (size - 1)) {
        lastIndex = lastIndex + 1;
      } else {
        lastIndex = 0;
      }
    } else {
      hit = hit + 1;

      hitIndexs.push({
        input,
        index,
      });
    }

    for (let i = 0; i < size; i++) {
      if (!Array.isArray(history[i])) {
        history[i] = new Array();
      }

      history[i].push(stack[i]);
    }
  });

  const hitRatio = (hit / (miss + hit));

  Handlebars.registerHelper('itContains', (num, index) => {
    const found = hitIndexs.find(hit => hit.index === index);

    if (num) {
      if (found && found.input === num) {
        return `${num}*`;
      }

      return num;
    }

    if (typeof num === 'undefined') {
      return '';
    }

    return (found ? 'H' : 'M');
  });

  const source = document.getElementById('resultTemplate').innerHTML;
  const template = Handlebars.compile(source);
  const html = template({
    inputs,
    miss,
    hit,
    hitIndexs,
    history,
    hitRatio,
  });

  document.querySelector('#result').innerHTML = html;
};
