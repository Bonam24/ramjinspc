function getRandomNumber() {
    return Math.floor(Math.random() * 11);
  }
  getRandomNumber();

  function updateImage() {
    const picSelect = document.getElementById('pic');
    const selectedPic = document.getElementById('selectedPic');

    // Get the selected value (image path)
    const selectedValue = "../"+ picSelect.value;

    // Update the image source and make it visible
    selectedPic.src = selectedValue;
    selectedPic.style.display = 'block';
    console.log(selectedValue);
    
  }

  // Call updateImage on page load to display the first picture, if needed
  document.addEventListener('DOMContentLoaded', updateImage);
const pic = ["nicho2", "nicho3", "nicho4", "nicho5", "nicho6", "nicho7", "nicho8", "nicho9", "nicho10", "nicho11"];