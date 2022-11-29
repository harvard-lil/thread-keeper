//------------------------------------------------------------------------------
// "form-submit" dialog logic
//------------------------------------------------------------------------------
const formSubmitDialog = document.querySelector("dialog#form-submit");

// Click on form submit button: check input validity, open "form-submit" dialog.
document.querySelector("body#index form button").addEventListener("click", (e) => {
  e.preventDefault();
  const url = document.querySelector("body#index form input[name='url']");
  const why = document.querySelector("body#index form input[name='why']");

  if (!url.checkValidity()) {
    url.reportValidity();
    return;
  }

  if (!why.checkValidity()) {
    why.reportValidity();
    return;
  }

  formSubmitDialog.showModal();
});

// Click on button in "form-submit" dialog: close dialog and submit form.
formSubmitDialog.querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();
  formSubmitDialog.close();
  document.querySelector("body#index form").submit();
});

//------------------------------------------------------------------------------
// "form-error" dialog logic
//------------------------------------------------------------------------------
const formErrorDialog = document.querySelector("dialog#form-error");

// Open on load if present, close on button click.
if (formErrorDialog) {
  formErrorDialog.showModal();

  formErrorDialog.querySelector("button").addEventListener("click", (e) => {
    formErrorDialog.close();
  })
}
