// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()




//  let token=maptoken;

//     mapboxgl.accessToken = token;
    
//     const map = new mapboxgl.Map({
//       container: 'map',
//       center: [77.183014, 28.650244], // Adjust this to your desired location
//       zoom: 9
//     });