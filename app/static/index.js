//------------------------------------------------------------------------------
// "form-submit" dialog logic
//------------------------------------------------------------------------------

// Click on form submit button: check input validity, open "form-submit" dialog.
document.querySelector("body#index form button").addEventListener("click", (e) => {
  e.preventDefault();
  const url = document.querySelector("body#index form input[name='url']");
  const accessKey = document.querySelector("body#index form input[name='access-key']")

  if (!url.checkValidity()) {
    url.reportValidity();
    return;
  }

  if (!accessKey.checkValidity()) {
    accessKey.reportValidity();
    return;
  }

  document.querySelector("dialog#form-submit").showModal();
});

// Click on button in "form-submit" dialog: close dialog and submit form.
document.querySelector("dialog#form-submit button").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("dialog#form-submit").close();
  document.querySelector("body#index form").submit();
});


//------------------------------------------------------------------------------
// "form-error" dialog logic
//------------------------------------------------------------------------------

// Open on load if present, close on button click.
const formErrorDialog = document.querySelector("dialog#form-error");

if (formErrorDialog) {
  formErrorDialog.showModal();

  formErrorDialog.querySelector("button").addEventListener("click", (e) => {
    formErrorDialog.close();
  })
}
