// Get the elements
const input = document.getElementById('numberInput');
const button = document.getElementById('doubleButton');
const result = document.getElementById('resultArea');

// Add click event
button.addEventListener('click', function() {
  const number = Number(input.value); // get the input value and make sure it's a number
  const doubled = number * 2;
  result.textContent = `Your magic number is: ${doubled}`;

  button.disabled = true;

  setTimeout(() => {
    result.style.opacity = '0';
    input.style.color = 'transparent';
    setTimeout(() => {
      result.textContent = ``;
      result.style.opacity = '1';
      input.value = ``;
      input.style.color = '';
      button.disabled = false;
    }, 1000);
  }, 1500);
 
});
